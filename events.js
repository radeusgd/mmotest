var EventSystem = function(){
   this.events = {};
};

EventSystem.prototype.addEvent = function(eventType, callback){
   if(this.events[eventType]===undefined) this.events[eventType] = [];
   this.events[eventType].push(callback);
};

EventSystem.prototype.dispatch = function(eventType, entity, data){
   if(this.events[eventType]!==undefined){
      for(var id in this.events[eventType]){
         var f = this.events[eventType][id];
         f(entity,data);
      }
   }
};
module.exports = function(){
   return new EventSystem();
};
