var chunkSize = 8;
var layersCount = 7;//TODO how many?
var noise = require('./perlin.js');

noise.seed(Math.random());

var World = function(database, handlers){
   this.db = database;
   this.chunkSize = chunkSize;
   this.layersCount = layersCount;
   for(var handler in handlers){
      this[handler] = handlers[handler];
   }
};

function localChunkPosToArray(x,y,z){
   return x+y*chunkSize+z*chunkSize*chunkSize;
}

function getGroundAtPos(x,y){
   var grass = 47;
   var sand = [122,168];
   var perlin = noise.simplex2((x / 30), (y) / 30);
   var ground = grass;
   if(perlin>0.5){
      var s = noise.simplex2(x*5, y*5);
      if(s>0.5) s=1;
      else s=0;
      ground = sand[s];
   }
   return ground;
}

function generateChunk(xx,yy){//temporary function for proc gen
   //console.log("Generating new chunk");
   var chunk = new Uint16Array(chunkSize*chunkSize*layersCount);
   for(var x=0;x<chunkSize;x++){
      for(var y=0;y<chunkSize;y++){
         for(var z=0;z<layersCount;z++){
            chunk[localChunkPosToArray(x,y,z)]=10000;
         }
         //var tile = 30+x+40*y;

         var ground = getGroundAtPos(xx*chunkSize+x,yy*chunkSize+y);
         chunk[localChunkPosToArray(x,y,0)] = ground;
         if(ground == 47 && Math.random()>0.9){
            chunk[localChunkPosToArray(x,y,1)] = 23*7;
         }
      }
   }
   return chunk;
}

World.prototype.getChunk = function(x,y, callback){
   var db = this.db;
   db.getChunk(x,y,function(chunk){//success
      callback(chunk);
   },
   function(){//fail
      var chunk = generateChunk(x,y);
      db.updateChunk(x,y,chunk);
      callback(chunk);
   });
};

World.prototype.setBlockAtPosition = function(x,y,z,id){
   var db = this.db;//for closure
   var world = this;
   var pos = {x:Math.floor(x/chunkSize),y:Math.floor(y/chunkSize)};
   this.getChunk(pos.x,pos.y, function(chunk){
      chunk[localChunkPosToArray(x-pos.x*chunkSize,y-pos.y*chunkSize,z)] = id;
      db.updateChunk(pos.x,pos.y,chunk);
      world.chunkUpdate(pos.x,pos.y,chunk);
   });
};

World.prototype.interact = function(player, x,y){
   //TODO
};

module.exports = function(db, handlers){
   return new World(db,handlers);
};
