var layersCount = 7;
var chunkSize = 8;
var tileSize = 64;

function localChunkPosToArray(x,y,z){
   return x+y*chunkSize+z*chunkSize*chunkSize;
}

function generateChunk(xx,yy){//temporary function for proc gen
   var chunk = new Array(chunkSize*chunkSize*layersCount);
   for(var x=0;x<chunkSize;x++){
      for(var y=0;y<chunkSize;y++){
         var tile = 30+x+40*y;
         chunk[localChunkPosToArray(x,y,0)] = tile;
      }
   }
   return chunk;
}

function createChunk(chunk){//renders the chunk and returns its sprite
   var sprite = game.add.renderTexture(tileSize*chunkSize,tileSize*chunkSize);//TODO '', true?
   for(var x=0;x<chunkSize;x++){
      for(var y=0;y<chunkSize;y++){
            var img = new Phaser.Image(game,0,0,'tile1', chunk[localChunkPosToArray(x,y,0)]);//TODO Zindex
            sprite.renderXY(img, x*tileSize, y*tileSize, false);
            img.destroy(true);
      }
   }
   return sprite;
}

function makeWorldChunk(x,y){
   var c = generateChunk(x,y);
   var s = createChunk(c);
   var img = game.add.image(x*chunkSize*tileSize, y*chunkSize*tileSize, s);//TODO destroying the texture might be needed? or GC?
   return img;
}
