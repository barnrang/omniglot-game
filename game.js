const WIDTH = (window.innerWidth
|| document.documentElement.clientWidth
|| document.body.clientWidth) - 500;//1280
const HEIGHT = (window.innerHeight
|| document.documentElement.clientHeight
|| document.body.clientHeight ); //720
const NUM_IMAGE = 19280
var THRESHOLD = 0.85
var LOOPTIME = 400
var REGENTIME = 10
const HEIGHT7 = parseInt(HEIGHT / 7)
const WIDTH6 = parseInt(WIDTH / 6)
const HEIGHT14 = parseInt(HEIGHT / 14)
const WIDTH12 = parseInt(WIDTH / 12)

model_setup = 0
add_screen_click_event = 0
score = 0

function renderHowToPlay() {
    ctx.font = "20px Arial"
    ctx.fillText('z - 打つ', parseInt(WIDTH12 * 11), parseInt(HEIGHT14 * 3))
    ctx.fillText('c - クリア', parseInt(WIDTH12 * 11), parseInt(HEIGHT14 * 4))
    ctx.fillText('r - リスタート', parseInt(WIDTH12 * 11), parseInt(HEIGHT14 * 5))
    ctx.font = "50px Arial"
}

class Model {
    constructor() {
        this.model_path = []
        this.extract_feature = null
        this.regression = null
        this.load_model()
        
        
    }

    async load_model(){
        this.regression = await tf.loadLayersModel('models/js_regress_keras_weight_bias0.5_new/model.json')
        this.extract_feature = await tf.loadLayersModel('models/js_feature_keras_weight_bias0.5_new/model.json')
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
        this.x = parseInt(Math.random() * (WIDTH - 400)) + 200;
        this.y = 0;
        this.dy = 5;

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

class SelectButton {
    constructor(x, y, width, height, text) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.text = text
    }

    set_text(text) {
        this.text = text;
    }

    inBox (x,y) {
        return (x >= this.x) && (x < (this.x + this.width)) & (y >= this.y) && (y < (this.y + this.height))
    }

    render () {
        ctx.strokeRect(this.x,this.y, this.width, this.height)
        ctx.textAlign="center"; 
        ctx.textBaseline = "middle";
        ctx.fillText(this.text, parseInt((this.x + this.width / 2)), parseInt((this.y + this.height / 2)))
    }
}

class Game {
    constructor() {
        this.game_state = 'select-mode';
        this.falling_object_list = [];
        
        this.makeSelectButton = this.makeSelectButton.bind(this)
        this.makeSelectButton()
        this.onclickButton = this.onclickButton.bind(this)

        this.counter = 0
        this.loop = this.loop.bind(this)
    }

    loop () {

        ctx.clearRect(0, 0, c.width, c.height);
        switch (this.game_state) {
            case 'select-mode':
                if (add_screen_click_event == 0) {
                    add_screen_click_event = 1;
                    c.addEventListener('click', this.onclickButton)
                }
                for (let i = 0; i < this.select_button_list.length; i++){
                    this.select_button_list[i].render()
                }
                this.score_box.render()
                break;

            case 'playing':

                
                if (this.counter % REGENTIME == 0) {
                    this.counter = 0;
                    const object = new FallingObject();
                    this.falling_object_list.push(object);
                }

                this.counter++;
                var i = 0;

                for (i = this.falling_object_list.length - 1;  i > -1 ; i--) {
                    this.falling_object_list[i].update();
                    if (this.falling_object_list[i].valid()) this.falling_object_list[i].render();
                    else {
                        this.game_state = 'death'
                        this.falling_object_list = [];
                    }
                }
                this.score_box.set_text('Score: ' + score);
                this.score_box.render();
                

                break;
            
            case 'death':
                this.score_box.render();
                break;
        }
        renderHowToPlay()
        setTimeout(this.loop, LOOPTIME);
    }

    onclickButton (event) {
        
        let offsetLeft = c.offsetLeft;
        let offsetTop = c.offsetTop;
        let x = event.pageX - offsetLeft;
        let y = event.pageY - offsetTop
        var i = 0
        for (i = 0; i < this.select_button_list.length; i++){
            if (this.select_button_list[i].inBox(x, y)) break;
        }
        switch (i) {
            case 0:
                LOOPTIME = 400
                REGENTIME = 10
                this.game_state = 'playing'
                break;
            case 1:
                LOOPTIME = 400
                REGENTIME = 6
                this.game_state = 'playing'
                break;
            case 2:
                LOOPTIME = 200
                REGENTIME = 6
                this.game_state = 'playing'
                break;
        
            default:
                break;
        }

    }

    makeSelectButton () {
        let button1 = new SelectButton(WIDTH6, HEIGHT7, WIDTH6 * 4, HEIGHT7, 'Harder')
        let button2 = new SelectButton(WIDTH6, 3 * HEIGHT7, WIDTH6 * 4, HEIGHT7, 'Hardest')
        let button3 = new SelectButton(WIDTH6, 5 * HEIGHT7, WIDTH6 * 4, HEIGHT7, 'Lunatic')
        this.score_box = new SelectButton(WIDTH6*5, 0, WIDTH6, HEIGHT7, 'Score: 0')
        this.select_button_list = [button1, button2, button3];

    }
}

const game_engine = new Game;

document.addEventListener('keypress', function(e) {
    
    if (e.code === 'KeyC') {
        // Clear drawing pad
        ctx_pad.clearRect(0, 0, canvas.width, canvas.height);
    }
    else if (e.code == 'KeyZ') {
        // Submit drawn image
        let drawn_image = extract_image();
        let drawn_feature = model.get_feature(drawn_image);
        let feature_array = game_engine.falling_object_list.map(x=>x.feature);
        let concat_feature = tf.concat(feature_array, 0);
        let tiled_feature = tf.tile(drawn_feature, [feature_array.length, 1]);
        let diff = tf.abs(tf.sub(concat_feature, tiled_feature))
        let result = model.get_regress(diff);
        let validity = tf.greater(result, THRESHOLD).reshape([-1]).arraySync();
        console.log(result.reshape([-1]).arraySync());
        for (let i = validity.length-1; i > -1 ; i--) {
            if (validity[i] == 1) {
                score++;
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
    ctx.font = "50px Arial";

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

