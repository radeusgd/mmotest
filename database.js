var Database = function(){
   var Engine = require('tingodb')();
   this.db = new Engine.Db('./database.db', {});
   this.accounts = this.db.createCollection('accounts');
   this.accounts.ensureIndex( { username: 1 }, { unique: true, dropDups: true } );
};

Database.prototype.register = function(username, password, res){
      //TODO hash the password, for now its experiments so yeah
      this.accounts.insert({username: username, password: password}, function(err, result){
         if(err){
            res.send("An error occured");
            console.dir(err);
         }else{
            res.send("Registration successfull, you can now log in");
         }
      });
};

Database.prototype.authenticate = function(username, password, success, fail){
   //TODO hash the password, for now its experiments so yeah
   this.accounts.findOne({username: username, password: password}, function(err, item){
      if(err){
         fail();
         return;
      }
      success(item._id);//TODO in mongo this won't be int32, so fix it
   });
};

module.exports = function(){
   return new Database();
};
