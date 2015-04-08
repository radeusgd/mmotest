var ScriptEnvironment = function(database, world){
   this.db = database;
   this.world = world;
};

/*ScriptEnvironment.prototype.getWorld = function(){
   return this.world;
};*/

ScriptEnvironment.prototype.setBlockAtPosition = function(x,y,z,id){
   this.world.setBlockAtPosition(x,y,z,id);
};

ScriptEnvironment.prototype.compareItems = function (itemA, itemB) {
   var obk;
   for (obk in itemA) {
      if (itemA[obk] !== itemB[obk] && obk!="amount"){
         console.log(obk,itemA[obk],itemB[obk]);
         return false;
      }
   }
   return true;
}

ScriptEnvironment.prototype.addItemToInventory = function(item, inventory){
   if(item.stackable){
      for(var i=0;i<inventory.length;++i){
         if(this.compareItems(item,inventory[i])){
            if(inventory[i]){
               inventory[i].amount+=1;//add item to stack
               return inventory;
            }
         }
      }
   }
   //if item is not stackable or no stack found, add it
   inventory.push(item);
   return inventory;
};

ScriptEnvironment.prototype.removeItemFromInventory = function(item, inventory){
   //ASSERTION: player has enough of item!
   amount = typeof amount !== 'undefined' ? amount : 1;
   if(item.stackable){
      for(var i=0;i<inventory.length;++i){
         if(this.compareItems(item,inventory[i])){
            if(inventory[i]){
               inventory[i].amount-=item.amount;//remove amount
               if(inventory[i].amount<=0){//if we don't have the item anymore, remove it
                  inventory.splice(i,1);
               }
               return inventory;
            }
         }
      }
   }
   else{
      for(var i=0;i<inventory.length;++i){
         if(this.compareItems(item,inventory[i])){
            if(inventory[i]){
               inventory.splice(i,1);//just remove it
               return inventory;
            }
         }
      }
   }
   //if not found, do nothing, we don't inform on failure?
   return inventory;
};

ScriptEnvironment.prototype.getPlayerItems = function(player, callback){
   this.db.getPlayerInventory(player,callback);
};

ScriptEnvironment.prototype.givePlayerItem = function(item, player){
   var se = this;
   this.getPlayerItems(player, function(inventory){
      inventory = se.addItemToInventory(item, inventory);
      se.db.setPlayerInventory(player,inventory);
   });
};

ScriptEnvironment.prototype.takePlayerItem = function(item, player){
   var se = this;
   this.getPlayerItems(player, function(inventory){
      inventory = se.removeItemFromInventory(item, inventory);
      se.db.setPlayerInventory(player,inventory);
   });
};

//module.exports = ScriptEnvironment;
module.exports = function(db,world){
      return new ScriptEnvironment(db,world);
};
