class Game {
  constructor(player1, player2) {
    this.displaySize = 600;

    this.app = new PIXI.Application({ 
        width: this.displaySize,
        height: this.displaySize,
        antialias: true,    // default: false
        transparent: false, // default: false
        resolution: 1       // default: 1
      }
    );

    this.gameOver = false;
    this.stop = false;

    this.mapSize = 13;
    this.tileSize = this.displaySize / this.mapSize;

    this.players = Array(2);
    this.map = Array(this.mapSize);

    document.getElementById("gameArea").innerHTML = "";
    document.getElementById("gameArea").appendChild(this.app.view);

    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('keyup', onKeyUp);
    
    this.init(player1, player2);
  }

  init(player1, player2) {
    this.generateMap();

    this.players[0] = new Player(player1, new ControlScheme(65, 68, 87, 83, 32), [0.1, 0.2], new PIXI.Sprite(PIXI.Texture.from('assets/player/player_01.png')));
    this.players[1] = new Player(player2, new ControlScheme(37, 39, 38, 40, 13), [0.1, 0.2], new PIXI.Sprite(PIXI.Texture.from('assets/player/player_02.png')));

    for (var i = 0; i < this.players.length; i++) {
      this.players[i].sprite.width = this.tileSize;
      this.players[i].sprite.height = this.tileSize;
      //this.players[i].sprite.anchor.set(0.5,1);
      this.app.stage.addChild(this.players[i].sprite);
    }

    this.players[0].sprite.x = 1 * this.tileSize;
    this.players[0].sprite.y = 1 * this.tileSize;

    this.players[1].sprite.x = (this.mapSize - 2) * this.tileSize;
    this.players[1].sprite.y = (this.mapSize - 2) * this.tileSize;

    this.players[0].tileSize = this.tileSize;
    this.players[1].tileSize = this.tileSize;

    this.players[0].bombTexture = PIXI.Texture.from('assets/player/bomb_01.png');
    this.players[1].bombTexture = PIXI.Texture.from('assets/player/bomb_02.png');

    this.app.ticker.add(delta => this.gameLoop(delta));
  }

