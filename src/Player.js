class Player {
    constructor(controls, position, sprite) {
        this.sprite = sprite;
        this.controls = controls;
        this.position = position;
        this.speed = 3;
        this.bombSize = 1;
        this.bombAmount = 1;
        this.bombsMax = 1;
        this.sprite.vx = 0;
        this.sprite.vy = 0;
        this.currentButton = -1;
    }

    keyDown(e) {
        switch(e.which) {
            case this.controls.left:
            case this.controls.right:
            case this.controls.up:
            case this.controls.down:
            case this.controls.placeBomb:
                this.currentButton = e.which;
                break;
            default:
                break;
        }
    }

    keyUp(e) {
        switch(e.which) {
            case this.controls.left:
            case this.controls.right:
            case this.controls.up:
            case this.controls.down:
            case this.controls.placeBomb:
                this.currentButton = -1;
                break;
            default:
                break;
        }
    }

    updatePosition(delta) {
        switch(this.currentButton) {
            case this.controls.left:
                this.sprite.vx = -this.speed;
                break;
            case this.controls.right:
                this.sprite.vx = this.speed;
                break;
            case this.controls.up:
                this.sprite.vy = -this.speed;
                break;
            case this.controls.down:
                this.sprite.vy = this.speed;
                break;
            case this.controls.placeBomb:
                this.setBomb();
                break;
            case -1:
                this.sprite.vx = 0;
                this.sprite.vy = 0;
                break;
            default:
                break;
        }

        this.checkPosition();

        this.sprite.x += this.sprite.vx * delta;
        this.sprite.y += this.sprite.vy * delta;
    }

    checkPosition() {
        var x = (this.sprite.x / this.tileSize);
        var y = (this.sprite.y / this.tileSize);

        this.checkForItem(x, y);
        
        //Check if the player is near to the border of the map
        if ((x - 1) <= 0 && this.controls.left == this.currentButton) {
            this.currentButton = -1;
            this.sprite.vx = 0;
            this.sprite.x = 1 * this.tileSize;
        }
        else if ((x + 1) >= (this.map.length - 1) && this.controls.right == this.currentButton) {
            this.currentButton = -1;
            this.sprite.vx = 0;
            this.sprite.x = (this.map.length - 2) * this.tileSize;
        }
        else if ((y - 1) <= 0 && this.controls.up == this.currentButton) {
            this.currentButton = -1;
            this.sprite.vy = 0;
            this.sprite.y = 1 * this.tileSize;
        }
        else if ((y + 1) >= (this.map.length - 1) && this.controls.down == this.currentButton) {
            this.currentButton = -1;
            this.sprite.vy = 0;
            this.sprite.y = (this.map.length - 2) * this.tileSize;
        }
        else {
            var xIndex = parseInt(this.sprite.x / this.tileSize);
            var yIndex = parseInt(this.sprite.y / this.tileSize);

            if (!this.isBlockWalkable(xIndex, yIndex)) {

                if ((x >= xIndex && xIndex != 1) && this.controls.right == this.currentButton) {
                    this.currentButton = -1;
                    this.sprite.vx = 0;
                    this.sprite.x = xIndex * this.tileSize;
                }
                else if (((x <= (xIndex + 0.1) && xIndex != 11) && this.controls.left == this.currentButton)) {
                    this.currentButton = -1;
                    this.sprite.vx = 0;
                    this.sprite.x = xIndex * this.tileSize;
                }
                else if ((y >= yIndex && yIndex != 1) && this.controls.down == this.currentButton) {
                    this.currentButton = -1;
                    this.sprite.vy = 0;
                    this.sprite.y = yIndex * this.tileSize;
                }
                else if (((y <= (yIndex + 0.1) && yIndex != 11) && this.controls.up == this.currentButton)) {
                    this.currentButton = -1;
                    this.sprite.vy = 0;
                    this.sprite.y = yIndex * this.tileSize;
                }
            }
        }
    }

    isBlockWalkable(x, y) {
        var mapSize = this.map.length;
        if (x - 1 >= 0 && x + 1 <= mapSize - 1 &&
        y - 1 >= 0 && y + 1 <= mapSize - 1) {
            var blockLeft = this.map[x - 1][y].getChildAt(0);
            var blockRight = this.map[x + 1][y].getChildAt(0);
            var blockUp = this.map[x][y - 1].getChildAt(0);
            var blockDown = this.map[x][y + 1].getChildAt(0);

            if ((blockLeft.wallType != WallType.BACKGROUND && this.controls.left == this.currentButton) ||
            (blockRight.wallType != WallType.BACKGROUND && this.controls.right == this.currentButton) ||
            (blockUp.wallType != WallType.BACKGROUND && this.controls.up == this.currentButton) ||
            (blockDown.wallType != WallType.BACKGROUND && this.controls.down == this.currentButton)) {
                return false;
            }
            else {
                return true;
            }
        }
        else {
            return false;
        }
    }

    checkForItem(x, y) {
        x = parseInt(x);
        y = parseInt(y);

        if (this.map[x][y].children.length > 1) {
            var block = this.map[x][y].getChildAt(1);

            if (block.wallType == WallType.POWERUP) {
                block.powerUp.madeContact(this, function() {
                    this.map[x][y].removeChild(block);
                }.bind(this));
            } 
        }
    }

    setBomb() {
        if (this.bombAmount >= 1) {
            var x = parseInt(this.sprite.x / this.tileSize);
            var y = parseInt(this.sprite.y / this.tileSize);

            if (this.map[x][y].children.length == 1) {
                this.bombAmount--;

                var bomb = new PIXI.Sprite(this.bombTexture);
                

                bomb.width = this.tileSize * 0.8;
                bomb.height = this.tileSize * 0.8;
                bomb.anchor.set(-0.1);

                this.map[x][y].addChild(bomb);
                console.log("Placed!");

                setTimeout(function() {this.handleBomb(x, y, bomb);}.bind(this), 2000);
            }
        }
    }

    handleBomb(x, y, bomb) {
        this.map[x][y].removeChild(bomb);

        this.explode(x - 1, y);
        this.explode(x + 1, y);
        this.explode(x, y - 1);
        this.explode(x, y + 1);

        this.bombAmount++;
    }

    explode(x, y) {
        var block = this.map[x][y].getChildAt(0);

        if (block.wallType == WallType.BACKGROUND) {
            if (this.map[x][y].children.length > 1) {
                var upperBlock = this.map[x][y].getChildAt(1);

                if (upperBlock.wallType == WallType.EXPLODABLE) {
                    this.map[x][y].removeChildAt(1);
                } 
                else {
                    this.map[x][y].removeChildAt(2);
                }
            }

            var playerX = parseInt(this.sprite.x / this.tileSize);
            var playerY = parseInt(this.sprite.x / this.tileSize);

            if (playerX == x && playerY == y) {
                console.log("Test");
                gameOver();
            }

            var flame = new PIXI.Sprite(PIXI.Texture.from('assets/effects/flame.png'));
            this.map[x][y].addChild(flame);
            setTimeout(function() {this.handleFlame(x, y, flame);}.bind(this), 500);
        }
    }

    handleFlame(x, y, flame) {
        this.map[x][y].removeChild(flame);
    }

    getPosition(x, y) {

        //if (parseInt(x + 0.5) ==)
    }
}