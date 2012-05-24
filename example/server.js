/*
 * SERVER
 */

var io = require('socket.io').listen(80);

// 监听、建立连接
io.sockets.on('connection', function (socket) {
	// 发送消息
	socket.emit('news', { hello: 'world' });
	// 监听消息,调用回调函数
	socket.on('my other event', function (data) {
		console.log(data);
	});
});

