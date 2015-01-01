terrain = new Array(7*7);
currentTerrainPos = {x:0,y:0};
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
            terrain[(x+dx)+7*(y+dy)] = undefined;
         }
      }
   }
   for(x=0;x<7;x++){
      for(y=0;y<7;y++){
            if(terrain[x+y*7]!==undefined){
               for(var elem in terrain[x+y*7]){
                     elem.destroy(true);
               }
               //TODO cache
            }
      }
   }
   terrain = newTerrain;
}
function updateTerrains(){
   var actionTaken = false;
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
