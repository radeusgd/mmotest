var Database = function(){
   var Engine = require('tingodb')();
   this.db = new Engine.Db('./database.db', {});
};

Database.prototype.register = function(username, password, res){
      res.send('hi from DB');
};

module.exports = function(){
   return new Database();
};
