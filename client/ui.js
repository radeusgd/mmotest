function genericOnMouseDown(e){
  var x = Math.floor((e.x-1280/2)/tileSize);
  var y = Math.floor((e.y-720/2)/tileSize)
  //log(x+"/"+y);
  var action = $("#blockAction").val();
  var layer = parseInt($("#blockLayer").val());
  var id;
  //log(parseInt($("#blockLayer").val())+" "+parseInt($("#blockId").val())+" "+$("#blockAction").val());
  if(action=="place"){
    id = parseInt($("#blockId").val());
    sendPlaceBlock(x,y,layer,id);
  }else if(action=="destroy"){
    id = 10000;
    sendPlaceBlock(x,y,layer,id);
  }
}
