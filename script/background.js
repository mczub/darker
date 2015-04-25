var WIDTH = 1200;
var HEIGHT = 1200;
var NUM_X = 6;
var NUM_Y = 6;
var canvas = document.createElement('canvas');
canvas.width = WIDTH;
canvas.height = HEIGHT;
var ctx = canvas.getContext("2d");
var texturesReady = 0;
var textures = new Array(
	new Image(),
	new Image(),
	new Image(),
	new Image()
);


var styleArray = new Array([HEIGHT]);
for (var i = 0; i < styleArray.length; i++)
{
	styleArray[i] = new Array([WIDTH]);
}
function checkAllTexturesLoaded()
{
	texturesReady++;
	if (texturesReady >= 4)
	{
		drawGlyphMask();
		drawImages();
		setBackground();
		texturesReady = 0;
	}
}

for(var i = 0; i < textures.length; i++)
{
	textures[i].onload = function() {
		checkAllTexturesLoaded();
	}
}
textures[0].src = "/white.jpg";
textures[1].src = "/darkgray.jpg";
textures[2].src = "/brick.jpg";
textures[3].src = "/grass.jpg";

function drawXGlyph(x_pos, y_pos)
{
	var x_unit = (WIDTH / NUM_X);
	var y_unit = (HEIGHT / NUM_Y);
	var x_offset = x_unit * x_pos;
	var y_offset = y_unit * y_pos;
	var x_start = x_unit / 4
	var y_start = y_unit / 4
	ctx.lineWidth = x_unit / 8;
	ctx.strokeStyle = 'blue';
	ctx.beginPath();
	ctx.moveTo(x_start + x_offset, y_start + y_offset);
	ctx.lineTo((x_start * 3) + x_offset, (y_start * 3) + y_offset);
	ctx.stroke();
	ctx.moveTo((x_start * 3) + x_offset, y_start + y_offset);
	ctx.lineTo((x_start) + x_offset, (y_start * 3) + y_offset);
	ctx.stroke();
	//ctx.globalCompositeOperation = 'source-in';
	
    globalCompositeOperation = 'source-over';
}

function drawTexture(x_pos, y_pos, texture)
{
	var x_unit = (WIDTH / NUM_X);
	var y_unit = (HEIGHT / NUM_Y);
	var x_offset = x_unit * x_pos;
	var y_offset = y_unit * y_pos;
    //ctx.drawImage(img, x_offset, y_offset, x_unit, y_unit);
    console.log(textures[texture].src);
    ctx.drawImage(textures[texture], x_offset,y_offset,x_unit,y_unit);
    ctx.fillStyle="rgba(0,0,0,0.5)";
    ctx.fillRect(x_offset,y_offset,x_unit,y_unit);
}

function drawGlyphMask()
{
	for (var i = 0; i < NUM_X; i++)
	{
		for (var j = 0; j < NUM_Y; j++)
		{
			var randomTexture = Math.floor((Math.random() * 4));
			drawXGlyph(i,j);
		}
	}
}

function drawImages()
{
	ctx.globalCompositeOperation = 'source-atop';
	for (var i = 0; i < NUM_X; i++)
	{
		for (var j = 0; j < NUM_Y; j++)
		{
			var randomTexture = Math.floor((Math.random() * 4));
			drawTexture(i,j,randomTexture);
		}
	}
	//ctx.globalCompositeOperation = 'source-over';
}


function setBackground()
{
	var url = canvas.toDataURL('image/png');
	document.getElementsByClassName("intro")[0].style.background = "url(" + url + ") no-repeat 50% 50%";
	//document.getElementsByClassName("intro")[0].style.background = "url('../grass.jpg') no-repeat 50% 50%";
	//console.log($("section.intro").css("background-image"));
}

