const WIDTH = 1600
const HEIGHT = 900
const NUM_IMAGE = 19280
const THRESHOLD = 0.99

model_setup = 0

class Model {
    constructor() {
        this.model_path = []
        this.extract_feature = null
        this.regression = null
        this.load_model()
        
        
    }

    async load_model(){
        this.regression = await tf.loadLayersModel('models/js_regress_keras_weight/model.json')
        this.extract_feature = await tf.loadLayersModel('models/js_feature_keras_weight/model.json')
        console.log('finish load');
        model_setup = 1;
        
    }

    get_feature(imgs) {
        return this.extract_feature.predict(imgs);
    }
    
    get_regress(diff_features) {
        return this.regression.predict(diff_features);
    }

    get_predict(imgs1, imgs2){
        const feature1 = this.get_feature(imgs1);
        const feature2 = this.get_feature(imgs2);
        const diff_features = tf.abs(feature1 - feature2);
        return this.get_regress(diff_features)
    }

}

class FallingObject{
    constructor(){
        this.x = parseInt(Math.random() * 1200) + 200;
        this.y = 0;
        this.dy = 10;

        const img_index = parseInt(Math.random() * NUM_IMAGE);
        this.file_name = 'data/test/' + img_index + '.png';
        this.img = new Image();
        this.feature = null;
        this.img.onload = () => {
            const reshape_img = tf.browser.fromPixels(this.img, 1).expandDims();
            this.feature = model.get_feature(reshape_img);
        }
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
        this.falling_object_list = [];
        this.counter = 0
        this.loop = this.loop.bind(this)
    }

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
        setTimeout(this.loop, 100);
    }
}

const game_engine = new Game;

document.addEventListener('keypress', function(e) {
    
    if (e.code === 'KeyC') {
        ctx_pad.clearRect(0, 0, canvas.width, canvas.height);
    }
    else if (e.code == 'KeyZ') {
        let drawn_image = extract_image();
        let drawn_feature = model.get_feature(drawn_image);
        let feature_array = game_engine.falling_object_list.map(x=>x.feature);
        let concat_feature = tf.concat(feature_array, 0);
        let tiled_feature = tf.tile(drawn_feature, [feature_array.length, 1]);
        let diff = tf.abs(tf.sub(concat_feature, tiled_feature))
        let result = model.get_regress(diff);
        let validity = tf.greater(result, 0.95).reshape([-1]).arraySync();
        console.log(result.reshape([-1]).arraySync());
        for (let i = validity.length-1; i > -1 ; i--) {
            if (validity[i] == 1) {
                game_engine.falling_object_list.splice(i, 1);
            }
        }
    }
}, false);

function main() {
    c = document.getElementById("myCanvas");
    ctx = c.getContext("2d");
    c.setAttribute('width', WIDTH);
    c.setAttribute('height', HEIGHT)

    ctx_pad.lineWidth = 20;

    game_engine.loop()
}

function waitForSetup(){
    if(model_setup == 1){
        main()
    }
    else{
        setTimeout(waitForSetup, 250);
    }
}

console.log('Preparing..')
model = new Model()
console.log('Finish Preparing')

waitForSetup()
console.log('finish waiting');

