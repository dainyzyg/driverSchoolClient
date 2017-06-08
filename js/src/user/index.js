import setting from '../../../vue/setting.vue'
import myCoupon from '../../../vue/myCoupon.vue'
import share from '../../../vue/share.vue'
mui.init();

function FunBackQuitAppL() {
	var backFirst = null;
	this.QuitApp = function () {
		//首次按键，提示‘再按一次退出应用’
		if (!backFirst) {
			backFirst = new Date().getTime();
			mui.toast('再按一次退出应用程序');
			setTimeout(function () {
				backFirst = null;
			}, 1000);
		} else {
			if ((new Date()).getTime() - backFirst < 1000) {
				plus.runtime.quit();
			}
		}
	}
}
let Q = new FunBackQuitAppL();
mui.back = function () {
	if (!window.vueComponent) {
		Q.QuitApp();
		return;
	}
	if (window.vueComponent.showSetting) {
		window.vueComponent.showSetting = false;
	} else if (window.vueComponent.showMyCoupon || window.vueComponent.showShare) {
		window.vueComponent.showMyCoupon = window.vueComponent.showShare = false;
	} else {
		Q.QuitApp();
	}
};
mui.plusReady(() => {
	let userInfo = null;
	if (plus.storage.getItem('userInfo')) {
		console.log(plus.storage.getItem('userInfo'));
		userInfo = JSON.parse(plus.storage.getItem('userInfo'));
	}
	plus.share.getServices(function (s) {
		for (var i in s) {
			if ('weixin' == s[i].id) {
				window.sharewx = s[i];
			}
		}
	}, function (e) {
		alert("获取分享服务列表失败：" + e.message);
	});
	// 获取支付通道
	plus.payment.getChannels(function (channels) {
		for (let item of channels) {
			if (item.id == 'alipay') {
				window.alipay = item;
				console.log('alipay');
				break;
			}
		}
	}, function (e) {
		alert("获取支付通道失败：" + e.message);
	});
	initVue(userInfo);
});


