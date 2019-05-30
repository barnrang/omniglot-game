const WIDTH = 1600
const HEIGHT = 900

var c = document.getElementById("myCanvas");
var ctx = c.getContext("2d");
c.setAttribute('width', WIDTH);
c.setAttribute('height', HEIGHT)

class FallingObject{
    constructor(){
        this.x = parseInt(Math.random() * 1600);
        this.y = 0;
        this.dy = 50;
    }

    update() {
        this.y = this.y + this.dy;
    }

    valid() {
        return this.y < HEIGHT;
    }

    render() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, 40, 0, 2 * Math.PI);
        ctx.stroke();
    }
}

class Game {
    constructor() {
        this.fallingObjectList = [];
        this.counter = 0
        this.loop = this.loop.bind(this)
    }

    loop () {
        console.log(this);
        ctx.clearRect(0, 0, c.width, c.height);
        if (this.counter % 10 == 0) {
            this.counter = 0;
            const object = new FallingObject();
            this.fallingObjectList.push(object);
        }
        this.counter++;
        var i = 0;
        for (i = this.fallingObjectList.length - 1;  i > -1 ; i--) {
            this.fallingObjectList[i].update();
            if (this.fallingObjectList[i].valid()) this.fallingObjectList[i].render();
            else this.fallingObjectList.splice(i, 1);
        }
        setTimeout(this.loop, 1000);
    }
}

const game_engine = new Game;
game_engine.loop()


