module.exports = function(){
   this.name = "Test item";
   this.tileid = 100;
   this.onUse = function(scriptEnvironment, player){
      player.say("Used test item");
   };
   //TODO add other functionalities
};
