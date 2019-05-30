const WIDTH = 1600
const HEIGHT = 900
const NUM_IMAGE = 19280

var c = document.getElementById("myCanvas");
var ctx = c.getContext("2d");
c.setAttribute('width', WIDTH);
c.setAttribute('height', HEIGHT)

class FallingObject{
    constructor(){
        this.x = parseInt(Math.random() * 1600);
        this.y = 0;
        this.dy = 50;
        const img_index = parseInt(Math.random() * NUM_IMAGE);
        this.file_name = 'data/test/' + img_index + '.png';
        this.img = new Image();
        this.img.src = this.file_name;
    }

    update() {
        this.y = this.y + this.dy;
    }

    valid() {
        return this.y < HEIGHT;
    }

    render() {
        ctx.drawImage(this.img,this.x,this.y);
        ctx.strokeRect(this.x,this.y, this.img.width, this.img.height);
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
        if (this.counter % 6 == 0) {
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


