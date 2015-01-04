var World = function(database){
   this.db = database;
};

World.prototype.test = function(){
   this.db.test();
};

module.exports = function(db){
   return new World(db);
};
