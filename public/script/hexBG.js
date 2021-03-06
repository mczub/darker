function HexBG(canv, bgcanv, width, height){
	var WIDTH = width;
	var HEIGHT = height;
	var SIZE = 20;
	var cos30 = 0.8660254037;
	var sin30 = 0.5;
	var HEX_WIDTH = Math.sqrt(3) * SIZE;
	var HEX_HEIGHT = (SIZE * 2) * (3/4);
	var num_x = WIDTH / (HEX_WIDTH);
	var num_y = HEIGHT / (HEX_HEIGHT);
	//var canvas = document.getElementById('x-canvas');
	var screenCanvas = bgcanv;
	var screenctx = screenCanvas.getContext("2d");
	var bgcanvas = document.createElement("canvas");
	var canvas = canv;
	bgcanvas.width = WIDTH;
	bgcanvas.height = HEIGHT;
	canvas.width = WIDTH;
	canvas.height = HEIGHT;
	screenCanvas.width = window.innerWidth;
	screenCanvas.height = window.innerHeight;
	var ctx = canvas.getContext("2d");
	var bgctx = bgcanvas.getContext("2d");
	var centers = [];
	var colors = [];
	var radialReqId = 0;
	var radialCenter = [];
	var radialHex;
	var curRadFill = 0;
	var freezeMouseHex = false;
	var fillColor = "122, 82, 204";
	var transformMode = false;
	var scaleFactor = 1.00;
    var panX = 0;
    var panY = 0;
	
	for (var i = 0; i < num_x + 1; i++)
	{
		centers[i] = [];
		for (var j = 0; j < num_y + 1; j++)
		{
			if (j % 2 == 0){
				centers[i][j] = {x: i * HEX_WIDTH, y: HEX_HEIGHT * j, c: "rgba(255,255,255,1)"};
			}else{
				centers[i][j] = {x: HEX_WIDTH * i + HEX_WIDTH / 2, y: HEX_HEIGHT * j, c: "rgba(255,255,255,1)"}
			}
		}
	}
	drawHexes();
	drawBGtoScreen();
	//var socket = io.connect();
		
	HexBG.prototype.close = function(){
		ctx.clearRect(0,0,WIDTH,HEIGHT);
		bgctx.clearRect(0,0,WIDTH,HEIGHT);
		screenctx.clearRect(0,0,window.innerWidth,window.innerHeight);
		var elem = document.getElementById('x-canvas');
		elem.removeEventListener('mousemove', onMouseMove);
		hexhammer.destroy();
		canvas = null;
		ctx = null;
		screenCanvas = null;
		screenctx = null;
		bgcanvas = null;
		bgctx = null;
	}
	
	HexBG.prototype.setColor = function(rgbString){
		//console.log(rgbString, rgbString.substring(4, rgbString.length - 1))
		fillColor = rgbString.substring(4,rgbString.length - 1);
		//console.log("rgba(" + fillColor + ",1)")
	}
	
	HexBG.prototype.setTransform = function(scale, pan_x, pan_y){
		scaleFactor = scale;
		panX = (1 - scaleFactor) * 800 + pan_x;
		panY = (1 - scaleFactor) * 800 + pan_y;
		
		//clearBG();
		clearFG();
		
		ctx.setTransform(scale, 0, 0, scale, panX, panY);
		//bgctx.setTransform(scale, 0, 0, scale, panX, panY);
		//screenctx.setTransform(scale, 0, 0, scale, panX, panY);
		//ctx.fillStyle='rgba(0,0,0,1)';
		//ctx.fillRect(0,0,WIDTH, HEIGHT);
		//ctx.globalCompositeOperation = 'source-atop';
		//bgctx.fillStyle='rgba(255,255,255,1)';
		//bgctx.fillRect(0,0,WIDTH, HEIGHT);
		//bgctx.globalCompositeOperation = 'source-atop';
		//drawHexes();
		drawBGtoScreen();
	}
	
	HexBG.prototype.getURL = function(){
		return bgcanvas.toDataURL("image/png");
	}

	function drawHexes()
	{
		
		for (var i = 0; i < num_x + 1; i++){
			for (var j = 0; j < num_y + 1; j++){
				drawHex(bgctx, i,j, centers[i][j].c,"rgba(180,180,180,1)", 1, SIZE )
				
			}
		}
	}
	function drawBGtoScreen()
	{
		screenctx.clearRect(0,0,screenCanvas.width, screenCanvas.height)
		screenctx.drawImage(bgcanvas, (screenCanvas.width - WIDTH ) / 2 + panX, (screenCanvas.height - HEIGHT ) / 2 + panY, WIDTH *scaleFactor, HEIGHT * scaleFactor )
	}
	
	function drawHex(context, i, j, fill, outline, lineWidth, size)
	{
		context.save();
		context.beginPath();
		context.moveTo(0,0);
		context.lineTo(WIDTH, 0);
		context.lineTo(WIDTH, HEIGHT);
		context.lineTo(0, HEIGHT);
		context.closePath();
		context.clip();
		if (i < 0) i = 0;
		if (j < 0) j = 0;
		context.fillStyle = fill;
		context.strokeStyle = outline;
		context.lineWidth = lineWidth;
		context.beginPath();
		context.moveTo(centers[i][j].x + size * cos30, centers[i][j].y + size * sin30);
		context.lineTo(centers[i][j].x , centers[i][j].y + size);
		context.lineTo(centers[i][j].x - size * cos30, centers[i][j].y + size * sin30);
		context.lineTo(centers[i][j].x - size * cos30, centers[i][j].y - size * sin30);
		context.lineTo(centers[i][j].x , centers[i][j].y - size);
		context.lineTo(centers[i][j].x + size * cos30, centers[i][j].y - size * sin30);
		context.lineTo(centers[i][j].x + size * cos30, centers[i][j].y + size * sin30);
		context.fill();
		context.closePath();
		context.stroke();
		context.restore();
		
	}
	
	function clearFG()
	{
		ctx.clearRect(0,0,WIDTH, HEIGHT);
	}
	
	function clearBG()
	{
		//bgctx.fillStyle='rgba(0,0,0,1)';
		bgctx.clearRect(0,0,WIDTH, HEIGHT);
	}
	
	function onMouseMove(event)
	{	
		
		//console.log(event.pageX + "," + event.pageY);
		//console.log(canvas.getBoundingClientRect().left, canvas.getBoundingClientRect().top);
		//var canv_x_pos = (WIDTH - elem.offsetWidth) / 2 + event.pageX;
		//var canv_y_pos = (HEIGHT - elem.offsetHeight) / 2 + event.pageY;
		var canv_x_pos = (event.pageX - canvas.getBoundingClientRect().left - window.pageXOffset - panX) / scaleFactor;
		var canv_y_pos = (event.pageY - canvas.getBoundingClientRect().top - window.pageYOffset - panY) / scaleFactor;
		if (canv_x_pos > WIDTH || canv_x_pos < 0) return;
		if (canv_y_pos > HEIGHT || canv_y_pos < 0) return;

		if (freezeMouseHex) return;
		clearFG();
		var hex = getHex(canv_x_pos,canv_y_pos);
		//console.log(hex);
		drawHex(ctx, hex[0], hex[1], "rgba(" + fillColor + ",1)", "rgba(0,0,0,1)", 4, SIZE*1.3);
	}
	
	function onMouseDown(event){
		freezeMouseHex = true;
		//console.log('mouse down')
		//console.log(event.pageX + "," + event.pageY);
		//console.log(elem.offsetWidth + "," + elem.offsetHeight);
		//var canv_x_pos = (WIDTH - elem.offsetWidth) / 2 + event.pageX;
		//var canv_y_pos = (HEIGHT - elem.offsetHeight) / 2 + event.pageY;
		var canv_x_pos = (event.pageX - canvas.getBoundingClientRect().left - window.pageXOffset) / scaleFactor;
		var canv_y_pos = (event.pageY - canvas.getBoundingClientRect().top - window.pageYOffset) / scaleFactor;
		if (canv_x_pos > WIDTH || canv_x_pos < 0) return;
		if (canv_y_pos > HEIGHT || canv_y_pos < 0) return;
		
		radialHex = getHex(canv_x_pos,canv_y_pos);
		drawHex(ctx, radialHex[0], radialHex[1], "rgba(" + fillColor + ",1)", "rgba(0,0,0,1)", 4, SIZE*1.3);
		radialCenter = centers[radialHex[0]][radialHex[1]]
		radialReqId = requestAnimationFrame(radialFill)
	}
	
	function onMouseUp(event)
	{
		freezeMouseHex = false;
		//console.log('mouse up')
		//console.log(event.pageX + "," + event.pageY);
		//console.log(elem.offsetWidth + "," + elem.offsetHeight);
		cancelAnimationFrame(radialReqId);
		//ctx.globalCompositeOperation = 'source-over';
		if (radialCenter.x < 0 || radialCenter.x > WIDTH) return;
		if (radialCenter.y < 0 || radialCenter.y > HEIGHT) return;
		
		var hex = getHex(radialCenter.x,radialCenter.y);
		explode(Math.floor(curRadFill*3),hex[0],hex[1]);
		curRadFill = 0;
	}
	
	function onTap(event){
		console.log('tap')
		if (freezeMouseHex)
		{
			cancelAnimationFrame(radialReqId);
			clearFG();
			freezeMouseHex = false;
			curRadFill = 0;
			//ctx.globalCompositeOperation = 'source-over';
			return;
		}
		//console.log(event.pageX + "," + event.pageY);
		//console.log(elem.offsetWidth + "," + elem.offsetHeight);
		//var canv_x_pos = (WIDTH - elem.offsetWidth) / 2 + event.pageX;
		//var canv_y_pos = (HEIGHT - elem.offsetHeight) / 2 + event.pageY;
		var canv_x_pos = (event.center.x - canvas.getBoundingClientRect().left - window.pageXOffset - panX) / scaleFactor;
		var canv_y_pos = (event.center.y - canvas.getBoundingClientRect().top - window.pageYOffset - panY) / scaleFactor;
		if (canv_x_pos > WIDTH || canv_x_pos < 0) return;
		if (canv_y_pos > HEIGHT || canv_y_pos < 0) return;
		
		radialHex = getHex(canv_x_pos,canv_y_pos);
		//drawHex(ctx, radialHex[0], radialHex[1], "rgba(" + fillColor + ",1)", "rgba(0,0,0,1)", 4, SIZE*2);
		radialCenter = centers[radialHex[0]][radialHex[1]]
		var hex = getHex(radialCenter.x,radialCenter.y);
		explode(0,hex[0],hex[1]);
	}
	
	function onPress(event){
		if (freezeMouseHex)
		{
			cancelAnimationFrame(radialReqId);
			clearFG();
			freezeMouseHex = false;
			curRadFill = 0;
			
			ctx.globalCompositeOperation = 'source-over';
			return;
		}
		freezeMouseHex = true;
		console.log('press')
		//console.log(event.pageX + "," + event.pageY);
		//console.log(elem.offsetWidth + "," + elem.offsetHeight);
		//var canv_x_pos = (WIDTH - elem.offsetWidth) / 2 + event.pageX;
		//var canv_y_pos = (HEIGHT - elem.offsetHeight) / 2 + event.pageY;
		var canv_x_pos = (event.center.x - canvas.getBoundingClientRect().left - window.pageXOffset - panX) / scaleFactor;
		//console.log(canvas.getBoundingClientRect().left , canvas.getBoundingClientRect().top)
		var canv_y_pos = (event.center.y - canvas.getBoundingClientRect().top - window.pageYOffset - panY) / scaleFactor;
		if (canv_x_pos > WIDTH || canv_x_pos < 0) return;
		if (canv_y_pos > HEIGHT || canv_y_pos < 0) return;
		
		radialHex = getHex(canv_x_pos,canv_y_pos);
		if (event.pointerType == 'touch'){
			drawHex(ctx, radialHex[0], radialHex[1], "rgba(" + fillColor + ",1)", "rgba(0,0,0,1)", 4, SIZE*2);
			radialCenter = centers[radialHex[0]][radialHex[1]]
			radialReqId = requestAnimationFrame(radialFillMobile)
		}
		else{
			drawHex(ctx, radialHex[0], radialHex[1], "rgba(" + fillColor + ",1)", "rgba(0,0,0,1)", 4, SIZE*1.3);
			radialCenter = centers[radialHex[0]][radialHex[1]]
			radialReqId = requestAnimationFrame(radialFill)
		}
		
		

		
	}
	
	function onPressUp(event)
	{
		freezeMouseHex = false;
		//console.log(event.pageX + "," + event.pageY);
		//console.log(elem.offsetWidth + "," + elem.offsetHeight);
		cancelAnimationFrame(radialReqId);
		console.log('press up')
		ctx.globalCompositeOperation = 'source-over';
		if (radialCenter.x < 0 || radialCenter.x > WIDTH) return;
		if (radialCenter.y < 0 || radialCenter.y > HEIGHT) return;
		
		var hex = getHex(radialCenter.x,radialCenter.y);
		explode(Math.floor(curRadFill*3),hex[0],hex[1]);
		clearFG();
		curRadFill = 0;
	}
	var elem = document.getElementById('x-canvas');
	
	elem.addEventListener('mousemove', onMouseMove, false);
	
	//elem.addEventListener('mousedown', onMouseDown, false);
	
	//elem.addEventListener('mouseup', onMouseUp, false);
	
	var hexhammer = new Hammer(elem);
	hexhammer.off('pan');
	hexhammer.off('swipe');
	hexhammer.get('press').set({ time: 100, threshold: 999999 });
	hexhammer.get('tap').set({ time: 100, interval: 0});
	hexhammer.get('pan').set({ threshold: 999999 });
	hexhammer.get('swipe').set({ threshold: 999999 });

	
	hexhammer.on('tap', onTap);
	hexhammer.on('press', onPress);
	hexhammer.on('pressup', onPressUp);
	
	function getHex(xpos, ypos)
	{
		var x_est = Math.round(xpos / HEX_WIDTH)
		var y_est = Math.round(ypos / HEX_HEIGHT)
		
		//console.log(xpos, ypos)
		//return [x_est, y_est]
		var min_dist = SIZE;
		var closest = [x_est, y_est];
		for (var i = (x_est - 1); i < (x_est + 2); i++)
		{
			for (var j = (y_est - 1); j < (y_est + 2); j++)
			{
				if (i < 0) continue;
				if (j < 0) continue;
				if (i > num_x) continue;
				if (j > num_y) continue;
				//drawHex(i,j, "rgba(255,255,255,1)", "rgba(0,0,0,1)", SIZE);
				//drawHex(ctx, i,j, "rgba(80,80,80,1)", "rgba(0,0,0,1)", 1, SIZE);
				var dist = distance(xpos, ypos, centers[i][j].x, centers[i][j].y);
				if (dist < min_dist) {
					min_dist = dist;
					closest = [i,j];
				}
			}
		}
		
		return closest
	}
	
	function radialFill(time)
	{
		ctx.globalCompositeOperation = 'source-atop';
		drawHex(ctx, radialHex[0], radialHex[1], "rgba(" + fillColor + ",1)", "rgba(0,0,0,1)", 4, SIZE*1.3);
		ctx.beginPath();
		//console.log(radialCenter)
		if (curRadFill < 2) curRadFill += 0.02;
		ctx.moveTo(radialCenter.x,radialCenter.y)
		ctx.arc(radialCenter.x, radialCenter.y, SIZE*2, -Math.PI/2, curRadFill * Math.PI - Math.PI/2, false);
		ctx.closePath();
		ctx.fillStyle = "rgba(0,0,0,0.5)";
		ctx.fill();
		drawHex(ctx, radialHex[0], radialHex[1], "rgba(0,0,0,0)", "rgba(0,0,0,1)", 4, SIZE*1.3);
		//ctx.fillRect(radialCenter.x,radialCenter.y,2,2);
		radialReqId = requestAnimationFrame(radialFill)
	}
	
	function radialFillMobile(time)
	{
		ctx.globalCompositeOperation = 'source-atop';
		drawHex(ctx, radialHex[0], radialHex[1], "rgba(" + fillColor + ",1)", "rgba(0,0,0,1)", 4, SIZE*2);
		ctx.beginPath();
		//console.log(radialCenter)
		if (curRadFill < 2) curRadFill += 0.02;
		ctx.moveTo(radialCenter.x,radialCenter.y)
		ctx.arc(radialCenter.x, radialCenter.y, SIZE*2, -Math.PI/2, curRadFill * Math.PI - Math.PI/2, false);
		ctx.closePath();
		ctx.fillStyle = "rgba(0,0,0,0.5)";
		ctx.fill();
		drawHex(ctx, radialHex[0], radialHex[1], "rgba(0,0,0,0)", "rgba(0,0,0,1)", 4, SIZE*2);
		//ctx.fillRect(radialCenter.x,radialCenter.y,2,2);
		radialReqId = requestAnimationFrame(radialFillMobile)
	}
	
	function distance(x1, y1, x2, y2)
	{
		return Math.sqrt(Math.pow((x2 - x1),2) + Math.pow((y2 - y1),2));
	}
	
	/* 
	the hex math here is from Red Blob Games
	http://www.redblobgames.com/grids/hexagons/ 
	*/
	function explode(rad_hexes, x, y)
	{
		var xx = x - (y - (y&1)) / 2;
		var zz = y;
		var yy = -xx-zz;
		//console.log(xx,yy,zz, rad_hexes)
		var results = []
		for (var dx = -(rad_hexes); dx <= rad_hexes; dx++)
		{
			for (var dy = Math.max(-rad_hexes, -dx-rad_hexes); dy<=Math.min(rad_hexes, rad_hexes-dx); dy++)
			{
				var dz = -dx - dy;
				var distance = Math.max(Math.abs(dx), Math.abs(dy), Math.abs(dz))
				//console.log(distance, rad_hexes)
				var xxx = xx + dx;
				var yyy = yy + dy;
				var zzz = zz + dz;
				//console.log([xx + (zz - (zz&1)) / 2, zz])
				i = xxx + (zzz - (zzz&1)) / 2;
				j = zzz;
				if (i < 0) continue;
				if (j < 0) continue;
				if (i > num_x) continue;
				if (j > num_y) continue;
				var opacity = [
					[1],
					[1,0.8],
					[1,0.9,0.8],
					[1,0.9,0.8,0.6],
					[1,0.9,0.8,0.7,0.6],
					[1,1,0.9,0.8,0.7,0.6],
					[1,1,0.9,0.9,0.8,0.7,0.6]
				]
				var fill = "rgba(" + fillColor + "," + opacity[rad_hexes][distance] + ")"
				//console.log(rad_hexes, distance, fill)
				drawHex(bgctx, i, j, fill, "rgba(0,0,0,0)", 1, SIZE)
				var scaled_x = (centers[i][j].x * scaleFactor) + panX;
				var scaled_y = (centers[i][j].y * scaleFactor) + panY;
				//var color = bgctx.getImageData(scaled_x, scaled_y, 1, 1).data;
				//centers[i][j].c = "rgba(" + color[0] + "," + color[1] + "," + color[2] + ",1)"; 
			}
		}
		drawBGtoScreen();
	}
}

