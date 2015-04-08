
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var config = require('./config.js');
var utils = require('./utils');
var db = require('./database.js')();//auth, inventory, ?
var world = require('./world.js')(db,{chunkUpdate:chunkUpdated});//terrain, editing, collision
//TODO NPCs system/mobs, ?
var scriptenvironment = require('./scriptEnvironment.js')(db,world);
var items = require('./itemtypes');
//console.log(new items["testitem"]());
world.scriptenvironment = scriptenvironment;

var serverConsole = require('./console')(config.interactive);
serverConsole.on('say',function(words){
	var message = "[SERVER] "+words.slice(1).join(" ");
	say(message);
	console.log(message);
});
serverConsole.on('stop',function(words){
	io.emit('disconnecting', "Server shutting down");
	process.exit(0);
});
serverConsole.on('list',function(words){
	if(players.length===0){
		console.log("No players connected");
	}else{
		console.log("Players:");
		for(var i=0;i<players.length;i++){
			console.log(players[i].player.username+" (",players[i].id,") - ", players[i].ip);
		}
	}
});
serverConsole.on('tp',function(words){
	var p1 = findPlayer(words[1]);
	var p2 = findPlayer(words[2]);
	if(p1 && p2){
		p1.player.x=p2.player.x;
		p1.player.y=p2.player.y;
		io.emit('playerMoved', {id: p1.id, x: p1.player.x, y: p1.player.y});
		console.log("Teleported");
	}else{
		console.log("Wrong player name");
	}
});
serverConsole.on('makeadmin',function(words){
	var p1 = findPlayer(words[1]);
	if(p1){
		if(words[2]=="true"){
			db.setAdminPrivileges(p1,true);
			console.log(words[1]+" is now admin");
		}else{
			db.setAdminPrivileges(p1,false);
			console.log(words[1]+" is no longer admin");
		}
	}else{
		console.log("No such player connected");
	}
});
serverConsole.on('give',function(words){
	var player = findPlayer(words[1]);
	if(player === undefined || items[words[2]]===undefined){
		console.log("Cannot find player/item");
		return;
	}
	var item = new items[words[2]].item;
	scriptenvironment.givePlayerItem(item,player);
	console.log("Item given (probably)");
});
serverConsole.on('getitems',function(words){
	var player = findPlayer(words[1]);
	if(player === undefined){
		console.log("Cannot find player");
		return;
	}
	var details = (words[2] == "detailed");
	scriptenvironment.getPlayerItems(player, function(inventory){
		console.log("Items of "+player.player.username);
		for(var i=0;i<inventory.length;++i){
			if(details){
				console.log(inventory[i]);
			}else{
				if(inventory[i].stackable){
					console.log(inventory[i].name+": "+inventory[i].amount);
				}else{
					console.log(inventory[i].name);
				}
			}
		}
		if(inventory.length===0){
			console.log("No items");
		}
	});
});

var bodyparser = require('body-parser');
app.use(express.static(__dirname + '/client'));
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended:true}));
app.get('/register', function(req, res){
	res.sendFile('client/register.html', {root:__dirname});
});
app.post('/register', function(req, res){
	if(req.param('submit', 'nope')=='nope' || req.param('username', '~~~')=='~~~' || req.param('password', '~~~')=='~~~'){
		res.sendFile('client/register.html', {root:__dirname});
		return;
	}
	db.register(req.param('username'), req.param('password'), res);
});

http.listen(config.port, function(){
	console.log('listening on *:'+config.port);
	if(process.argv[2]=="test"){
		console.log("Test mode, shutting down in 3s");
		setTimeout(function(){
			console.log("[TEST] Shutting down");
			process.exit(0);
		},3000);
	}
});

///SERVER IMPLEMENTATION STARTS

//var pid = 123;
players = [];
io.on('connection', function(socket){
	console.log('Player joined, ip:', socket.request.connection.remoteAddress);
	socket.on('auth', function(data){
		if(socket.player===undefined){//TODO check auth id for dups
			db.authenticate(data.username, data.password,
			function(id){
				initPlayer(socket, id, data.username);
				console.log(data.username+" ("+socket.id+") successfully authenticated");
			},
			function(){
				socket.emit('authFailed');
			});
		}else{
			console.log("Player already authenticated");
		}
	});

	//socket.emit("authRequest");//user should initialize auth
});

