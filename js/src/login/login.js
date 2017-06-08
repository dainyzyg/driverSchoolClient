mui.init();
mui.plusReady(() => {
	window.auths = {};
	plus.oauth.getServices((services) => {
		for (var i in services) {
			var service = services[i];
			window.auths[service.id] = service;
			console.log(service.id);
		}
	});
	initVue();
});

function initVue() {
	new Vue({
		el: '.content',
		data: {
			show: true,
			isLoginPage: true,
			password: '',
			phone: '',
			loading: false,
			code: '',
			codeText: '获取验证码'
		},
		methods: {
			testapi() {
				this.loading = true;
				mui.ajax('http://118.89.225.203/api/school', {
					data: {
						ordertype: 'recommend',
						schoolid: ''
					},
					dataType: 'json', //服务器返回json格式数据
					type: 'post', //HTTP请求类型
					timeout: 10000, //超时时间设置为10秒；
					success: (data) => {
						this.loading = false;
						console.log(data)
					},
					error: (xhr, type, errorThrown) => {
						//异常处理；
						console.log('ajax', type);
					}
				})
			},
			setUserInfo(userInfo) {
				plus.storage.setItem('userInfo', JSON.stringify(userInfo));
				let userPage = plus.webview.getWebviewById('user/index.html');
				let subject2 = plus.webview.getWebviewById('subject2.html');
				mui.fire(subject2, 'refresh', userInfo);
				mui.fire(userPage, 'userInfo', userInfo);
			},
			qqLogin() {
				this.loading = true;
				window.auths['qq'].logout((e) => {
					this.thirdPartLogin('qq');
				}, (e) => {
					this.thirdPartLogin('qq');
				});
			},
			thirdPartLogin(type) {
				window.auths[type].login(() => {
						window.auths[type].getUserInfo(() => {
								let thirdPartUserInfo = window.auths[type].userInfo;
								console.log(JSON.stringify(thirdPartUserInfo));
								let userInfo = {};
								switch (type) {
									case 'qq':
										userInfo = {
											"isregister": true,
											"type": type, //根据登录方式修改，weixin或qq
											"name": thirdPartUserInfo.nickname,
											"userimgurl": thirdPartUserInfo.headimgurl,
											"thirdpartyid": thirdPartUserInfo.openid
										};
										break;
									case 'weixin':
										userInfo = {
											"isregister": true,
											"type": type, //根据登录方式修改，weixin或qq
											"name": thirdPartUserInfo.nickname,
											"userimgurl": thirdPartUserInfo.headimgurl,
											"thirdpartyid": thirdPartUserInfo.unionid
										};
										break;
								}
								mui.ajax('http://118.89.225.203/api/thirdparty_login', {
									data: {
										userinfo: JSON.stringify(userInfo)
									},
									dataType: 'json', //服务器返回json格式数据
									type: 'post', //HTTP请求类型
									timeout: 5000, //超时时间设置为10秒；
									success: (data) => {
										this.loading = false;
										if (data.err) {
											mui.toast('数据加载失败');
											return;
										}
										if (data.result.success) {
											mui.toast('登陆成功！');
											this.setUserInfo(data.result.userInfo);
											mui.back();
										} else {
											mui.toast(data.result.errorMsg);
										}
									},
									error: (xhr, type, errorThrown) => {
										this.loading = false;
										//异常处理；
										mui.toast('登陆异常，请重试！');
										console.log('ajax', type);
									}
								});
							},
							(e) => {
								this.loading = true;
								plus.nativeUI.toast("获取用户信息失败：" + e.message);
							});
					},
					(e) => {
						this.loading = true;
						plus.nativeUI.toast("登录认证失败：" + e.message);
					});
			},
			weixinLogin() {
				this.loading = true;
				window.auths['weixin'].logout((e) => {
					this.thirdPartLogin('weixin');
				}, (e) => {
					this.thirdPartLogin('weixin');
				});
			},
			login() {
				this.loading = true;
				mui.ajax('http://118.89.225.203/api/login', {
					data: {
						phone: this.phone,
						password: this.password,
						type: 'system'
					},
					dataType: 'json', //服务器返回json格式数据
					type: 'post', //HTTP请求类型
					timeout: 5000, //超时时间设置为10秒；
					success: (data) => {
						console.log(JSON.stringify(data));
						this.loading = false;
						if (data.err) {
							mui.toast('数据加载失败');
							return;
						}
						if (data.result.success) {
							mui.toast('登陆成功！');
							console.log(JSON.stringify(data));
							this.setUserInfo(data.result.userInfo);
							mui.back();
						} else {
							mui.toast(data.result.errorMsg);
						}
					},
					error: (xhr, type, errorThrown) => {
						this.loading = false;
						//异常处理；
						mui.toast('登陆异常，请重试！');
						console.log('ajax', type);
					}
				})
			},
			register() {
				if (!this.loading) {
					if (!this.password) {
						mui.toast('请输入密码！');
						return;
					}
					this.loading = true;
					mui.ajax('http://118.89.225.203/api/register', {
						data: {
							phone: this.phone,
							password: this.password,
							code: this.code,
							type: 'system'
						},
						dataType: 'json', //服务器返回json格式数据
						type: 'post', //HTTP请求类型
						timeout: 10000, //超时时间设置为10秒；
						success: (data) => {
							this.loading = false;
							if (data.err) {
								mui.toast('数据加载失败');
								return;
							}
							if (data.success) {
								mui.toast('注册成功！');
								this.setUserInfo(data.userInfo);
								mui.back();
							} else {
								mui.toast(data.errorMsg);
							}
						},
						error: (xhr, type, errorThrown) => {
							//异常处理；
							console.log('ajax', type);
						}
					})
				}
			},
			getCode() {
				if (this.codeText == '获取验证码') {
					let time = 60;
					this.codeText = `重获验证码 (${time})`;
					let si = setInterval(() => {
						time--
						this.codeText = `重获验证码 (${time})`;
						if (time == 0) {
							clearInterval(si);
							this.codeText = '获取验证码'
						}
					}, 1000);
					mui.ajax('http://118.89.225.203/api/sendregistercode', {
						data: {
							phone: this.phone
						},
						dataType: 'json', //服务器返回json格式数据
						type: 'post', //HTTP请求类型
						timeout: 10000, //超时时间设置为10秒；
						success: (data) => {
							if (data.success) {
								mui.toast('验证码发送成功！');
							} else {
								mui.toast(data.errorMsg);
							}
						},
						error: (xhr, type, errorThrown) => {
							mui.toast('连接服务器异常！');
						}
					});
				} else {
					console.log('disable')
				}
			}
		},
		watch: {
			isLoginPage(val) {
				let titleEle = document.getElementById('title');
				let titleStr = '登陆'
				if (val) {
					titleStr = '登陆';
				} else {
					titleStr = '注册';
				}
				this.$nextTick(() => {
					titleEle.innerHTML = titleStr;
				});
			}
		}
	})
}