var Database = function(){
   var Engine = require('tingodb')();
   this.db = new Engine.Db('./database.db', {});
};

Database.prototype.test = function(){
      console.log("TEST");
};

module.exports = function(){
   return new Database();
};
