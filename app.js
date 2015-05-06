var express = require('express.io');
app = express().http().io();
app.use(express.static(__dirname + '/public/'));

var NUM_X = 8;
var NUM_Y = 8;
var NUM_TEXTURES = 4;

var styleArray = new Array();
for (var i = 0; i < NUM_X; i++)
{
	styleArray[i] = new Array();
	for (var j = 0; j < NUM_Y; j++)
	{
		styleArray[i][j] = Math.floor((Math.random() * NUM_TEXTURES));
	}
}
console.log('started')

app.get('/hexdraw', function(req,res){
	res.sendfile(__dirname + '/public/hexdraw.html');
})

app.io.route('connected', function(req){
	console.log('client connected');
	req.io.emit('state', styleArray);
})

app.io.route('click', function(req){
	console.log('got click' + req.data)
	var x = req.data[0];
	var y = req.data[1];
	styleArray[x][y]++
	styleArray[x][y] %= NUM_TEXTURES;
	req.io.broadcast('click', req.data);
})

app.io.route('redraw', function(req){
	console.log('redraw');
	req.io.emit('state', styleArray);
})

app.io.route('disconnected', function(req){
	console.log('client disconnected');
	//req.io.emit('state', styleArray);
})

/*app.get('/', function(req, res) {
    res.sendfile(__dirname + '/index.html')
})*/
var port = process.env.PORT || 7076;
app.listen(port);