function chunkUpdated(x,y,chunk){
	//resend the chunk
	var compressed = utils.compressChunk(chunk);
	io.emit('chunk',{
		chunk: compressed,
		x: x,
		y: y
	});
};

function initPlayer(socket,id,username){
	socket.id = id;
	socket.player = {};
	socket.player.x = 3.5*world.chunkSize;
	socket.player.y = 3.5*world.chunkSize;
	socket.emit('init', {
		id: socket.id,
		x: socket.player.x,
		y: socket.player.y,//TODO is world pos needed?
	});

	players.push(socket);
	for(var i=0;i<players.length;i++){
		sendPlayer(players[i], socket);//send them to me
	}
	socket.player.username = username;
	socket.ip = socket.request.connection.remoteAddress;
	say("Player "+username+" joined");
	sendPlayer(socket, io);//send me to all
	socket.player.chunk = {};

	socket.say = function(message){
		socket.emit('message',message);
	};

	socket.on("ping", function(t){
		socket.emit("pong",t);
	});
	socket.on('chat_message', function(text){
		if(text==="") return;
		if(text[0]=="/"){
			db.ifHasAdminPrivileges(socket,function(player){
				if(serverConsole.command(text.substring(1))){
					player.emit('message',"Command executed");
				}else{
					player.emit('message',"No such command");
				}
			});
		}else{
			console.log("["+username+"/"+socket.id+"] "+text);
			io.emit('chat_message', {id: socket.id, text: text});
		}
	});
	socket.on('moved', function(movement){
		canMove(socket.player,movement,function(can){//check if can move
			if(can){
			//if cannot send him a 'cannotMove' message so he can update his pos appropriately
				socket.player.x+=movement.x;
				socket.player.y+=movement.y;
				io.emit('playerMoved', {id: socket.id, x: socket.player.x, y: socket.player.y});
			}else{
				socket.emit('cannotMove',{x: socket.player.x, y: socket.player.y});
			}
		});
	});
	socket.on('requestChunk', function(pos){
		//TODO cache
		//TODO pos.checksum for caching
		world.getChunk(pos.x,pos.y, function(chunk){
			//console.log("Sent chunk ",pos.x,", ",pos.y);
			var compressed = utils.compressChunk(chunk);
			//console.log("Transferring "+compressed.length+" bytes");
			socket.emit('chunk',{
				chunk: compressed,
				x: pos.x,
				y: pos.y
			});
		});
	});
	socket.on('placeBlock', function(data){
		world.setBlockAtPosition(socket.player.x+data.x,socket.player.y+data.y,data.z,data.id);
	});
	socket.on('disconnect', function(){
		players.splice(players.indexOf(socket),1);//remove
		if(socket.username) say("Player "+socket.username+" disconnected");
		io.emit('removePlayer',{id: socket.id});
		console.log("Player disconnected");
	});

}

function say(text){
	io.emit('message', text);
}

function sendPlayer(who, to){
	to.emit('addPlayer', {id: who.id, x: who.player.x, y: who.player.y, name: who.player.username});
	//TODO set clothes etc
}

var notWalkableTiles = [138,161,249,250,251,226,227,228,486];
function isWalkable(tileId){
	if(notWalkableTiles.indexOf(tileId) != -1) return false;
	return true;
}

function canMove(player, movement, callback){
	var chunkSize = world.chunkSize;
	if(movement.x+movement.y>1) return false;
	var pos = {x:Math.floor((player.x+movement.x)/chunkSize),y:Math.floor((player.y+movement.y)/chunkSize)};
	var check = function(chunk){
		var chunkPos = {x:player.x+movement.x-pos.x*chunkSize,y:player.y+movement.y-pos.y*chunkSize};
		if(isWalkable(chunk[chunkPos.x+chunkPos.y*chunkSize+1*chunkSize*chunkSize]) && isWalkable(chunk[chunkPos.x+chunkPos.y*chunkSize+0*chunkSize*chunkSize])){
			callback(true);
		}else{
			callback(false);
		}
	};
	//if(!(player.chunk.x==pos.x && player.chunk.y==pos.y)){
		world.getChunk(pos.x,pos.y, check);
	//}else{
	//	check(player.chunk);//but update breaks it, so maybe not cache it now...
	//}
}
function findPlayer(username){
	for(var i=0;i<players.length;i++){
		if(players[i].player.username==username) return players[i];
	}
	return undefined;
}
