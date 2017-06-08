mui.init()
mui.plusReady(() => {
	getBookingCount();
	document.querySelector(".test").addEventListener('tap', e => {
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
						//console.log(JSON.stringify(data.result.userInfo))
						judgeUser(data.result.userInfo);
					}
				},
				error: (xhr, type, errorThrown) => {
					mui.toast('连接服务器异常');
				}
			})
		} else {
			judgeUser();
		}

	});
	document.querySelector(".practice").addEventListener('tap', e => {
		let userInfo = plus.storage.getItem('userInfo') && JSON.parse(plus.storage.getItem('userInfo'));
		if (!userInfo) {
			var btnArray = ['现在就去', '再看看'];
			mui.confirm(' ', '请先登录或注册', btnArray, (e) => {
				if (e.index == 0) {
					tologin();
				}
			})
		} else if (userInfo.isselectcoach) {
			toPreorderRecord();
		} else if (userInfo.isenroll) {
			var btnArray = ['现在就去', '再看看'];
			mui.confirm(' ', '你还没有选择教练', btnArray, (e) => {
				if (e.index == 0) {
					toSelectCoach();
				}
			});
		} else {
			var btnArray = ['现在就去', '再看看'];
			mui.confirm(' ', '你还没有报名', btnArray, (e) => {
				if (e.index == 0) {
					toJoin();
				}
			})
		}
	});
});
document.querySelector(".kaogui").addEventListener('tap', e => {
	mui.openWindow({
		url: `../webview.html?title=${encodeURIComponent('科二考规')}&image=${encodeURIComponent('../images/image-page/k2.png')}`
	});
})
document.querySelector(".kaoshimiji").addEventListener('tap', e => {
	mui.openWindow({
		url: `../webview.html?title=${encodeURIComponent('考试秘籍')}&url=${encodeURIComponent('http://mp.weixin.qq.com/mp/homepage?__biz=MzI3NzA3NTYyNA==&hid=4&sn=0ef3a5b3357649b190be1b405d785452')}`
	});
})
document.querySelector(".kaoshishipin").addEventListener('tap', e => {
	mui.toast('此功能暂未开通，敬请期待');
})
document.querySelector(".yuyuekaoshi").addEventListener('tap', e => {
	mui.openWindow({
		url: `../webview.html?title=${encodeURIComponent('预约考试')}&url=${encodeURIComponent('http://www.122.gov.cn/m/map/select')}`
	});
})

function judgeUser(userInfo) {
	if (!userInfo) {
		var btnArray = ['现在就去', '再看看'];
		mui.confirm(' ', '请先登录或注册', btnArray, (e) => {
			if (e.index == 0) {
				tologin();
			}
		})
	} else if (userInfo.state != '2') {
		mui.alert('学员状态不符，无法进行该操作！');
	} else if (userInfo.isselectcoach) {
		toPreorder();
	} else if (userInfo.isenroll) {
		toSelectCoach();
		// var btnArray = ['现在就去', '再看看'];
		// mui.confirm(' ', '你还没有选择教练', btnArray, (e) => {
		// 	if (e.index == 0) {
		// 		toSelectCoach();
		// 	}
		// });
	} else {
		var btnArray = ['现在就去', '再看看'];
		mui.confirm(' ', '你还没有报名', btnArray, (e) => {
			if (e.index == 0) {
				toJoin();
			}
		})
	}
}

function toJoin() {
	console.log('toJoin1');
	//获得主页面的webview
	var main = plus.webview.currentWebview().parent().parent();
	//触发主页面的gohome事件
	mui.fire(main, 'gohome');
}

function toSelectCoach() {
	mui.openWindow({
		url: '../join/coachList.html',
		show: {
			autoShow: true, //页面loaded事件发生后自动显示，默认为true
			aniShow: 'pop-in', //页面显示动画，默认为”slide-in-right“；
			duration: 300 //页面动画持续时间，Android平台默认100毫秒，iOS平台默认200毫秒；
		}
	})
}

function toPreorderRecord() {
	mui.openWindow({
		url: 'preorderRecord.html?subject=subject2',
		show: {
			autoShow: true, //页面loaded事件发生后自动显示，默认为true
			aniShow: 'pop-in', //页面显示动画，默认为”slide-in-right“；
			duration: 300 //页面动画持续时间，Android平台默认100毫秒，iOS平台默认200毫秒；
		}
	})
}

function toPreorder() {
	mui.openWindow({
		url: 'preorder.html?subject=subject2',
		show: {
			autoShow: true, //页面loaded事件发生后自动显示，默认为true
			aniShow: 'pop-in', //页面显示动画，默认为”slide-in-right“；
			duration: 300 //页面动画持续时间，Android平台默认100毫秒，iOS平台默认200毫秒；
		}
	})
}

function tologin() {
	mui.openWindow({
		url: '../login/login.html',
		show: {
			autoShow: true, //页面loaded事件发生后自动显示，默认为true
			aniShow: 'pop-in', //页面显示动画，默认为”slide-in-right“；
			duration: 300 //页面动画持续时间，Android平台默认100毫秒，iOS平台默认200毫秒；
		}
	})
}

function getBookingCount() {
	if (plus.storage.getItem('userInfo')) {
		window.userInfo = JSON.parse(plus.storage.getItem('userInfo'));
		mui.ajax('http://118.89.225.203/api/booking', {
			data: {
				"action": "getbookingcount",
				"userid": window.userInfo.id,
				"course": "科目二"
			},
			dataType: 'json', //服务器返回json格式数据
			type: 'post', //HTTP请求类型
			timeout: 5000, //超时时间设置为10秒；
			success: (data) => {
				document.getElementById('bookingCount').innerHTML = `已约课时 0/0`;
				document.getElementById('bookingCount1').innerHTML = document.getElementById('bookingCount').innerHTML;
				if (data.err) {
					return;
				}
				if (data.data.success) {
					document.getElementById('bookingCount').innerHTML = `已约课时 ${data.data.hasbookingcount}/${data.data.total}`
					document.getElementById('bookingCount1').innerHTML = document.getElementById('bookingCount').innerHTML;
				}
			},
			error: (xhr, type, errorThrown) => {

			}
		})
	} else {
		document.getElementById('bookingCount').innerHTML = `已约课时 0/0`;
		document.getElementById('bookingCount1').innerHTML = document.getElementById('bookingCount').innerHTML;
	}
}
window.addEventListener('refresh', function (event) {
	getBookingCount();
});