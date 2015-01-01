function log(text){
   $("#debug").append(text+"<br>");
   $("#debug").animate({ scrollTop: $("#debug").prop('scrollHeight') }, "slow");
 }
 function error(data){
   log("Error: "+data);
 }
 var ip = window.location.hostname+":3000";
 log("Connecting to "+ip);
 var socket = io(ip);
 socket.io.reconnectionAttempts(4);
 socket.on("connect_tiemout", error);
 socket.on("connect_error", error);
 socket.on("connect_fail", error);
 socket.on("connect", function(data){
      log("Connected!");
 });
 setUpSystems();
 function setUpSystems(){
   $("#msg").parent().submit(function(){
     if($("#msg").val()==="") return;
     socket.emit("chat_message",$("#msg").val());
     $("#msg").val("");
     return false;
   });
   socket.on("disconnecting", function(reason){
     log("Disconnecting, won't try to reconnect, because - "+reason);
     socket.io.reconnection(false);
   });
   socket.on("disconnect", function(data){//socket disconnected
     log("Disconnected ("+data+")");
     log("Attempting reconnect");
   });
   socket.on("reconnect_fail", error);
   socket.on("reconnect_failed", function(){
     log("Reconnecting failed. Please try refreshing the page.");
   });
   socket.on("message", function(text){
     log(text);
   });
 }
