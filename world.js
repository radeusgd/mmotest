var chunkSize = 8;
var layersCount = 7;//TODO how many?

var World = function(database){
   this.db = database;
   this.chunkSize = chunkSize;
   this.layersCount = layersCount;
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

module.exports = function(db){
   return new World(db);
};
