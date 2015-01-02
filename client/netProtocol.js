pendingTransfers = {};

function generateChunk(xx,yy){//TEMP TODO DELETE temporary function for proc gen
var chunk = new Array(chunkSize*chunkSize*layersCount);
for(var x=0;x<chunkSize;x++){
for(var y=0;y<chunkSize;y++){
//var tile = 30+x+40*y;
chunk[localChunkPosToArray(x,y,0)] = 23*2+1;
if(Math.random()>0.8){
chunk[localChunkPosToArray(x,y,1)] = 23*7;
}
}
}
return chunk;
}

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
}

function requestChunk(x,y){
   pendingTransfers[(x)+'x'+(y)] = true;
   //TODO net
   setTimeout(function(){
      delete pendingTransfers[(x)+'x'+(y)];
      console.log("Net sim");
      var chunk = generateChunk(x,y);
      onChunkReceived(chunk, {x:x,y:y});
   }, Math.random()*2300+100);//lulz
}

function sendMoved(dx,dy){
   socket.emit('moved', {x:dx,y:dy});
}
