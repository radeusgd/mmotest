function placeBlock(){
   var layer = parseInt($("#blockLayer").val());
   var id = parseInt($("#blockId").val());
   sendPlaceBlock(0,0,layer,id);
}
function destroyBlock(){
   var layer = parseInt($("#blockLayer").val());
   var id = 10000;
   sendPlaceBlock(0,0,layer,id);
}
