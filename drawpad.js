var canvas = document.getElementById('paint');
var ctx_pad = canvas.getContext('2d');
 
var sketch = document.getElementById('sketch');
var sketch_style = getComputedStyle(sketch);
canvas.width = 500;
canvas.height = 250;

var mouse = {x: 0, y: 0};
 
/* Mouse Capturing Work */
canvas.addEventListener('mousemove', function(e) {
  mouse.x = e.pageX - this.offsetLeft;
  mouse.y = e.pageY - this.offsetTop;
}, false);

/* Drawing on Paint App */
ctx_pad.lineJoin = 'round';
ctx_pad.lineCap = 'round';

ctx_pad.strokeStyle = "red";
function getColor(colour){ctx_pad.strokeStyle = colour;}

function getSize(size){ctx_pad.lineWidth = size;}


//ctx.strokeStyle = 
//ctx.strokeStyle = document.settings.colour[1].value;
 
canvas.addEventListener('mousedown', function(e) {
    ctx_pad.beginPath();
    ctx_pad.moveTo(mouse.x, mouse.y);
 
    canvas.addEventListener('mousemove', onPaint, false);
}, false);
 
canvas.addEventListener('mouseup', function() {
    canvas.removeEventListener('mousemove', onPaint, false);
}, false);
 
var onPaint = function() {
    ctx_pad.lineTo(mouse.x, mouse.y);
    ctx_pad.stroke();
};