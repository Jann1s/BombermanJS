class Player {
    constructor(name, controls, position, sprite) {
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
        this.name = name;
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

        this.position[0] = (this.sprite.x + (this.tileSize / 2)) / this.tileSize;
        this.position[1] = (this.sprite.y + (this.tileSize / 2)) / this.tileSize;

        if (this.controls.confused == true) {
            this.controls.confused = false;

            //Had to do it this way, otherwise it would have been mapped to the field this.controls.*
            //in which there would be now way to reset it.
            let leftOld = this.controls.left;
            let rightOld = this.controls.right;
            let upOld = this.controls.up;
            let downOld = this.controls.down;

            setTimeout(function() {this.resetConfuse(leftOld, rightOld, upOld, downOld);}.bind(this), 5000);

            var left = this.controls.left;
            var up = this.controls.up;

            this.controls.left = this.controls.right;
            this.controls.right = left;
            this.controls.up = this.controls.down;
            this.controls.down = up;
        }

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

    resetConfuse(left, right, up, down) {
        this.controls.left = left;
        this.controls.right = right;
        this.controls.up = up;
        this.controls.down = down;
    }

    checkPosition() {
        var x = this.position[0];
        var y = this.position[1];
        var xIndex = Math.round(x - 0.1);
        var yIndex = Math.round(y - 0.1);

        this.checkForItem(x, y);
        
        if ((x - 1.5) <= 0 && this.controls.left == this.currentButton) {
            this.currentButton = -1;
            this.sprite.vx = 0;
            this.sprite.x = 1 * this.tileSize;
        }
        else if ((x + 0.5) >= (this.map.length - 1) && this.controls.right == this.currentButton) {
            this.currentButton = -1;
            this.sprite.vx = 0;
            this.sprite.x = (this.map.length - 2) * this.tileSize;
        }
        else if ((y - 1.5) <= 0 && this.controls.up == this.currentButton) {
            this.currentButton = -1;
            this.sprite.vy = 0;
            this.sprite.y = 1 * this.tileSize;
        }
        else if ((y + 0.5) >= (this.map.length - 1) && this.controls.down == this.currentButton) {
            this.currentButton = -1;
            this.sprite.vy = 0;
            this.sprite.y = (this.map.length - 2) * this.tileSize;
        }


        if (!this.isBlockWalkable(xIndex, yIndex)) {
            if ((x - 0.5) >= xIndex && this.controls.right == this.currentButton) {
                this.currentButton = -1;
                this.sprite.vx = 0;
                this.sprite.x = xIndex * this.tileSize;
            }
            else if ((x + 0.5) >= xIndex && this.controls.left == this.currentButton) {
                this.currentButton = -1;
                this.sprite.vx = 0;
                this.sprite.x = xIndex * this.tileSize;
            }
            else if ((y + 0.5) >= yIndex && this.controls.up == this.currentButton) {
                this.currentButton = -1;
                this.sprite.vy = 0;
                this.sprite.y = yIndex * this.tileSize;
            }
            else if ((y - 0.5) >= yIndex && this.controls.down == this.currentButton) {
                this.currentButton = -1;
                this.sprite.vy = 0;
                this.sprite.y = yIndex * this.tileSize;
            }
        }
    }

    isBlockWalkable(x, y) {
        var mapSize = this.map.length;

        if (x - 0.5 >= 0 && x + 0.5 <= mapSize - 1 &&
        y - 0.5 >= 0 && y + 0.5 <= mapSize - 1) {
            var free = true;

            this.map[x - 1][y].children.forEach(function(element) {
                if ((element.wallType == WallType.SOLID || element.wallType == WallType.EXPLODABLE) && this.controls.left == this.currentButton) {
                    free = false;
                }
            }.bind(this));

            this.map[x + 1][y].children.forEach(function(element) {
                if ((element.wallType == WallType.SOLID || element.wallType == WallType.EXPLODABLE) && this.controls.right == this.currentButton) {
                    free = false;
                }
            }.bind(this));

            this.map[x][y - 1].children.forEach(function(element) {
                if ((element.wallType == WallType.SOLID || element.wallType == WallType.EXPLODABLE) && this.controls.up == this.currentButton) {
                    free = false;
                }
            }.bind(this));

            this.map[x][y + 1].children.forEach(function(element) {
                if ((element.wallType == WallType.SOLID || element.wallType == WallType.EXPLODABLE) && this.controls.down == this.currentButton) {
                    free = false;
                }
            }.bind(this));

            return free;
        }
        else {
            return false;
        }
    }

    checkForItem(x, y) {
        x = Math.round(x - 0.1);
        y = Math.round(y - 0.1);

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
            var x = Math.round(this.position[0] - 0.1);
            var y = Math.round(this.position[1] - 0.1);

            if (this.map[x][y].getChildByName("bomb") == null) {
                this.bombAmount--;

                var bomb = new PIXI.Sprite(this.bombTexture);
                

                bomb.width = this.tileSize * 0.8;
                bomb.height = this.tileSize * 0.8;
                bomb.anchor.set(-0.1);
                bomb.name = "bomb";

                this.map[x][y].addChild(bomb);

                setTimeout(function() {this.handleBomb(x, y, bomb);}.bind(this), 2000);
            }
        }
    }

    handleBomb(x, y, bomb) {
        this.map[x][y].removeChild(bomb);

        var stopLeft = false;
        var stopRight = false;
        var stopUp = false;
        var stopDown = false;

        for (var i = 1; i <= this.bombSize; i++) {

            if (!stopLeft || i == 1) {
                stopLeft = this.explode(x - i, y);
            }
            if (!stopRight || i == 1) {
                stopRight = this.explode(x + i, y);
            }
            if (!stopUp || i == 1) {
                stopUp = this.explode(x, y - i);
            }
            if (!stopDown || i == 1) {
                stopDown = this.explode(x, y + i);
            }
        }

        this.bombAmount++;
    }

    stopBlock(x, y) {
        var stopWalkable = false;

        if (x > 0 && x < (this.map.length - 1) && y > 0 && y < (this.map.length - 1)) {
            
            for (var i = 0; i < this.map[x][y].children.length; i++) {
                var block = this.map[x][y].children[i];
                
                if (block.wallType == WallType.SOLID || block.wallType == WallType.EXPLODABLE) {
                    stopWalkable = true;
                }
            }
        }

        return stopWalkable;
    }

    explode(x, y) {
        var blockExplodable = false;

        if (x > 0 && x < (this.map.length - 1) && y > 0 && y < (this.map.length - 1)) {
            var block = this.map[x][y].getChildAt(0);
            
            if (block.wallType == WallType.BACKGROUND && this.map[x][y].getChildByName("bomb") == null) {
                if (this.map[x][y].children.length > 1) {
                    var upperBlock = this.map[x][y].getChildAt(1);

                    if (upperBlock.wallType == WallType.EXPLODABLE) {
                        this.map[x][y].removeChildAt(1);
                        blockExplodable = true;
                    } 
                    else {
                        if (this.map[x][y].children.length > 2) {
                            upperBlock = this.map[x][y].getChildAt(2);
                            
                            if (upperBlock.wallType == WallType.EXPLODABLE) {
                                this.map[x][y].removeChildAt(2);
                                blockExplodable = true;
                            }
                        }
                    }
                }

                var playerX = Math.round(this.position[0] - 0.1);
                var playerY = Math.round(this.position[1] - 0.1);

                if (playerX == x && playerY == y) {
                    gameOver(this.name);
                }

                var flame = new PIXI.Sprite(PIXI.Texture.from('assets/effects/flame.png'));
                this.map[x][y].addChild(flame);
                setTimeout(function() {this.handleFlame(x, y, flame);}.bind(this), 500);
                return blockExplodable;
            }
            else if (block.wallType == WallType.SOLID) {
                blockExplodable = true;
            }
        }

        return blockExplodable;
    }

    handleFlame(x, y, flame) {
        this.map[x][y].removeChild(flame);
    }
}