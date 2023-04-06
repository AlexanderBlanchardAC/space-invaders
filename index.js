import EnemyControls from "./EnemyControls.js";
import Player from "./Player.js";
import BulletControls from "./BulletControls.js";

const canvas = document.getElementById("spaceInvadersGame");
const ctx = canvas.getContext("2d");

canvas.width = 600;
canvas.height = 600;

const background = new Image();
background.src = "images/stars-background.jpg";

//max 10 bullets onscreen at any one time, sound - true
const playerBulletControls = new BulletControls(canvas, 10, "red", true);
const enemyBulletControls = new BulletControls(canvas, 4, "white", false);
//player bullet controls in enemy controls for purposes of collision detection
const enemyControls = new EnemyControls(canvas, enemyBulletControls, playerBulletControls);
const player = new Player(canvas, 3, playerBulletControls);

let isGameOver = false;
let didWin = false;

const spaceInvadersGame = () => {
    checkGameOver();
    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
    displayGameOver()
    if(!isGameOver){
    enemyControls.draw(ctx);
    player.draw(ctx)
    playerBulletControls.draw(ctx);
    enemyBulletControls.draw(ctx);
    }
}

const displayGameOver = () => {
    if(isGameOver){
        let text = didWin ? "You Win!" : "Game Over!";
        let textOffSet = didWin ? 3.5 : 5;

        ctx.fillStyle = "white";
        ctx.font = "70px Arial";
        ctx.fillText(text, canvas.width / textOffSet, canvas.height /2);
    }
}

const checkGameOver = () =>  {
    if(isGameOver){
        return;
    }
    if(enemyBulletControls.collideWith(player)){
        isGameOver = true;
    }
    if(enemyControls.collideWith(player)){
        isGameOver = true;
    }
    if(enemyControls.enemyRows.length === 0){
        didWin = true;
        isGameOver = true;
    }
}


setInterval(spaceInvadersGame, 1000 / 60);