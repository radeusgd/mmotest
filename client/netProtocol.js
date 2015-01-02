pendingTransfers = {};

function setUpProtocol(){
   socket.on('init', function(data){
      player.id = data.id;
      player.target.x = player.x = data.x*64;
      player.target.y = player.y = data.y*64;
      log("Local id set to "+data.id);
   });
   socket.on('playerMoved', function(data){
      //console.log(data);
      allPlayers.forEach(function(player){
            if(player.id == data.id){
               //TODO world->local
               var x = data.x-currentTerrainPos.x*chunkSize;
               var y = data.y-currentTerrainPos.y*chunkSize;
               player.target.x = x*64;
               player.target.y = y*64;
            }
      });
   });
   socket.on('chunk', function(data){
      //console.log(data);
      //TODO: cache
      var x = data.x;
      var y = data.y;
      onChunkReceived(data.chunk, {x:x,y:y});
      delete pendingTransfers[(x)+'x'+(y)];
   });
}

function requestChunk(x,y){
   pendingTransfers[(x)+'x'+(y)] = true;
   //TODO cache
   socket.emit('requestChunk',{x:x,y:y});
}

function sendMoved(dx,dy){
   socket.emit('moved', {x:dx,y:dy});
}
