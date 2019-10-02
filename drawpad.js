var canvas = document.getElementById('paint');
var ctx_pad = canvas.getContext('2d');
 
var sketch = document.getElementById('sketch');
var sketch_style = getComputedStyle(sketch);
canvas.width = 420;
canvas.height = 420;
mouse_listening = 0;

var mouse = {x: 0, y: 0};
 
/* Mouse Capturing Work */
canvas.addEventListener('mousemove', function(e) {
  mouse.x = e.pageX - this.offsetLeft;
  mouse.y = e.pageY - this.offsetTop;
  onPaint();
}, false);

canvas.addEventListener('ondrag', function(e) {
  mouse.x = e.pageX - this.offsetLeft;
  mouse.y = e.pageY - this.offsetTop;
  onPaint();
}, false);

/* Drawing on Paint App */
ctx_pad.lineJoin = 'round';
ctx_pad.lineCap = 'round';

ctx_pad.strokeStyle = "black";
function getColor(colour){ctx_pad.strokeStyle = colour;}

function getSize(size){ctx_pad.lineWidth = size;}


//ctx.strokeStyle = 
//ctx.strokeStyle = document.settings.colour[1].value;
 
canvas.addEventListener('mousedown', function(e) {
    mouse_listening = 1;
    ctx_pad.beginPath();
    ctx_pad.moveTo(mouse.x, mouse.y);
    console.log(mouse_listening);
    console.log('mouse down');
    
}, false);

// canvas.addEventListener('mousemove', onPaint, false);
 
window.addEventListener('mouseup', function() {
      mouse_listening = 0;
      // canvas.removeEventListener('mousemove', onPaint, false);
      console.log(mouse_listening);
      console.log('mouse up');
    
}, false);

// canvas.addEventListener('mouseleave', function() {
//   mouse_listening = 0;
//   // canvas.removeEventListener('mousemove', onPaint, false);
//   console.log(mouse_listening);
//   console.log('mouse leave');

// }, false);

// canvas.addEventListener('mouseleave', function() {
//   if (mouse_listening) {
//     canvas.removeEventListener('mousemove', onPaint, false);
//     mouse_listening = 0;
//   }
//   console.log(mouse_listening);
// }, false);
 
var onPaint = function() {
  console.log('drawing');
    if (mouse_listening) {
      ctx_pad.lineTo(mouse.x, mouse.y);
      ctx_pad.stroke();
    }
};