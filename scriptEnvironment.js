var ScriptEnvironment = function(database, world){
   this.db = database;
   this.world = world;
};

/*ScriptEnvironment.prototype.getWorld = function(){
   return this.world;
};*/

ScriptEnvironment.prototype.setBlockAtPosition = function(x,y,z,id){
   this.world.setBlockAtPosition(x,y,z,id);
};


module.exports = ScriptEnvironment;
