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


    preprocess_img() {
        return 0;
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
        this.falling_object_list = [];
        this.falling_features_list = [];
        this.counter = 0
        // this.model = new Model();
        this.loop = this.loop.bind(this)
    }

    // on_submit_drawing () {
        
    // }

    loop () {
        console.log(this);
        ctx.clearRect(0, 0, c.width, c.height);
        if (this.counter % 6 == 0) {
            this.counter = 0;
            const object = new FallingObject();
            this.falling_object_list.push(object);
            // this.falling_features_list.push(this.model.get_feature(object.preprocess_img()))
        }

        this.counter++;
        var i = 0;

        for (i = this.falling_object_list.length - 1;  i > -1 ; i--) {
            this.falling_object_list[i].update();
            if (this.falling_object_list[i].valid()) this.falling_object_list[i].render();
            else this.falling_object_list.splice(i, 1);
        }
        // setTimeout(this.loop, 1000);
    }
}

const game_engine = new Game;
game_engine.loop()