  generateMap() {
    var backgroundTexture = PIXI.Texture.from('assets/terrain/BackgroundTile.png');
    var solidTexture = PIXI.Texture.from('assets/terrain/SolidBlock.png');
    var explodableTexture = PIXI.Texture.from('assets/terrain/ExplodableBlock.png');

    var powerUpTextureAddBomb = PIXI.Texture.from('assets/powerups/BombPowerup.png');
    var powerUpTextureSpeedUp= PIXI.Texture.from('assets/powerups/SpeedPowerup.png');
    var powerUpTextureFlame = PIXI.Texture.from('assets/powerups/FlamePowerup.png');
    var powerUpTextureConfuse = PIXI.Texture.from('assets/powerups/ConfusedPowerup.png');
    
    for (var x = 0; x < this.mapSize; x++) {
      this.map[x] = Array(this.mapSize);

      for (var y = 0; y < this.mapSize; y++) {
        this.map[x][y] = new PIXI.Container();
        this.map[x][y].x = (x * this.tileSize);
        this.map[x][y].y = (y * this.tileSize);
        this.map[x][y].width = this.tileSize;
        this.map[x][y].height = this.tileSize;
        this.app.stage.addChild(this.map[x][y]);

        var bgSprite = new PIXI.Sprite(backgroundTexture);
        bgSprite.width = this.tileSize;
        bgSprite.height = this.tileSize;
        bgSprite.wallType = WallType.BACKGROUND;
        this.map[x][y].addChild(bgSprite);
      }
    }
    
    //Create Borders of the map
    for(var x = 0; x < this.mapSize; x++) {
      for (var y = 0; y < this.mapSize; y++) {

        if ((x == 0 || x == (this.mapSize - 1)) || (y == 0 || y == (this.mapSize - 1))) {
          var solidSprite = new PIXI.Sprite(solidTexture);
          solidSprite.width = this.tileSize;
          solidSprite.height = this.tileSize;
          solidSprite.wallType = WallType.SOLID;

          this.map[x][y].removeChildren();
          this.map[x][y].addChild(solidSprite);
        }
      }
    }

    //Create solid blocks of the inner map
    for (var x = 2; x < (this.mapSize - 2); x += 2) {
      for (var y = 2; y < (this.mapSize - 2); y += 2) {
        var solidSprite = new PIXI.Sprite(solidTexture);
          solidSprite.width = this.tileSize;
          solidSprite.height = this.tileSize;
          solidSprite.wallType = WallType.SOLID;

          this.map[x][y].removeChildren();
          this.map[x][y].addChild(solidSprite);
      }
    }

    //Create explodable wall and PowerUps
    for (var x = 0; x < this.mapSize; x++) {
      for (var y = 0; y < this.mapSize; y++) {

        if (!(x == 1 && y == 1) &&
         !(x == 1 && y == 2) &&
         !(x == 1 && y == 3) &&
         !(x == 2 && y == 1) &&
         !(x == 3 && y == 1) &&
         !(x == (this.mapSize - 2) && y == (this.mapSize - 2)) &&
         !(x == (this.mapSize - 2) && y == (this.mapSize - 3)) &&
         !(x == (this.mapSize - 2) && y == (this.mapSize - 4)) &&
         !(x == (this.mapSize - 3) && y == (this.mapSize - 2)) &&
         !(x == (this.mapSize - 4) && y == (this.mapSize - 2))) {

            var sprite = this.map[x][y].getChildAt(0);
            if (sprite.wallType != WallType.SOLID) {
              
              if (Math.floor(Math.random() * 200) < 40) {
                var powerUpType = Math.floor(Math.random() * 4);
                var powerUpSprite;
                switch(powerUpType) {
                  case PowerUpType.ADDBOMB:
                  default:
                    powerUpSprite = new PIXI.Sprite(powerUpTextureAddBomb);
                    powerUpSprite.powerUp = new PowerUp(powerUpType);
                    break;
                  case PowerUpType.SPEEDUP:
                    powerUpSprite = new PIXI.Sprite(powerUpTextureSpeedUp);
                    powerUpSprite.powerUp = new PowerUp(powerUpType);
                    powerUpSprite.powerUp.addend = 0.25;
                    break;
                  case PowerUpType.STRONGBOMB:
                    powerUpSprite = new PIXI.Sprite(powerUpTextureFlame);
                    powerUpSprite.powerUp = new PowerUp(powerUpType);
                    break;
                  case PowerUpType.CONFUSE:
                    powerUpSprite = new PIXI.Sprite(powerUpTextureConfuse);
                    powerUpSprite.powerUp = new PowerUp(powerUpType);
                    powerUpSprite.width = this.tileSize;
                    powerUpSprite.height = this.tileSize;
                    break;
                }
                
                powerUpSprite.wallType = WallType.POWERUP;
                this.map[x][y].addChild(powerUpSprite);
              }
              

              var explodableSprite = new PIXI.Sprite(explodableTexture);
              explodableSprite.width = this.tileSize;
              explodableSprite.height = this.tileSize;
              explodableSprite.wallType = WallType.EXPLODABLE;

              this.map[x][y].addChild(explodableSprite);
            }
          }
      }
    }
  }

  gameLoop(delta) {
    if (this.gameOver == false && this.stop == false) {
      this.players[0].map = this.map;
      this.players[1].map = this.map;

      this.players[0].updatePosition(delta);
      this.players[1].updatePosition(delta);
    } else if (this.gameOver == true && this.stop == false) {
      this.stop = true;
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('keyup', onKeyUp);
    }
  }
}
var game;

function playGame() {
  game = new Game(document.getElementById("playerOne").value, document.getElementById("playerTwo").value);
}

function onKeyDown(e) {
  game.players[0].keyDown(e);
  game.players[1].keyDown(e);
}

function onKeyUp(e) {
  game.players[0].keyUp(e);
  game.players[1].keyUp(e);
}

function confusePlayer(name) {
  for (var i = 0; i < game.players.length; i++) {
    if (name != game.players[i].name) {
      game.players[i].controls.confused = true;
    }
  }
}

function gameOver(name) {
  game.gameOver = true;

  for (var i = 0; i < game.players.length; i++) {
    if (name != game.players[i].name) {
      document.getElementById("gameOver").innerText = "Congratulations " + game.players[i].name + ", You Win!";
      document.getElementById("gameArea").innerHTML = "";
    }
  }
}