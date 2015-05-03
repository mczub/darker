function HexBG(canv, width, height){
	var WIDTH = width;
	var HEIGHT = height;
	var SIZE = 20;
	var HEX_WIDTH = Math.sqrt(3) * SIZE;
	var HEX_HEIGHT = (SIZE * 2) * (3/4);
	var num_x = WIDTH / (HEX_WIDTH);
	var num_y = HEIGHT / (HEX_HEIGHT);
	//var canvas = document.getElementById('x-canvas');
	var canvas = canv;
	canvas.width = WIDTH;
	canvas.height = HEIGHT;
	var ctx = canvas.getContext("2d");
	var centers = [];
	for (var i = 0; i < num_x; i++)
	{
		centers[i] = [];
		for (var j = 0; j < num_y; j++)
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
		socket = io.disconnect();
	}

	function drawHexes()
	{
		var cos30 = 0.8660254037;
		var sin30 = 0.5;
		for (var i = 0; i < num_x; i++){
			for (var j = 0; j < num_y; j++){
				ctx.fillStyle = "rgba(255,255,255,1)";
				ctx.strokeStyle = "rgba(0,0,0,1)";
				ctx.lineWidth = 1;
				ctx.beginPath();
				ctx.moveTo(centers[i][j].x + SIZE * cos30, centers[i][j].y + SIZE * sin30);
				ctx.lineTo(centers[i][j].x , centers[i][j].y + SIZE);
				ctx.lineTo(centers[i][j].x - SIZE * cos30, centers[i][j].y + SIZE * sin30);
				ctx.lineTo(centers[i][j].x - SIZE * cos30, centers[i][j].y - SIZE * sin30);
				ctx.lineTo(centers[i][j].x , centers[i][j].y - SIZE);
				ctx.lineTo(centers[i][j].x + SIZE * cos30, centers[i][j].y - SIZE * sin30);
				ctx.lineTo(centers[i][j].x + SIZE * cos30, centers[i][j].y + SIZE * sin30);
				ctx.fill();
				ctx.closePath();
	    		//ctx.fillRect(centers[i][j].x,centers[i][j].y,5,5);
				
				ctx.stroke();
			}
		}
		
	}
}

