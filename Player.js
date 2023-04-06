export default class Player {

    rightPress = false;
    leftPress = false;
    shootPress = false;


    constructor(canvas, velocity, bulletControls){
        this.canvas = canvas;
        this.velocity = velocity;
        this.bulletControls = bulletControls;


        this.x = this.canvas.width / 2;
        this.y = this.canvas.height - 75;
        this.width = 50;
        this.height = 48;
        this.image = new Image();
        this.image.src = "images/player.png";

        document.addEventListener("keydown",this.keydown);
        document.addEventListener("keyup",this.keyup);
    }

    draw(ctx) {
        if(this.shootPress){
            //middle of canvas, speed 4, space between bullets
            this.bulletControls.shoot(this.x+this.width/2,this.y,4,10)
        }
        this.move();
        this.collideWithWalls();
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    }

    collideWithWalls() {
        //right
        if (this.x > this.canvas.width -this.width){
            this.x = this.canvas.width-this.width;
        }
        //left
        if(this.x < 0) {
            this.x =0;
        }
    }

    move(){
        if(this.rightPress){
            this.x += this.velocity;
        }
        else if(this.leftPress){
            this.x += -this.velocity;
        }
    }

    keydown = (e) => {
        if(e.code === "ArrowRight"){
            this.rightPress = true;
        }
        if(e.code === "ArrowLeft"){
            this.leftPress = true;
        }
        if(e.code === "Space"){
            this.shootPress = true;
        }
    }

    keyup = (e) => {
        if(e.code === "ArrowRight"){
            this.rightPress = false;
        }
        if(e.code === "ArrowLeft"){
            this.leftPress = false;
        }
        if(e.code === "Space"){
            this.shootPress = false;
        }
    }
}