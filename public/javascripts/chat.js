
/*
 * Author: naiteluo
 *
 */

var _CR = {
	init : function (server) {
		delete this.init;		// protect CR

		var CR = {
			io: io
		};

		(function (CR) {
			CR.TYPE = {
				CHAT: 'chat',
				SYSTEM: 'system',
				LOGIN: 'login',
				LIST: 'list',
				ERROR: 'error',
				NOTICE: 'notice'
			};

			/*
			 * User,
			 * handling a single socket
			 */
			CR.User = function (socket) {
				this.socket = socket;
				this.isLogined = false;
			};
			CR.User.prototype = {
				start: function () {
					this.setLoginListener();
					this.setMsgListener();
					this.setListListener();
				},
				setLoginListener: function () {
					var _this = this;
					$('#login').bind('click', function () {
						var name = $('input[name="name"]').val();
						var sex = $('input[name="sex"]:checked').val();
						if(_this.validateLogin(name, sex)) {
							_this.send(CR.TYPE.LOGIN, {
								name: name,
								sex: sex
							});
							// login result
							_this.on(CR.TYPE.LOGIN, function (data) {
								if(data.success) {
									_this.name = name;
									_this.sex = sex;
									_this.isLogined = true;
									$('#login-form').hide();
									$('#describe').hide();
									$('#welcome p strong').html(_this.name);
									$('#welcome').show();
								}
							})
						} else {
							alert("用户名、性别输入有误！");
						}
					});
				},
				setMsgListener: function () {
					var _this = this;
					// send msg listener

					$('#send').bind('click', function () {
						if(!_this.isLogined) {
							// _this.addLog();
							alert('请先登陆!');
							return;
						}
						if($('#chat-input').val().length > 0) {
							_this.send(CR.TYPE.CHAT, {
								from: _this.name,
								msg: $('#chat-input').val()
							});
							$('#chat-input').val('');
						}
					});
					// handle CHAT msg
					this.on(CR.TYPE.CHAT, function (data) {
						var html = '<tr class="log">' + 
							'<td class="name ' + 
							((_this.name && _this.name == data.from) ? 'me' : 'others') + 
							'">' + 
							((_this.name && _this.name == data.from) ? '我' : data.from) +
							'</td><td class="message">' +
							data.msg +
							'</td></tr>';
						$(html).appendTo($('#logs tbody')).show();
						autoScroll();
					});
					// handle NOTICE and ERROR
					this.on(CR.TYPE.NOTICE, function (data) {
						var html = '<tr class="log notice">' + 
							'<td class="name system">' + 
							'系统消息' +
							'</td><td class="message">' +
							data.msg +
							'</td></tr>';
						$(html).appendTo($('#logs tbody')).show();
						autoScroll();
					});
					this.on(CR.TYPE.ERROR, function (data) {
						var html = '<tr class="log error">' + 
							'<td class="name system">' + 
							'系统消息' +
							'</td><td class="message">' +
							data.msg +
							'</td></tr>';
						$(html).appendTo($('#logs tbody')).show();
						autoScroll();
					});

				},
				setListListener: function () {
					var _this = this;
					this.on(CR.TYPE.LIST, function (data) {
						_this.updateList(data.users);
					});
				},
				send: function (type, data) {
					this.socket.emit(type, data);
				},
				on: function (type, fn) {
					this.socket.on(type, fn);
				},
				addLog: function (type, data) {
					// not yet
				},
				updateList: function (users) {
					var html = '';
					$('#users').empty();
					for (name in users) {
						html += ('<li class="user ' + users[name].sex + '">' + name + '</li>');
					}
					$('#users').html(html);
				},
				validateLogin: function (name, sex) {
					return name && sex &&  name.length > 2;
				}
			}
		})(CR);

		CR.start = function (server) {
			var socket = this.io.connect(server);
			var user = new CR.User(socket);
			user.start();
		}

		CR.start(server);
	}
};