function XBackground(canv, width, height, socket){
	var WIDTH = width;
	var HEIGHT = height;
	var NUM_X = 8;
	var NUM_Y = 8;
	//var canvas = document.getElementById('x-canvas');
	var canvas = canv;
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
	var styleArray = new Array();
	drawGlyphMask();
	setBackground();
	//console.log(ctx)
	//socket.emit('redraw');
	
	function onSocketState(data)
	{
		styleArray = data;
		redraw();
	}
	
	function onSocketClick(data)
	{
		increment(data[0], data[1], false)
	}
	socket.on('state', onSocketState)
	socket.on('click', onSocketClick)
	
	XBackground.prototype.close = function(){
		ctx.clearRect(0,0,WIDTH,HEIGHT);
		var elem = document.getElementsByClassName("intro")[0];
		elem.removeEventListener('click', onClick);
		canvas = null;
		ctx = null;
		//socket.disconnect();
		socket.removeListener('state', onSocketState)
		socket.removeListener('click', onSocketClick)
	}

/*var styleArray = new Array();
for (var i = 0; i < NUM_X; i++)
{
	styleArray[i] = new Array();
	for (var j = 0; j < NUM_Y; j++)
	{
		styleArray[i][j] = Math.floor((Math.random() * textures.length));
	}
}*/
	function checkAllTexturesLoaded()
	{
		texturesReady++;
		//console.log(texturesReady)
		if (texturesReady >= textures.length)
		{
			//console.log('redraw');
			socket.emit('redraw');
			drawGlyphMask();
			//drawImages();
			//setBackground();
			texturesReady = 0;
		}
	}
	
	for(var i = 0; i < textures.length; i++)
	{
		textures[i].onload = checkAllTexturesLoaded;
	}
	textures[0].src = "./white.jpg";
	textures[1].src = "./darkgray.jpg";
	textures[2].src = "./brick.jpg";
	textures[3].src = "./grass.jpg";
	function onClick(event){
		//console.log(event.pageX + "," + event.pageY);
		//console.log(elem.offsetWidth + "," + elem.offsetHeight);
		var canv_x_pos = (WIDTH - elem.offsetWidth) / 2 + event.pageX;
		var canv_y_pos = (HEIGHT - elem.offsetHeight) / 2 + event.pageY;
		var x_unit = Math.floor(canv_x_pos / (WIDTH / NUM_X));
		var y_unit = Math.floor(canv_y_pos / (HEIGHT / NUM_Y));
		//console.log(x_unit + "," + y_unit);
		increment(x_unit,y_unit, true);
	}
	var elem = document.getElementsByClassName("intro")[0];
	elem.addEventListener('click', onClick, false);
	
	function drawXGlyph(x_pos, y_pos)
	{
		var x_unit = (WIDTH / NUM_X);
		var y_unit = (HEIGHT / NUM_Y);
		var x_offset = x_unit * x_pos;
		var y_offset = y_unit * y_pos;
		var x_start = x_unit / 4
		var y_start = y_unit / 4
		ctx.lineWidth = x_unit / 8;
		ctx.strokeStyle = 'rgba(255,255,255,0.5)';
		ctx.beginPath();
		ctx.moveTo(x_start + x_offset, y_start + y_offset);
		ctx.lineTo((x_start * 3) + x_offset, (y_start * 3) + y_offset);
		//ctx.stroke();
		ctx.moveTo((x_start * 3) + x_offset, y_start + y_offset);
		ctx.lineTo((x_start) + x_offset, (y_start * 3) + y_offset);
		ctx.stroke();
		//ctx.globalCompositeOperation = 'source-in';
		
	    //globalCompositeOperation = 'source-over';
	}
	
	function drawTexture(x_pos, y_pos, texture)
	{
		var x_unit = (WIDTH / NUM_X);
		var y_unit = (HEIGHT / NUM_Y);
		var x_offset = x_unit * x_pos;
		var y_offset = y_unit * y_pos;
	    //ctx.drawImage(img, x_offset, y_offset, x_unit, y_unit);
	    //console.log(texture);
	    ctx.drawImage(textures[texture], x_offset,y_offset,x_unit,y_unit);
	    ctx.fillStyle="rgba(0,0,0,0.2)";
	    ctx.fillRect(x_offset,y_offset,x_unit,y_unit);
	}
	
	function drawGlyphMask()
	{
		for (var i = 0; i < NUM_X; i++)
		{
			for (var j = 0; j < NUM_Y; j++)
			{
				//var randomTexture = Math.floor((Math.random() * 4));
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
				//var randomTexture = Math.floor((Math.random() * 4));
				drawTexture(i,j,styleArray[i][j]);
			}
		}
		//ctx.globalCompositeOperation = 'source-over';
	}
	
	function redraw()
	{
		//drawGlyphMask();
		drawImages();
		setBackground();
	}
	
	
	function setBackground()
	{
		var url = canvas.toDataURL('image/jpg');
		var img = new Image();
		img.onload = function()
		{
			//document.getElementsByClassName("intro")[0].style.background = "url(" + img.src + ") no-repeat 50% 50%";
		};
		img.src = url;
		//document.getElementsByClassName("intro")[0].style.background = "url('../grass.jpg') no-repeat 50% 50%";
		//console.log($("section.intro").css("background-image"));
	}
	
	function increment(x_pos,y_pos,emit)
	{
		//console.log(styleArray);

		//drawTexture(x_pos, y_pos, styleArray[x_pos][y_pos]);
		//setBackground();

		if (x_pos >= 0 && y_pos >= 0 && x_pos < NUM_X && y_pos < NUM_Y){
			styleArray[x_pos][y_pos]++;
			styleArray[x_pos][y_pos] %= textures.length;
			redraw();
			if (emit == true){
				 socket.emit('click', [x_pos, y_pos]);
			}
		}
	}
}

