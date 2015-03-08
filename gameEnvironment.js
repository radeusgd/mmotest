var GameEnvironment = function(database, world){
   this.db = database;
   this.world = world;
};

GameEnvironment.prototype.getWorld = function(){
   return this.world;
};

module.exports = GameEnvironment;
