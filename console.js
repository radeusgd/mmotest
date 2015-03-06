var readline = require('readline');
var Console = function(){
   var events = this.events = {};
   var rl = readline.createInterface(process.stdin, process.stdout);
   rl.setPrompt('$> ');
   rl.prompt();
   rl.on('line', function(line) {
      words = line.split(" ");
      if(events[words[0]]){
         events[words[0]](words);
      }
   });
   rl.on('close',function(){
      process.exit(0);
   });

};
///////////////////////AUTH
Console.prototype.on = function(name, callback){
   this.events[name] = callback;
};

module.exports = function(){
   return new Console();
};
