const express = require("express");
const port = 8189;
require("./js/server/dbChannel.js");
require("./js/server/market.js");
var app = express();
var server = app.listen(port, function() {
	var runhost = server.address().address;
	var runport = server.address().port;
	console.log("Example app listening at http://%s:%s", runhost, runport);
});
const io = require('socket.io')(server);
Mongodb.testConnection();

app.use('/js', express.static(__dirname + '/js'));
app.use('/css', express.static(__dirname + '/css'));
app.get('/',function(req, res){
  res.sendFile(__dirname + "/index.html");
});

io.on('connection', (socket)=>{
	socket.join('room 237', ()=>{
		let rooms = Object.keys(socket.rooms);
		io.to('room 237').emit('a new user has joined the room');
	});
  socket.on('login_user', (data)=>{
		if (data) {
			Mongodb.findOneData('user', "UserName", data, (res)=>{
				console.log(res);
			});
			// Mongodb.insertData('user', [{
			// 	UserName: data,
			// 	DateTime: "2017-02-05"
			// }]);
			io.sockets.emit('gl_message', "User: " + data + " enter the room!");
		}
  });
	socket.on('chat_mes', (mes)=>{
		console.log(mes);
		socket.broadcast.emit('gl_message', mes);
	});
	socket.on('streaming', (data)=>{
		if (data.status) {
			Streaming.start();
		}
		else {
			Streaming.end();
		}
	})
  socket.on('disconnect', ()=>{
    socket.broadcast.emit("user left", {
      username: socket.username
    })
  })



	var Streaming = function() {
		defaultTime: 10000;
		intervalId: null;
		return{
			start: function() {
				console.log("Start streaming");
				Streaming.sendData();
				Fixing.initData();
				Fixing.simulateQuote();
			},
			ricUpdate: function() {
				simulateRics.push(new Ric());
			},
			sendData: function () {
				let data = Fixing.generateSnapshot();
				console.log(data);
				socket.emit('streaming_data', data);
				Streaming.intervalId = setTimeout(Streaming.sendData, 500);
			},
			end: function() {
				console.log("Stop streaming");
				clearTimeout(Streaming.intervalId);
				for(var i = 1; i <= Streaming.intervalId; i++) {
				    clearTimeout(i);
				}
			}
		}
	}();
});
