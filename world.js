var chunkSize = 8;
var layersCount = 7;//TODO how many?

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


function generateChunk(xx,yy){//temporary function for proc gen
   //console.log("Generating new chunk");
   var chunk = new Uint16Array(chunkSize*chunkSize*layersCount);
   for(var x=0;x<chunkSize;x++){
      for(var y=0;y<chunkSize;y++){
         for(var z=0;z<layersCount;z++){
            chunk[localChunkPosToArray(x,y,z)]=10000;
         }
         //var tile = 30+x+40*y;
         chunk[localChunkPosToArray(x,y,0)] = 23*2+1;
         if(Math.random()>0.8){
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
