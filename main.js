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


io.on('connection', function(socket){
	console.log('a user connected');
	socket.on('chat_message', function(text){
		if(text==="") return;
		console.log("User: "+text);
		io.emit('message', "User: "+text);
	});
});

http.listen(3000, function(){
	console.log('listening on *:3000');
});
