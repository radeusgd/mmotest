var layersCount = 7;
var chunkSize = 8;
var tileSize = 64;

function localChunkPosToArray(x,y,z){
   return x+y*chunkSize+z*chunkSize*chunkSize;
}

function createChunk(chunk){//renders the chunk and returns its sprite
   var sprites = new Array(layersCount);
   var tmpImage = new Phaser.Sprite(game,0,0,'tile1',0);
   for(var i=0;i<layersCount;i++){
      var sprite = game.add.renderTexture(tileSize*chunkSize,tileSize*chunkSize);//TODO '', true?
      for(var x=0;x<chunkSize;x++){
         for(var y=0;y<chunkSize;y++){
               var tile = chunk[localChunkPosToArray(x,y,i)];
               if(tile !== undefined && tile!=10000){
                  tmpImage.animations.frame = tile;
                  sprite.renderXY(tmpImage, x*tileSize, y*tileSize, false);
               }
         }
      }
      sprites[i] = sprite;
   }
   tmpImage.destroy(true);
   return sprites;
}

function makeWorldChunk(chunk, x,y){
   var s = createChunk(chunk);
   var img = new Array(layersCount);
   for(var i=0;i<layersCount;i++){
         img[i] = game.add.image(x*tileSize*chunkSize,y*tileSize*chunkSize, s[i]);//TODO destroying the texture might be needed? or GC?
         img[i].depth = 100*i;
   }
   return img;
}