function initVue(userInfo) {
	window.vueComponent = new Vue({
		el: '.vue-body',
		components: {
			setting,
			myCoupon,
			share
		},
		data: {
			userInfo: userInfo,
			showSetting: false,
			showMyCoupon: false,
			showShare: false
		},
		created() {

		},
		updated() {

		},
		methods: {
			showWallet() {
				this.judgeUser((userInfo) => {
					mui.openWindow({
						url: 'myWallet.html'
					});
				});
			},
			showOrder() {
				this.judgeUser((userInfo) => {
					mui.ajax('http://118.89.225.203/api/trade', {
						data: {
							action: 'gettradeorder',
							userid: userInfo.id
						},
						dataType: 'json', //服务器返回json格式数据
						type: 'post', //HTTP请求类型
						timeout: 5000, //超时时间设置为10秒；
						success: (result) => {
							console.log(JSON.stringify(result.tradelist))
							if (result.tradelist.length) {
								mui.openWindow({
									url: 'myOrder.html'
								});
							} else {
								var btnArray = ['现在就去', '再看看'];
								mui.confirm(' ', '你还没有报名', btnArray, (e) => {
									if (e.index == 0) {
										//获得主页面的webview
										var main = plus.webview.currentWebview().parent();
										//触发主页面的gohome事件
										mui.fire(main, 'gohome');
									}
								});
							}
						},
						error: (xhr, type, errorThrown) => {
							console.log(xhr)
						}
					});
				});
			},
			judgeUser(func) {
				let userInfo = plus.storage.getItem('userInfo') && JSON.parse(plus.storage.getItem('userInfo'));
				if (userInfo && userInfo.id) {
					mui.ajax('http://118.89.225.203/api/getuserinfo', {
						data: {
							"userid": userInfo.id
						},
						dataType: 'json', //服务器返回json格式数据
						type: 'post', //HTTP请求类型
						timeout: 5000, //超时时间设置为10秒；
						success: (data) => {
							if (data.err) {
								mui.toast('用户信息获取失败!');
								return;
							}
							if (!data.result.success) {
								mui.toast(data.result.errorMsg);
							} else {
								plus.storage.setItem('userInfo', JSON.stringify(data.result.userInfo));
								// console.log(JSON.stringify(data.result.userInfo));
								func(data.result.userInfo);
							}
						},
						error: (xhr, type, errorThrown) => {
							mui.toast('连接服务器异常');
						}
					})
				} else {
					var btnArray = ['现在就去', '再看看'];
					mui.confirm(' ', '请先登录或注册', btnArray, (e) => {
						if (e.index == 0) {
							mui.openWindow({
								url: '../login/login.html',
								show: {
									autoShow: true, //页面loaded事件发生后自动显示，默认为true
									aniShow: 'pop-in', //页面显示动画，默认为”slide-in-right“；
									duration: 300 //页面动画持续时间，Android平台默认100毫秒，iOS平台默认200毫秒；
								}
							});
						}
					});
				}
			},
			// showSetting() {
			// 	this.showSetting = true;
			// },
			showMyCouponFunc() {
				if (this.userInfo) {
					this.showMyCoupon = true;
				} else {
					var btnArray = ['现在就去', '再看看'];
					mui.confirm(' ', '请先登录或注册', btnArray, (e) => {
						if (e.index == 0) {
							this.toLogin();
						} else {

						}
					});
				}
			},
			logoff() {
				var btnArray = ['确定', '取消'];
				mui.confirm(' ', '确认退出当前帐号？', btnArray, (e) => {
					if (e.index == 0) {
						plus.storage.setItem('userInfo', '');
						this.userInfo = null;
						this.showSetting = false;
					}
				});
			},
			toggleLogin() {
				if (!this.userInfo) {
					this.toLogin();
				} else {
					var btnArray = ['确定', '取消'];
					mui.confirm(' ', '确认退出当前帐号？', btnArray, (e) => {
						if (e.index == 0) {
							plus.storage.setItem('userInfo', '');
							this.userInfo = null;
						}
					});
				}
			},
			toLogin() {
				mui.openWindow({
					url: '../login/login.html',
					show: {
						autoShow: true, //页面loaded事件发生后自动显示，默认为true
						aniShow: 'pop-in', //页面显示动画，默认为”slide-in-right“；
						duration: 300 //页面动画持续时间，Android平台默认100毫秒，iOS平台默认200毫秒；
					}
				});
			},
			shareWeixin(scene) {
				mui.ajax('http://118.89.225.203/api/generateinvitecode', {
					data: {
						userid: this.userInfo.id
					},
					dataType: 'json', //服务器返回json格式数据
					type: 'post', //HTTP请求类型
					timeout: 10000, //超时时间设置为10秒；
					success: (data) => {
						console.log(JSON.stringify(data));
						if (data.success) {
							if (window.sharewx) {
								sharewx.send({
									content: "老斯基学车",
									title: "我为老斯基代言",
									href: "http://118.89.225.203/inviteview/newinviteview.html?invitecode=" + data.invitecode,
									extra: {
										scene: scene
									}
								}, function () {
									alert("分享成功！");
								}, function (e) {
									alert("分享失败：" + e.message);
								});
							} else {
								alert('请安装微信！')
							}
						} else {
							mui.toast(data.message);
						}
					},
					error: (xhr, type, errorThrown) => {
						mui.toast('连接服务器异常！');
					}
				});
			},
			onShare() {
				var btnArray = [{
					title: "分享到微信好友"
				}, {
					title: "分享到朋友圈"
				}];
				plus.nativeUI.actionSheet({
					// title: "选择照片",
					cancel: "取消",
					buttons: btnArray
				}, (e) => {
					console.log(JSON.stringify(e));
					let index = e.index;
					let scene = '';
					switch (index) {
						case 0:
							return;
						case 1:
							scene = 'WXSceneSession'
							break;
						case 2:
							scene = 'WXSceneTimeline';
							break;
					}
					this.shareWeixin(scene);
				});
			},
			share() {
				if (this.userInfo) {
					this.showShare = true;
				} else {
					var btnArray = ['现在就去', '再看看'];
					mui.confirm(' ', '请先登录或注册', btnArray, (e) => {
						if (e.index == 0) {
							this.toLogin();
						} else {

						}
					});
				}
			},
			myStatus() {
				this.judgeUser((userInfo) => {
					let STATE = {
						"0": "开始报名",
						"1": "报名成功",
						"2": "科目一完成",
						"3": "科目二完成",
						"4": "科目三完成",
						"5": "科目四完成",
						"6": "拿取驾照"
					};
					if (userInfo.hasOwnProperty('state')) {
						mui.openWindow({
							url: `driveProcess.html?state=${encodeURIComponent(STATE[userInfo.state])}`
						})
					} else {
						mui.toast('暂无阶段信息！');
					}
				});
			},
			yuyuekaoshi() {
				mui.openWindow({
					url: `../webview.html?title=${encodeURIComponent('预约考试')}&url=${encodeURIComponent('http://www.122.gov.cn/m/map/select')}`
				});
			},
			myfaults() {
				if (plus.storage.getItem('wrongList-originalMapping1.json') && JSON.parse(plus.storage.getItem('wrongList-originalMapping1.json')).length > 0) {
					mui.openWindow({
						url: '../learn-driving/exerciseCustom.html?mapping=wrong&questionsJson=questionsJson1.json&type=1'
					})
				} else {
					mui.alert('暂无错题')
				}
			},
			lianxikefu() {
				console.log('lianxikefu')
				plus.device.dial("010-69457307", true);
			},
			about() {
				mui.openWindow({
					url: `../webview.html?title=${encodeURIComponent('科一考规')}&image=${encodeURIComponent('../images/image-page/about.jpg')}`
				});
				// mui.openWindow({
				// 	url: `../test.html`
				// });
			}
		},
		computed: {
			showSettingIcon() {
				return this.userInfo ? true : false;
			}
		}
	})
}
window.addEventListener('userInfo', function (event) {
	window.vueComponent.userInfo = event.detail;
	// mui.ajax('http://118.89.225.203/api/getuserinfo', {
	// 	data: {
	// 		"userid": window.vueComponent.userInfo.id
	// 	},
	// 	dataType: 'json', //服务器返回json格式数据
	// 	type: 'post', //HTTP请求类型
	// 	timeout: 5000, //超时时间设置为10秒；
	// 	success: (data) => {
	// 		console.log('img');
	// 		console.log(JSON.stringify(data));
	// 		if (data.err) {
	// 			//mui.toast('用户信息获取失败!');
	// 			return;
	// 		}
	// 		if (!data.result.success) {
	// 			//mui.toast(data.result.errorMsg);
	// 		} else {
	// 			plus.storage.setItem('userInfo', JSON.stringify(data.result.userInfo));
	// 			window.vueComponent.userInfo = data.result.userInfo;
	// 		}
	// 	},
	// 	error: (xhr, type, errorThrown) => {
	// 		//mui.toast('连接服务器异常');
	// 	}
	// })
});