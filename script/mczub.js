var WIDTH = 800;
var HEIGHT = 400;
var ctx = document.getCSSCanvasContext('2d', 'hexes', WIDTH, HEIGHT);
var image = new Image();
image.src = "../world.jpg"
ctx.fillStyle="#888888";
ctx.fillRect(0,0,WIDTH,HEIGHT);
var count = 40;
var direction = 1;
var colorStops = new Array(
	{color:"rgba(0,0,0,0.8)", stopPercent:0},
 	{color:"rgba(0,0,0,0.6)", stopPercent:.2},
 	{color:"rgba(0,0,0,0.4)", stopPercent:.4},
 	{color:"rgba(0,0,0,0.4)", stopPercent:.6},
 	{color:"rgba(0,0,0,0.6)", stopPercent:.8},
 	{color:"rgba(0,0,0,0.8)", stopPercent:1});

function drawShimmer(time){
	// Create gradient
	ctx.drawImage(image,0,0,WIDTH,HEIGHT);
    //grd = ctx.createLinearGradient(-WIDTH,0, 2*WIDTH, 0);
      
      // Add colors
    
      // Fill with gradient
      //ctx.fillStyle = grd;
    var alpha = count/200.0;
    var colorString = "rgba(0,0,0," + alpha.toString() + ")";
    count += direction;
    if (count > 160 | count < 40)
    {
      	direction *= -1;
      	count += direction;
      	console.log(colorString);
    }
    ctx.fillStyle = colorString;
    ctx.fillRect(0, 0, WIDTH, HEIGHT);
    window.requestAnimationFrame(drawShimmer);
}
image.onload= function(){
	window.requestAnimationFrame(drawShimmer);
};
