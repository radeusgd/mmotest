var utils = require('./utils');

var Database = function(){
   var Engine = require('tingodb')();
   this.db = new Engine.Db('./database.db', {});
   this.accounts = this.db.createCollection('accounts');
   this.accounts.ensureIndex( { username: 1 }, { unique: true, dropDups: true } );
   this.terrain = this.db.createCollection('terrain');
};
///////////////////////AUTH
Database.prototype.register = function(username, password, res){
      //TODO hash the password, for now its experiments so yeah
      this.accounts.insert({username: username, password: password}, function(err, result){
         if(err){
            res.send("An error occured");
            console.dir(err);
         }else{
            res.send("Registration successfull, you can now <a href=\"/\">log in</a>.");
         }
      });
};

Database.prototype.authenticate = function(username, password, success, fail){
   //should I hash the password, for now its experiments so yeah
   //the password is already hashed in JS clientside
   this.accounts.findOne({username: username, password: password}, function(err, item){
      if(err){
         fail();
         return;
      }
      success(item._id);//TODO in mongo this won't be int32, so fix it
   });
};

Database.prototype.ifHasAdminPrivileges = function(player, callback){
   this.accounts.findOne({username: player.player.username}, function(err, item){
      if(err){
         //console.log("Privilege query: Error "+err);
         return;
      }
      if((""+item._id)==(""+player.id)){
         if(item.isAdmin===true) callback(player);
         //else console.log("Privilege query: Player is not an admin");
      }//else{console.log("Privilege query: Id mismatch! "+item._id+"!="+player.id);}
   });
};

Database.prototype.setAdminPrivileges = function(player, settingAdmin){
   this.accounts.update({username: player.player.username}, { $set: { isAdmin: settingAdmin }});
};
/////////////////////TERRAIN

Database.prototype.getChunk = function(x, y, success, fail){
   this.terrain.findOne({x:x,y:y}, function(err, chunk){
      if(err){
         fail();
      }else{
         success(utils.str2ab(chunk.data));
      }
   });
};

Database.prototype.updateChunk = function(x, y, data){
   this.terrain.update({x:x,y:y},{x:x,y:y,data:utils.ab2str(data)}, {upsert: true});
};

module.exports = function(){
   return new Database();
};
