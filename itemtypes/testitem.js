module.exports = {};
module.exports.item = function(){//pure strucutre, for DB
   this.sysname = "testitem";//same as filename, for getting functions
   this.name = "Test item";
   this.tileid = 100;
   this.stackable = true;
   this.amount = 1;//if stackable is true, you should define it
};
//TODO add other functionalities
module.exports.functions = {//functionality, loaded from here
   onUse: function(scriptEnvironment, player){
      player.say("Used test item");
   },
};
