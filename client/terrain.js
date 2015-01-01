terrain = new Array(7*7);
currentTerrainPos = {x:0,y:0};//IMPORTANT - complements player.xy for a full player position
function move(dx,dy){
   var x,y;
   currentTerrainPos.x+=dx;
   currentTerrainPos.y+=dy;
   newTerrain = new Array(7*7);
   for(x=0;x<7;x++){
      for(y=0;y<7;y++){
         if(x+dx>=0 && x+dx<7 && y+dy>=0 && y+dy<7){
            newTerrain[x+y*7] = terrain[(x+dx)+7*(y+dy)];
            //TODO move positions in world
            terrain[(x+dx)+7*(y+dy)] = false;
         }
      }
   }
   //console.log(terrain);
   for(x=0;x<7;x++){
      for(y=0;y<7;y++){
            if(terrain[x+y*7]!==undefined && terrain[x+y*7]!==false){
               for(var i=0;i<terrain[x+y*7].length;i++){
                  terrain[x+y*7][i].destroy(true);
               }
               //TODO cache
            }
      }
   }
   terrain = newTerrain;
   game.world.forEach(function(child,dx,dy){
      child.x -= dx*tileSize*chunkSize;
      child.y -= dy*tileSize*chunkSize;
   },this, false, dx, dy);
}
function updateTerrains(){
   var center = 3.5*chunkSize*tileSize;
   var halfchunk = 0.5*chunkSize*tileSize;
   //should we move player
   if(player.x>center+halfchunk){
      move(1,0);
   }
   if(player.x<center-halfchunk){
      move(-1,0);
   }
   if(player.y>center+halfchunk){
      move(0,1);
   }
   if(player.y<center-halfchunk){
      move(0,-1);
   }
   //request surroundings
   for(x=1;x<6;x++){//priority needed?
      for(y=1;y<6;y++){
         if(terrain[x+y*7]===undefined && (pendingTransfers[(x+currentTerrainPos.x)+'x'+(y+currentTerrainPos.y)]!==true)){
               requestChunk(x+currentTerrainPos.x,y+currentTerrainPos.y);
         }
      }
   }
}

function onChunkReceived(chunk, pos){
   if(pos.x>=currentTerrainPos.x && pos.x<currentTerrainPos.x+7 && pos.y>=currentTerrainPos.y && pos.y<currentTerrainPos.y+7){
      var x = pos.x - currentTerrainPos.x;
      var y = pos.y - currentTerrainPos.y;
      terrain[x+y*7] = makeWorldChunk(chunk, x,y);
   }else{
      //sorry you discarded
      //TODO cache
   }
}
