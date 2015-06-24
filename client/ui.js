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

function renderUI(obj, container, id){
  for(var o of obj){
    switch (o.type) {
      case "text":
        var elem =  $("<span>"+o.text+"</span>");
        container.append(elem);
        break;
      case "closebutton":
        var elem =  $("<button>X</button>");
        elem.click(function(){
          removeUI(id);
        });
        container.append(elem);
        break;
      case "scroll":
        var elem =  $("<div style='height:"+o.height+";width:"+o.width+";overflow-y:scroll;'></div>");
        renderUI(o.content,elem,id);
        container.append(elem);
      break;
      case "frame":
        var elem =  $("<div style='height:"+o.height+";width:"+o.width+";background-color:"+o.color+";'></div>");//TODO image
        renderUI(o.content,elem,id);
        container.append(elem);
      break;
      default:;
    }
  }
}

function createUI(obj, id){
  var e  = $("<div class='draggable'></div>");
  e.attr("id","GUI_"+id);
  e.draggable({cursor:"crosshair",containment:"#game",scroll:false});
  renderUI(obj,e,id);
  $("#ui").append(e);
}

function removeUI(id){
  $("#GUI_"+id).remove();
}

function prepareUI(){
  createUI([{type:"frame",color:"#00AAFF",width:"100px",height:"200px",content:[{type:"text",text:"TEST"},{type:'closebutton'},{type:"scroll",width:"90px",height:"100px",content:[{type:"text",text:"scrollable<br>scrollable<br>scrollable<br>scrollable<br>scrollable<br>scrollable<br>scrollable<br>scrollable<br>"}]}]}],"inventory");
}
