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
	var canvas = canv;
	var bgcanvas = bgcanv;
	bgcanvas.width = WIDTH;
	bgcanvas.height = HEIGHT;
	canvas.width = WIDTH;
	canvas.height = HEIGHT;
	var ctx = canvas.getContext("2d");
	var bgctx = bgcanvas.getContext("2d");
	var centers = [];
	var radialReqId = 0;
	var radialCenter = [];
	var radialHex;
	var curRadFill = 0;
	var freezeMouseHex = false;
	var fillColor = "0,0,255"
	for (var i = 0; i < num_x + 1; i++)
	{
		centers[i] = [];
		for (var j = 0; j < num_y + 1; j++)
		{
			if (j % 2 == 0){
				centers[i][j] = {x: i * HEX_WIDTH, y: HEX_HEIGHT * j};
			}else{
				centers[i][j] = {x: HEX_WIDTH * i + HEX_WIDTH / 2, y: HEX_HEIGHT * j}
			}
		}
	}
	drawHexes();
	socket = io.connect();
	
	socket.on('state', function(data){
		//console.log(data)
		styleArray = data;
		redraw();
	})
	
	function close(){
		canvas = null;
		bgcanvas = null;
		socket = io.disconnect();
	}

	function drawHexes()
	{
		
		for (var i = 0; i < num_x + 1; i++){
			for (var j = 0; j < num_y + 1; j++){
				drawHex(bgctx, i,j, "rgba(255,255,255,1)","rgba(0,0,0,1)", 1, SIZE )
				
			}
		}
	}
	
	function drawHex(context, i, j, fill, outline, lineWidth, size)
	{
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
	}
	
	function clearFG()
	{
		ctx.clearRect(0,0,WIDTH, HEIGHT);
	}
	
	var elem = document.getElementsByClassName("intro")[0];
	
	elem.addEventListener('mousemove', function(event)
	{
		//console.log(event.pageX + "," + event.pageY);
		//console.log(elem.offsetWidth + "," + elem.offsetHeight);
		var canv_x_pos = (WIDTH - elem.offsetWidth) / 2 + event.pageX;
		var canv_y_pos = (HEIGHT - elem.offsetHeight) / 2 + event.pageY;
		if (canv_x_pos > WIDTH || canv_x_pos < 0) return;
		if (canv_y_pos > HEIGHT || canv_y_pos < 0) return;
		//var x_unit = Math.floor(canv_x_pos / (WIDTH / NUM_X));
		//var y_unit = Math.floor(canv_y_pos / (HEIGHT / NUM_Y));
		//console.log(x_unit + "," + y_unit);
		if (freezeMouseHex) return;
		clearFG();
		var hex = getHex(canv_x_pos,canv_y_pos);
		//console.log(hex);
		drawHex(ctx, hex[0], hex[1], "rgba(" + fillColor + ",1)", "rgba(0,0,0,1)", 4, SIZE*1.3);
	}, false);
	
	elem.addEventListener('mousedown', function(event)
	{
		freezeMouseHex = true;
		//console.log(event.pageX + "," + event.pageY);
		//console.log(elem.offsetWidth + "," + elem.offsetHeight);
		var canv_x_pos = (WIDTH - elem.offsetWidth) / 2 + event.pageX;
		var canv_y_pos = (HEIGHT - elem.offsetHeight) / 2 + event.pageY;
		if (canv_x_pos > WIDTH || canv_x_pos < 0) return;
		if (canv_y_pos > HEIGHT || canv_y_pos < 0) return;
		
		radialHex = getHex(canv_x_pos,canv_y_pos);
		drawHex(ctx, radialHex[0], radialHex[1], "rgba(" + fillColor + ",1)", "rgba(0,0,0,1)", 4, SIZE*1.3);
		radialCenter = centers[radialHex[0]][radialHex[1]]
		radialReqId = requestAnimationFrame(radialFill)
	}, false);
	
	elem.addEventListener('mouseup', function(event)
	{
		
		freezeMouseHex = false;
		//console.log(event.pageX + "," + event.pageY);
		//console.log(elem.offsetWidth + "," + elem.offsetHeight);
		cancelAnimationFrame(radialReqId);
		ctx.globalCompositeOperation = 'source-over';
		var hex = getHex(radialCenter.x,radialCenter.y);
		explode(Math.floor(curRadFill*3),hex[0],hex[1]);
		curRadFill = 0;
	}, false);
	
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
		ctx.fillStyle = "rgba(0,0,0,0.3)";
		ctx.fill();
		drawHex(ctx, radialHex[0], radialHex[1], "rgba(0,0,0,0)", "rgba(0,0,0,1)", 4, SIZE*1.3);
		//ctx.fillRect(radialCenter.x,radialCenter.y,2,2);
		radialReqId = requestAnimationFrame(radialFill)
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
		console.log(xx,yy,zz, rad_hexes)
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
					[1,0.5],
					[1,0.7,0.3],
					[1,0.8,0.6,0.2],
					[1,1,0.8,0.5,0.2],
					[1,1,0.8,0.8,0.5,0.2],
					[1,1,0.8,0.6,0.4,0.2,0.1]
				]
				var fill = "rgba(" + fillColor + "," + opacity[rad_hexes][distance] + ")"
				console.log(rad_hexes, distance, fill)
				drawHex(bgctx, i, j, fill, "rgba(0,0,0,1)", 1, SIZE)
			}
		}
		//console.log(explode)
	}
}

