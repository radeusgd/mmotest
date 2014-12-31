var layersCount = 7;
var chunkSize = 8;
function createChunk(x,y){
   var map = game.add.tilemap(null);
   map.addTilesetImage('tile1','tile1', 64, 64);//set-up tilesets
   map.layerRefs = {};
   map.layerRefs[0] = map.create('layer0', chunkSize, chunkSize, 64, 64);
   for(var i=1;i<layersCount;i++){
      map.layerRefs[i] = map.createBlankLayer('layer'+(i), chunkSize, chunkSize, 64, 64);
   }
   for(var j=0;i<layersCount;i++){
      map.layerRefs[i].world.x = x;
      map.layerRefs[i].world.y = y;
      map.layerRefs[i].depth = 100*i;
   }
   return map;
}
function generateChunk(chunk){//temporary function for proc gen
   for(var x=0;x<16;x++){
      for(var y=0;y<16;y++){
            var tile = 30+x+40*y;//x%30+30*y;
            chunk.putTile(tile, x,y, chunk.layerRefs[x%5]);
      }
   }
   //chunk.random(0,0,16,16, chunk.layerRefs[0]);
}

////////

window.onload = function() {
   game = new Phaser.Game(1280, 720, Phaser.CANVAS, 'game', { preload: preload, create: create, update: update, render: render }); //AUTO??

   function preload () {
      game.time.advancedTiming = true;
      game.load.image('tile1', 'assets/tiles.png');
      game.load.spritesheet('player', 'assets/player.png', 64, 64);
   }
   function create () {
      game.stage.backgroundColor = '#222235';
      cursors = game.input.keyboard.createCursorKeys();

      var c1 = createChunk(0,0);
      generateChunk(c1);
      var c2 = createChunk(64*chunkSize,0);
      generateChunk(c2);
      c1.scale = 2;
      game.world.setBounds(0,0,7*chunkSize*64,7*chunkSize*64);

      player = game.add.sprite(300, 310, 'player');//game.add.tileSprite(300, 310, 64, 64, 'player');
      player.depth = 10;
      //set-up player anims
      player.animations.add("idle", [130],1,true);
      player.animations.add("walkUp", [105,106,107,108,109,110,111,112],10,true);//8*13=104
      player.animations.add("walkLeft", [118,119,120,121,122,123,124,125],10,true);
      player.animations.add("walkDown", [131,132,133,134,135,136,137,138],10,true);
      player.animations.add("walkRight", [144,145,146,147,148,149,150,151],10,true);
      player.animations.play("test",10,true);


      game.physics.arcade.enable(player);
      game.camera.follow(player);
   }
   function controls(){
      var v=128;
      if (cursors.left.isDown){player.body.velocity.x += -v;}
      if (cursors.right.isDown){player.body.velocity.x += v;}
      if (cursors.up.isDown){player.body.velocity.y += -v;}
      if (cursors.down.isDown){player.body.velocity.y += v;}

      var vx = player.body.velocity.x;var vy = player.body.velocity.y;
      if(vx>0){player.animations.play("walkRight");}
      else if(vx<0){player.animations.play("walkLeft");}
      else if(vy>0){player.animations.play("walkDown");}
      else if(vy<0){player.animations.play("walkUp");}
      else{player.animations.play("idle");}
   }
   function update(){
      player.body.velocity.x = 0;player.body.velocity.y = 0;
      controls();

      game.world.sort('depth');
   }
   function render(){
      game.debug.text(game.time.fps || '--', 2, 14, "#00ff00");
   }
};
