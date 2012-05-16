
/*
 * chat module
 *
 */

exports.Chat = function (io) {
	var CR = {};

	CR.io = io;

	/*
	 * Room, container of users
	 * handling io.sockets
	 */
	CR.Room = function (sockets) {
		this.sockets = sockets;
		this.counts = 0;
		this.users = {};
		this.list = [];
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

			});
		},
		validateLogin: function (name, sex) {
			for (_name in this.users) {
				if(_name == name) return false;
			}
			return true;
		},
		addUser: function (user) {
			this.users[user.name] = user;
		},
		updateList: function () {
			this.list = [];
			for (name in this.users) {
				this.list.push(name);
			}
			this.send('list', {
				list: this.list
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
			this.on('login', function (data) {
				var name = data.name;
				var sex = data.sex;
				if(room.validateLogin(name, sex)) {
					_this.name = name;
					_this.sex = sex;
					room.addUser(_this);
				} else {
					_this.send('error', {
						msg: '昵称已被占用'
					});
				}
			});
		},
		setMsgListener: function (room) {

		},
		setLogoutListener: function (room) {

		},
		send: function (type, data) {
			this.socket.emit(type, data);
		},
		on: function (type, fn) {
			this.socket.on(type, fn);
		}
	}

	CR.start = function () {
		var room = new Room(this.io.sockets);
		room.start();
	}

	return CR;
};
