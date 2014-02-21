var invisibleGround, ground, dude,
    stars, star,
    stones, stone, cols, idxs;
var energy, score, scoreValue = 0;

var game = new Phaser.Game(320, 480, Phaser.AUTO, '', {
  preload: function() {
    game.load.image('sky', 'assets/images/sky.png');
    game.load.image('ground', 'assets/images/platform.png');
    game.load.image('star', 'assets/images/star.png');
    game.load.image('stone', 'assets/images/stone.png');
    return game.load.spritesheet('dude', 'assets/images/dude.png', 32, 48);
  },
  create: function() {
    this._createSky();
    this._createGround();
    this._createDude();
    this._createCols();
    this._createStars();
    this._createStones();
    this._createScore();
  },
  _createCols: function() {
    cols = [];
    for (var i = 0; i < 6; i++) {
      cols.push(i * (game.world.width / 6));
    }

    idxs = [];
    for (i = 0; i < 50; i++) {
      idxs.push(Math.floor(Math.random() * 5));
    }

  },
  _createSky: function() {
    game.add.sprite(0, 0, 'sky');
  },
  _createGround: function() {
    ground = game.add.sprite(0, game.world.height - 32, 'ground');
    ground.body.gravity = 0;
    ground.body.immovable = true;

    invisibleGround = game.add.sprite(0, game.world.height, 'ground');
    invisibleGround.body.gravity = 0;
    invisibleGround.body.immovable = true;
  },
  _createDude: function() {
    dude = game.add.sprite(32, game.world.height - 150, 'dude');
    dude.health = 100;
    dude.body.bounce.y = 0;
    dude.body.gravity.y = 98;
    dude.body.collideWorldBounds = true;
    dude.animations.add('stop_left', [0], 0, false);
    dude.animations.add('stop_right', [5], 0, false);
    dude.animations.add('left', [0, 1, 2, 3], 10, true);
    dude.animations.add('right', [5, 6, 7, 8], 10, true);
  },
  _createStars: function() {
    stars = game.add.group();
    for (var i = 0; i <= 6; i++) {
      star = stars.create(0, 0, 'star');
      star.body.gravity.y = 98;
      star.kill();
    }
  },
  _createStones: function() {
    stones = game.add.group();
    for (var i = 0; i <= 6; i++) {
      stone = stones.create(0, 0, 'stone');
      stone.scale.setTo(0.5,0.5);
      stone.body.gravity.y = 120;
      stone.kill();
    }
  },
  _createScore: function() {
    energy = game.add.text(16, 40, 'energy: ' + 100, {
      font: '24px arial',
      fill: '#222'
    });
    return score = game.add.text(16, 16, 'score: ' + scoreValue, {
      font: '24px arial',
      fill: '#000'
    });
  },
  update: function() {
    this._updateDude();
    this._updateStars();
    this._updateStones();
    this._updateCollisions();
  },
  _updateStars: function () {
    var pos, star = stars.getFirstExists(false);
    if (stars.countLiving() < 1 && star) {
      pos = idxs.pop();
      if (pos) {
        star.revive();
        star.body.y = 0;
        star.body.x = cols[pos];
      }
    }
  },
  _updateStones: function () {
    var pos, stone = stones.getFirstExists(false);
    if (stones.countLiving() < 3 && stone) {
      pos = idxs.pop();
      if (pos) {
        stone.revive();
        stone.body.y = 0;
        stone.body.x = cols[idxs.pop()];
      }
    }
  },
  _updateDude: function() {
    var dest_x, value;

    if (game.input.activePointer.isDown &&
        !Phaser.Rectangle.contains.call(dude.body, game.input.activePointer)) {

      dest_x = game.input.activePointer.x;
    }

    if (window.deviceTiltValue) {
      value = window.deviceTiltValue;
      if (value > 10) {
        dest_x = game.world.width;
      } else if (value < -10) {
        dest_x = -game.world.width;
      }
    }

    if (dest_x) {
      game.physics.moveToXY(dude, dest_x, game.world.height, 400);

      if (dude.position.x < dest_x) {
        dude.animations.play("right");
        dude._side = "right";
      } else if (dude.position.x > dest_x) {
        dude.animations.play("left");
        dude._side = "left";
      }
    } else {
      switch(dude._side) {
      case "left":
        dude.animations.play("stop_left");
        break;
      case "right":
        dude.animations.play("stop_right");
        break;
      }
      dude.animations.stop();
    }
  },
  _updateCollisions: function() {
    game.physics.collide(dude, ground);
    game.physics.collide(stars, dude, this._collectStars, null, this);
    game.physics.collide(stones, dude, this._collisionStone, null, this);
    game.physics.collide(stars, invisibleGround, this._killStars);
    game.physics.collide(stones, invisibleGround, this._killStones);
  },
  _collisionStone: function(o1, o2) {
    dude.damage(10);
    energy.content = "energy: " + dude.health;
    this._killStones(o1, o2);
  },
  _collectStars: function(o1, o2) {
    scoreValue += 10;
    score.content = "score: " + scoreValue;
    this._killStars(o1, o2);
  },
  _killStars: function (o1, o2) {
    [o1, o2].forEach(function (ob) {
      if (ob.key === "star") {
        ob.body.reset();
        ob.kill();
      }
    });
  },
  _killStones: function (o1, o2) {
    [o1, o2].forEach(function (ob) {
      if (ob.key === "stone") {
        ob.kill();
        ob.body.reset();
      }
    });
  },
  render: function () {

  }
});

var deviceTiltValue;

if (window.DeviceOrientationEvent) {
  window.addEventListener('deviceorientation', function(eventData) {
    // gamma is the left-to-right tilt in degrees, where right is positive
    deviceTiltValue = eventData.gamma;
  }, false);

  lockedAllowed = window.screen.mozLockOrientation("portrait-primary");
}
