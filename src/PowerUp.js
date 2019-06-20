class PowerUp {
    constructor(type) {
        this.type = type;
        this.addend = 1;
    }

    madeContact(player, callback) {

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
            case PowerUpType.CONFUSE:
                confusePlayer(player.name);
                break;
            default:
                break;
        }

        callback();
    }
}