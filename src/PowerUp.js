class PowerUp {
    constructor(type) {
        this.type = type;
        this.addend = 1;
    }

    madeContact(player, callback) {

        console.log(this.type);
        switch(this.type) {
            case PowerUpType.ADDBOMB:
                player.bombAmount += this.addend;
                player.bombsMax += this.addend;
                break;
            case PowerUpType.STRONGBOMB:
                player.bombSize += this.addend;
                break;
            case PowerUpType.SPEEDUP:
                player.speed += this.addend;
                break;
            default:
                break;
        }

        callback();
    }
}