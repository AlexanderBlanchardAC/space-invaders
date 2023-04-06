import Enemy from "./Enemy.js";
import Directions from "./Directions.js";


export default class EnemyControls {

    enemyMap = [
        //numbers correspond to enemy pics
        [0, 1, 1, 1, 0, 0, 1, 1, 1, 0],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [2, 2, 2, 3, 3, 3, 3, 2, 2, 2],
        [2, 2, 2, 3, 3, 3, 3, 2, 2, 2],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
    ];

    enemyRows = [];

    currentDirection = Directions.right;
    //moving horizontally
    xVelocity = 0;
    //moving vertically
    yVelocity = 0;
    defaultXVelocity = 1;
    defaultYVelocity = 1;
    downwardTimerDefault = 40;
    downwardTimer = this.downwardTimerDefault;
    fireTimerDefault = 100;
    fireTimer = this.fireTimerDefault;


    constructor(canvas, enemyBulletControls, playerBulletControls){
        this.canvas = canvas;
        this.enemyBulletControls = enemyBulletControls;
       this.playerBulletControls = playerBulletControls;
       

        this.enemyDeathSound = new Audio("audio/sounds_enemyDeath.wav");
        this.enemyDeathSound.volume = 0.5;
        this.createEnemies();
    }
    draw(ctx) {
        //downwardTimer value will be reduced anytime we call draw
      this.decrementDownwardTimer()
      this.updateVelocityAndDirection()
      this.collisionDetection()
      this.drawEnemies(ctx)
      this.resetDownwardTimer()
      this.fire()
      
    }

    collisionDetection(){
        this.enemyRows.forEach((enemyRow) => {
            enemyRow.forEach((enemy, enemyIndex) => {
                if(this.playerBulletControls.collideWith(enemy)){
                    //will play from beginning each time it is called to play;
                    this.enemyDeathSound.currentTime = 0;
                    this.enemyDeathSound.play();
                    enemyRow.splice(enemyIndex, 1)
                }
            })
        })
        //for orws that contain no enemies
        this.enemyRows = this.enemyRows.filter(enemyRow => enemyRow.length > 0)
    }

    fire() {
        this.fireTimer--;
        if(this.fireTimer <=0){
            this.fireTimer = this.fireTimerDefault;
            //2D array into 1D array - length will find total number of enemies
            const allEnemies = this.enemyRows.flat();
            const enemyIndex = Math.floor(Math.random() * allEnemies.length);
            const enemy = allEnemies[enemyIndex];
            //enemy position and bullet speed, - will travel downwards given bullet controller set up
            this.enemyBulletControls.shoot(enemy.x + enemy.width /2, enemy.y, -3)
            console.log(enemyIndex)

        }
    }

    resetDownwardTimer(){
        if(this.downwardTimer <= 0){
            this.downwardTimer = this.downwardTimerDefault;
        }
    }

    decrementDownwardTimer(){
        if(this.currentDirection === Directions.downLeft || this.currentDirection === Directions.downRight){
            this.downwardTimer--;
        }
    }

     //enemy on the edge will call all other enemies to switch directions when it hits the wall
    updateVelocityAndDirection() {
        //loop over all enemies and determine where furthest right enemy is - are they touching the wall?
        for(const enemyRow of this.enemyRows){
            if(this.currentDirection === Directions.right){
                this.xVelocity = this.defaultXVelocity;
                this.yVelocity = 0;
                //enemies should now be moving to the right
                //detect when enemies touch edge of screen
                const outerMostEnemyRight = enemyRow[enemyRow.length -1];
                if(outerMostEnemyRight.x + outerMostEnemyRight.width >= this.canvas.width){
                    this.currentDirection = Directions.downLeft;
                    break;
                }
            } else if (this.currentDirection === Directions.downLeft){
                if(this.moveDown(Directions.left)){
                    break;
                    //break for performance boost from not looping over previous rows
                }
            } else if(this.currentDirection === Directions.left){
                this.xVelocity = -this.defaultXVelocity;
                this.yVelocity = 0;
                const outerMostEnemyLeft = enemyRow[0];
                if(outerMostEnemyLeft.x <= 0){
                    this.currentDirection = Directions.downRight;
                    break;
                }
            } else if(this.currentDirection === Directions.downRight){
                if(this.moveDown(Directions.right)){
                     break;
                }
            }
        }
    }
    moveDown(newDirection) {
        this.xVelocity = 0;
        this.yVelocity = this.defaultYVelocity;
        if(this.downwardTimer <=0){
            this.currentDirection = newDirection;
            return true;
        }
        return false;
    }

      drawEnemies(ctx) {
        this.enemyRows.flat().forEach((enemy) => {
            enemy.move(this.xVelocity, this.yVelocity)
            enemy.draw(ctx);
        })
      }
    
//for each in order to skip some of the indexes in the rows
    createEnemies() {
        this.enemyMap.forEach((row, rowIndex) => {
            this.enemyRows[rowIndex] =[];
            row.forEach((enemyNumber, enemyIndex) => {
                if(enemyNumber > 0){
                    // *55 and *50 to create a gap between each enemy.
                    this.enemyRows[rowIndex].push(new Enemy(enemyIndex * 55, rowIndex * 50, enemyNumber))
                }
            })
        })
    }

    collideWith(sprite){
        return this.enemyRows.flat().some(enemy => enemy.collideWith(sprite))
    }
}