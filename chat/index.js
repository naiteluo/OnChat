
/**
 * chat module
 */

exports.Chat = function (io) {
	var CR = {};

	CR.io = io;

	CR.TYPE = {
		CHAT: 'chat',
		SYSTEM: 'system',
		LOGIN: 'login',
		LIST: 'list',
		ERROR: 'error',
		NOTICE: 'notice',
		CONNECTED: 'connected'
	};

	/*
	 * Room, container of users
	 * handling io.sockets
	 */
	CR.Room = function (sockets) {
		this.sockets = sockets;
		this.users = {};
	};
	CR.Room.prototype = {
		start: function () {
			var _this = this;
			this.on('connection', function (socket) {
				var user = new CR.User(socket);
				_this.updateList();

				// listener on user
				user.setLoginListener(_this);
				user.setMsgListener(_this);
				user.setLogoutListener(_this);
				user.send(CR.TYPE.CONNECTED, {
					msg: '已连接服务器'
				});

			});
		},
		validateLogin: function (name, sex) {
			for (_name in this.users) {
				if(_name == name) return false;
			}
			return true;
		},
		addUser: function (user) {
			this.users[user.name] = {
				name: user.name,
				sex: user.sex
			};
		},
		updateList: function () {
			this.send(CR.TYPE.LIST, {
				users: this.users
			});
		},
		send: function (type, data) {
			this.sockets.emit(type, data);
		},
		on: function (type, fn) {
			this.sockets.on(type, fn);
		}
	}

	/*
	 * User, 
	 * handling a single socket
	 */
	CR.User = function (socket) {
		this.socket = socket;
		this.isLogined = false;
		// name sex
	}
	CR.User.prototype = {
		setLoginListener: function (room) {
			var _this = this;
			this.on(CR.TYPE.LOGIN, function (data) {
				console.log('LOGIN request recv');
				if(room.validateLogin(data.name, data.sex)) {
					_this.name = data.name;
					_this.sex = data.sex;
					_this.isLogined = true;
					_this.broadcast(CR.TYPE.NOTICE, {
						msg: _this.name + '已上线'
					});
					_this.send(CR.TYPE.LOGIN, {
						success: true
					});
					_this.send(CR.TYPE.NOTICE, {
						msg: '登陆成功，欢迎您'
					})
					room.addUser(_this);
					room.updateList();
				} else {
					_this.send(CR.TYPE.ERROR, {
						msg: '昵称已被占用'
					});
				}
			});
		},
		setMsgListener: function (room) {
			var _this = this;
			this.on(CR.TYPE.CHAT, function (data) {
				// data of chat msg may be as follow:
				// {from: 'xxx', msg: 'xsdfasf'}
				room.send(CR.TYPE.CHAT, data);
			})
		},
		setLogoutListener: function (room) {
			var _this = this;
			this.on('disconnect', function () {
				if(_this.isLogined) {
					room.send(CR.TYPE.NOTICE, {
						msg: _this.name + '已下线'
					});
					delete room.users[_this.name];
				}
				room.updateList();
				// delete this;
			});
		},
		// Send to current user
		send: function (type, data) {
			this.socket.emit(type, data);
		},
		// Broadcast to the others
		broadcast: function (type, data) {
			this.socket.broadcast.emit(type, data);
		},
		on: function (type, fn) {
			this.socket.on(type, fn);
		}
	}

	CR.start = function () {
		var room = new CR.Room(this.io.sockets);
		room.start();
	}

	return CR;
};
