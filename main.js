var readline = require('readline');
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var rl = readline.createInterface(process.stdin, process.stdout);
rl.setPrompt('$> ');
rl.prompt();
rl.on('line', function(line) {
	words = line.split(" ");
	switch(words[0]){
		case "say":
			var message = "[SERVER] "+words.slice(1).join(" ");
			io.emit('message', message);
			console.log(message);
		break;
		case "stop":
			io.emit('disconnecting', "Server shutting down");
			rl.close();
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
//var tileSize = 64;//probly not needed
var chunkSize = 8;
var layersCount = 7;
var pid = 123;
io.on('connection', function(socket){
	console.log('a user connected');
	socket.id = pid++;
	socket.player = {};
	socket.player.x = 3.5*chunkSize;
	socket.player.y = 3.5*chunkSize;
	socket.emit('init', {
		id: socket.id,
		x: socket.player.x,
		y: socket.player.y,//TODO is world pos needed?
	});
	socket.on('chat_message', function(text){
		if(text==="") return;
		console.log("User: "+text);
		io.emit('message', "User: "+text);
	});
	socket.on('moved', function(movement){
		//TODO check if can move
		socket.player.x+=movement.x;
		socket.player.y+=movement.y;
		io.emit('playerMoved', {id: socket.id, x: socket.player.x, y: socket.player.y});
	});
	socket.on('requestChunk', function(pos){
		//TODO pos.checksum for caching
		var chunk = generateChunk(pos.x,pos.y);//TODO some saving, caching etc
		console.log("Sent chunk ",pos.x,", ",pos.y);
		io.emit('chunk',{
			chunk: chunk,
			x: pos.x,
			y: pos.y
		});
	});

});


function localChunkPosToArray(x,y,z){
	return x+y*chunkSize+z*chunkSize*chunkSize;
}
function generateChunk(xx,yy){//temporary function for proc gen
	var chunk = new Uint16Array(chunkSize*chunkSize*layersCount);
	for(var x=0;x<chunkSize;x++){
		for(var y=0;y<chunkSize;y++){
			for(var z=0;z<layersCount;z++){
				chunk[localChunkPosToArray(x,y,z)]=10000;
			}
			//var tile = 30+x+40*y;
			chunk[localChunkPosToArray(x,y,0)] = 23*2+1;
			if(Math.random()>0.8){
				chunk[localChunkPosToArray(x,y,1)] = 23*7;
			}
		}
	}
	return chunk;
}
