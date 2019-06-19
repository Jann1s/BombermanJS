class Player {
    constructor(controls, position, sprite) {
        this.sprite = sprite;
        this.controls = controls;
        this.position = position;
        this.speed = 2;
        this.bombSize = 1;
        this.bombAmount = 1;
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
        var x = parseInt(this.sprite.x / this.tileSize);
        var y = parseInt(this.sprite.y / this.tileSize);
        
        //if ()
    }
}