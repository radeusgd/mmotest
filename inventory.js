

var Inventory = function(database){
   this.db = database;
};

Inventory.prototype.prepareInventoryCode = function(player, callback){
   this.db.getPlayerInventory(player, function(inventory){
      var code="";
      if(inventory.length<=0){
         code="Inventory is empty";
      }else{
         code = "<table>";
         for(var id in inventory){
            var item = inventory[id];
            code+="<tr><td>";
            code+=item.name;
            if(item.amount>1) code+="("+item.amount+")";
            code+="</tr></td>";
         }
         code+="</table>";
      }
      callback(code);
   });
};

module.exports = function(db){
   return new Inventory(db);
};
