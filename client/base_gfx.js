
window.onload = function() {
   game = new Phaser.Game(1280, 720, Phaser.AUTO, 'game', { preload: preload, create: create, update: update, render: render });

   function preload () {
      game.time.advancedTiming = true;
      game.load.spritesheet('tile1', 'assets/tiles.png', 64, 64);
      game.load.spritesheet('player', 'assets/player.png', 64, 64);
   }
   function create () {
      game.stage.backgroundColor = '#222235';
      cursors = game.input.keyboard.createCursorKeys();

      game.world.setBounds(0,0,7*chunkSize*tileSize,7*chunkSize*tileSize);

      player = game.add.sprite(3.5*chunkSize*tileSize, 3.5*chunkSize*tileSize, 'player');//game.add.tileSprite(300, 310, 64, 64, 'player');
      player.z = 200;
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

      updateTerrains();

      game.world.sort('z');
   }
   function render(){
      game.debug.text(game.time.fps || '--', 2, 14, "#00ff00");
   }
};
