import Bullet from "./Bullet.js";

export default class BulletControls {
    bullets = [];
    timeUntilNextBulletAllowed = 0;

    constructor(canvas, maxBulletsAtATime, bulletColor, soundEnabled){
            this.canvas = canvas;
            this.maxBulletsAtATime = maxBulletsAtATime;
            this.bulletColor = bulletColor;
            this.soundEnabled = soundEnabled;

            this.shootSound = new Audio("audio/sounds_shoot.wav")
            this.shootSound.volume = 0.5;
    }

    draw(ctx) {
        //once bullets are off canvas, stop counting them so that we can reshoot
        //filter through and find bullets that are below the top side of the canvas
        this.bullets = this.bullets.filter(bullet => bullet.y + bullet.width > 0 && bullet.y <= this.canvas.height)
        console.log(this.bullets.length)


        this.bullets.forEach(bullet => bullet.draw(ctx));
        if(this.timeUntilNextBulletAllowed > 0) {
                this.timeUntilNextBulletAllowed--;
        }
    }
    //sprite = enemy or player
    collideWith(sprite){
        const bulletThatHitSpriteIndex = this.bullets.findIndex((bullet) => bullet.collideWith(sprite));

        if(bulletThatHitSpriteIndex >= 0){
            this.bullets.splice(bulletThatHitSpriteIndex, 1);
            return true;
        }
        return false;
    }


    shoot(x,y, velocity,timeUntilNextBulletAllowed = 0){
        if(this.timeUntilNextBulletAllowed <=0 && this.bullets.length < this.maxBulletsAtATime){
            const bullet = new Bullet(this.canvas,x,y, velocity, this.bulletColor)
            this.bullets.push(bullet);
            if(this.soundEnabled){
                this.shootSound.currentTime = 0;
                this.shootSound.play();
            }
            this.timeUntilNextBulletAllowed = timeUntilNextBulletAllowed;
        }
    }
}