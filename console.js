var readline = require('readline');
var Console = function(interactive){
   this.events = {};
   var console = this;
   if(interactive){
      var rl = readline.createInterface(process.stdin, process.stdout);
      rl.setPrompt('$> ');
      rl.prompt();
      rl.on('line', function(line) {
         console.command(line);
      });
      rl.on('close',function(){
         process.exit(0);
      });
   }
};

Console.prototype.on = function(name, callback){
   this.events[name] = callback;
};

Console.prototype.command = function(text){
   words = text.split(" ");
   if(this.events[words[0]]){
      this.events[words[0]](words);
      return true;
   }
   return false;
};

module.exports = function(interactive){
   return new Console(interactive);
};
