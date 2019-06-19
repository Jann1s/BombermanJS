class Game {
  constructor() {
    this.displaySize = 600;

    this.app = new PIXI.Application({ 
        width: this.displaySize,
        height: this.displaySize,
        antialias: true,    // default: false
        transparent: false, // default: false
        resolution: 1       // default: 1
      }
    );

    this.mapSize = 13;
    this.tileSize = this.displaySize / this.mapSize;

    this.players = Array(2);
    this.map = Array(this.mapSize);

    document.body.appendChild(this.app.view);

    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('keyup', onKeyUp);
    
    this.init();
  }

  init() {
    this.generateMap();

    this.players[0] = new Player(new ControlScheme(65, 68, 87, 83, 32), [0.1, 0.2], new PIXI.Sprite(PIXI.Texture.from('assets/player/player_01.png')));
    this.players[1] = new Player(new ControlScheme(37, 39, 38, 40, 13), [0.1, 0.2], new PIXI.Sprite(PIXI.Texture.from('assets/player/player_02.png')));

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

    this.app.ticker.add(delta => this.gameLoop(delta));
  }

  generateMap() {
    var backgroundTexture = PIXI.Texture.from('assets/terrain/BackgroundTile.png');
    var solidTexture = PIXI.Texture.from('assets/terrain/SolidBlock.png');
    var explodableTexture = PIXI.Texture.from('assets/terrain/ExplodableBlock.png');

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
    this.players[0].map = this.map;
    this.players[1].map = this.map;

    this.players[0].updatePosition(delta);
    this.players[1].updatePosition(delta);
  }
}

var game = new Game();

function onKeyDown(e) {
  game.players[0].keyDown(e);
  game.players[1].keyDown(e);
}

function onKeyUp(e) {
  game.players[0].keyUp(e);
  game.players[1].keyUp(e);
}