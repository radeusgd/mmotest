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
         //var tile = 30+x+40*y;
         chunk[localChunkPosToArray(x,y,0)] = 23*2+1;
         if(Math.random()>0.8){
            chunk[localChunkPosToArray(x,y,1)] = 23*7;
         }
      }
   }
   return chunk;
}

function createChunk(chunk){//renders the chunk and returns its sprite
   var sprites = new Array(layersCount);
   for(var i=0;i<layersCount;i++){
      var sprite = game.add.renderTexture(tileSize*chunkSize,tileSize*chunkSize);//TODO '', true?
      for(var x=0;x<chunkSize;x++){
         for(var y=0;y<chunkSize;y++){
               var tile = chunk[localChunkPosToArray(x,y,i)];
               if(tile !== undefined){
                  var img = new Phaser.Image(game,0,0,'tile1', tile);
                  sprite.renderXY(img, x*tileSize, y*tileSize, false);
                  img.destroy(true);
               }
         }
      }
      sprites[i] = sprite;
   }
   return sprites;
}

function makeWorldChunk(x,y){
   var c = generateChunk(x,y);
   var s = createChunk(c);
   var img = new Array(layersCount);
   for(var i=0;i<layersCount;i++){
         img[i] = game.add.image(x*tileSize*chunkSize,y*tileSize*chunkSize, s[i]);//TODO destroying the texture might be needed? or GC?
         img[i].z = 100*i;
   }
   return img;
}
