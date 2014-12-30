var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
app.get('/', function(req, res){ 
	res.sendfile('client/index.html');
	console.log("DEBUG: Index served");
});
io.on('connection', function(socket){ 
	console.log('a user connected');
	socket.on('chat_message', function(text){
		if(text=="") return;
		console.log("User: "+text);
		io.emit('message', "User: "+text);
	});
});
http.listen(3000, function(){ 
	console.log('listening on *:3000');
});


