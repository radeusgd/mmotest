var layersCount = 7;
function createChunk(){
   var map = game.add.tilemap(null);
   map.addTilesetImage('tile1','tile1');//set-up tilesets
   map.layerRefs = {};
   map.layerRefs[0] = map.create('layer1', 16, 16, 32, 32);
   for(var i=0;i<layersCount;i++){
      map.layerRefs[i+1] = map.createBlankLayer('layer'+(i+2), 16, 16, 32, 32);
   }
   return map;
}
function generateChunk(chunk){//temporary function for proc gen
   for(var x=0;x<16;x++){
      for(var y=0;y<16;y++){
            var tile = x%30+30*y;
            chunk.putTile(tile, x,y, chunk.layerRefs[0]);
      }
   }
}

////////

window.onload = function() {
   game = new Phaser.Game(1280, 720, Phaser.AUTO, 'game', { preload: preload, create: create });

   function preload () {
      game.load.image('tile1', 'assets/tiles.png');
   }
   function create () {
      game.stage.backgroundColor = '#222235';

      var c1 = createChunk();
      generateChunk(c1);
   }
};
