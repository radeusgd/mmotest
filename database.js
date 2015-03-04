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
/////////////////////TERRAIN
function ab2str(buf) {
   return String.fromCharCode.apply(null, buf);
}
function str2ab(str) {
   //var buf = new ArrayBuffer(str.length*2); // 2 bytes for each char
   var bufView = new Uint16Array(str.length);
   for (var i=0, strLen=str.length; i<strLen; i++) {
      bufView[i] = str.charCodeAt(i);
   }
   return bufView;
}
Database.prototype.getChunk = function(x, y, success, fail){
   this.terrain.findOne({x:x,y:y}, function(err, chunk){
      if(err){
         fail();
      }else{
         success(str2ab(chunk.data));
      }
   });
};

Database.prototype.updateChunk = function(x, y, data){
   this.terrain.update({x:x,y:y},{x:x,y:y,data:ab2str(data)}, {upsert: true});
};

module.exports = function(){
   return new Database();
};
