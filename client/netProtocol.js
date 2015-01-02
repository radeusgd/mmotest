pendingTransfers = {};

function serverToLocalPos(x,y){
   return {
         x: (x-currentTerrainPos.x*chunkSize)*tileSize,
         y: (y-currentTerrainPos.y*chunkSize)*tileSize,
   };
}

function setUpProtocol(){
   socket.on('init', function(data){
      player.id = data.id;
      player.x = data.x*tileSize;
      player.target.x = data.x*tileSize;
      player.y = data.y*tileSize;
      player.target.y = data.y*tileSize;
      log("Local id set to "+data.id);
   });
   socket.on('addPlayer', function(data){
      //console.log(data);
      if(data.id==player.id) return;//it's me hey
         //TODO if it's me I can still download clothing here!!
      var pos = serverToLocalPos(data.x, data.y);
      var p = createPlayer(pos.x,pos.y);
      p.id = data.id;
   });
   socket.on('removePlayer', function(data){
      //console.log("removing", data);
      if(data.id==player.id){
         return;//it's me hey//TODO sure?
      }
      for(var i=0;i<allPlayers.length;i++){
         if(allPlayers[i].id == data.id){
            allPlayers[i].destroy(true);//destroy the player
            allPlayers.splice(i,1);//remove him
            break;//collection changed we have to break, so assume only 1 player id
         }
      }
   });
   socket.on('playerMoved', function(data){
      //console.log(data);
      if(data.id==player.id){
         return;//if it's me I don't care unless I get 'cannotMove'
      }
      allPlayers.forEach(function(player){
            if(player.id == data.id){
               //TODO world->local
               var pos = serverToLocalPos(data.x, data.y);
               player.target.x = pos.x;
               player.target.y = pos.y;
            }
      });
   });
   socket.on('cannotMove', function(data){
      var pos = serverToLocalPos(data.x, data.y);
      player.x = pos.x;
      player.y = pos.y;
      player.target.x = pos.x;
      player.target.y = pos.y;
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

function disconnectHandler(){
   //we've been disconnected, clean up the session

   //remove all players but me
   allPlayers.forEach(function(p){
      if(p!=player){
         p.destroy(true);
      }
   });
   allPlayers = [player];
}

function requestChunk(x,y){
   pendingTransfers[(x)+'x'+(y)] = true;
   //TODO cache
   socket.emit('requestChunk',{x:x,y:y});
}

function sendMoved(dx,dy){
   socket.emit('moved', {x:dx,y:dy});
}
