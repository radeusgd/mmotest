var readline = require('readline');
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var db = require('./database.js')();//auth, inventory, ?
var world = require('./world.js')(db);//terrain, editing, collision
//TODO NPCs system/mobs, ?


var rl = readline.createInterface(process.stdin, process.stdout);
rl.setPrompt('$> ');
rl.prompt();
rl.on('line', function(line) {
	words = line.split(" ");
	switch(words[0]){
		case "say":
			var message = "[SERVER] "+words.slice(1).join(" ");
			say(message);
			console.log(message);
		break;
		case "stop":
			io.emit('disconnecting', "Server shutting down");
			rl.close();
		break;
		case "list":
			console.log("Players:");
			for(var i=0;i<players.length;i++){
					console.log("(",players[i].id,") - ", players[i].request.connection.remoteAddress);
			}
		break;
		default:
			//console.log("Invalid command");
	}
	rl.prompt();
});
rl.on('close',function(){
    process.exit(0);
});

app.use(express.static(__dirname + '/client'));
app.get('/dynamictest', function(req, res){
	console.log("Dynamic content serving test");
});

http.listen(3000, function(){
	console.log('listening on *:3000');
});

///SERVER IMPLEMENTATION STARTS

var pid = 123;
players = [];
io.on('connection', function(socket){
	console.log('Player joined, ip:', socket.request.connection.remoteAddress);
	say("Player joined");
	socket.id = pid++;
	socket.player = {};
	socket.player.x = 3.5*world.chunkSize;
	socket.player.y = 3.5*world.chunkSize;
	socket.emit('init', {
		id: socket.id,
		x: socket.player.x,
		y: socket.player.y,//TODO is world pos needed?
	});

	for(var i=0;i<players.length;i++){
		sendPlayer(players[i], socket);//send them to me
	}
	sendPlayer(socket, io);//send me to all

	players.push(socket);
	socket.on('chat_message', function(text){
		if(text==="") return;
		console.log("["+socket.id+"] "+text);
		io.emit('chat_message', {id: socket.id, text: text});
	});
	socket.on('moved', function(movement){
		//TODO check if can move
		//if cannot send him a 'cannotMove' message so he can update his pos appropriately
		socket.player.x+=movement.x;
		socket.player.y+=movement.y;
		io.emit('playerMoved', {id: socket.id, x: socket.player.x, y: socket.player.y});
	});
	socket.on('requestChunk', function(pos){
		//TODO pos.checksum for caching
		var chunk = world.getChunk(pos.x,pos.y);
		//console.log("Sent chunk ",pos.x,", ",pos.y);
		socket.emit('chunk',{
			chunk: chunk,
			x: pos.x,
			y: pos.y
		});
	});
	socket.on('disconnect', function(){
		players.splice(players.indexOf(socket),1);//remove
		say("Player disconnected");
		io.emit('removePlayer',{id: socket.id});
		console.log("Player disconnected");
	});


});

function say(text){
	io.emit('message', text);
}

function sendPlayer(who, to){
	to.emit('addPlayer', {id: who.id, x: who.player.x, y: who.player.y});
	//TODO set clothes
}
