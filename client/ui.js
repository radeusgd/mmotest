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

function createUI(src, id){
  var e  = $("<div class='draggable'><button id='close'>X</button><br>"+src+"</div>");
  var elem =  $("#close",e);
  elem.click(function(){
     removeUI(id);
  });
  elem.css('position','relative');
  elem.css('left','-10px');
  e.attr("id","GUI_"+id);
  e.draggable({cursor:"crosshair",containment:"#game",scroll:false});
  $("#ui").append(e);
}

function removeUI(id){
  $("#GUI_"+id).remove();
}

function prepareUI(){
  //createUI([{type:"frame",color:"#00AAFF",width:"100px",height:"200px",content:[{type:"text",text:"TEST"},{type:'closebutton'},{type:"scroll",width:"90px",height:"100px",content:[{type:"text",text:"scrollable<br>scrollable<br>scrollable<br>scrollable<br>scrollable<br>scrollable<br>scrollable<br>scrollable<br>"}]}]}],"inventory");
  createUI("test","test");
  createUI("<img src='http://www.google.pl/images/srpr/logo11w.png' width='90px' height='60px'>","img");
}
