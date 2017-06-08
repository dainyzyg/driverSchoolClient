//mui初始化
mui.init();
var laosijiURL = `browser.html?title=${encodeURIComponent('老司机')}&url=${encodeURIComponent('http://mp.weixin.qq.com/mp/homepage?__biz=MzI3NzA3NTYyNA==&hid=1')}`;
//var subpages = ['join/index.html', 'oldDriver/index.html', 'learn-driving/learn-driving.html', 'user/index.html', 'join/toJoin.html'];
var subpages = ['join/index.html', laosijiURL, 'learn-driving/learn-driving.html', 'user/index.html', 'join/toJoin.html'];

var subpage_style = {
	top: '0px',
	bottom: '51px',
	scrollsToTop: false,
	kernel: 'WKWebview',
	//bounce: 'vertical'
	//bounce: 'none'
};
var subpage_style_old = {
	top: '0px',
	bottom: '51px',
	scrollsToTop: false,
	//kernel: 'WKWebview',
	//bounce: 'vertical'
}
var aniShow = {};

//创建子页面，首个选项卡页面显示，其它均隐藏；
mui.plusReady(function () {
	plus.storage.setItem('joinState', 'coach');
	//plus.navigator.setStatusBarBackground("#ffe400");
	let statusBarHeight = Math.round(plus.navigator.getStatusbarHeight());
	console.log('statusBarHeight:' + statusBarHeight)
	if (plus.navigator.isImmersedStatusbar()) { // 兼容immersed状态栏模式
		// 获取状态栏高度并根据业务需求处理，这里重新计算了子窗口的偏移位置
		subpage_style_old.top = subpage_style.top = statusBarHeight + 'px';
	}
	let guideHidden = plus.storage.getItem('guideHidden');
	// console.log('guideHidden:' + guideHidden)
	if (guideHidden != 'true') {
		//显示启动导航
		mui.openWindow({
			id: 'guide',
			url: 'guide.html',
			show: {
				aniShow: 'none'
			},
			waiting: {
				autoShow: false
			}
		});
	}
	// setTimeout(() => {
	// 	plus.navigator.setStatusBarBackground("#ffe400");
	// }, 100);
	var self = plus.webview.currentWebview();
	for (var i = 0; i < subpages.length; i++) {
		var temp = {};
		var sub;
		if (subpages[i] == 'user/index.html') {
			sub = plus.webview.create(subpages[i], subpages[i], subpage_style_old);
		} else if (subpages[i] == laosijiURL) {
			sub = plus.webview.create(subpages[i], 'laosijiURL', subpage_style);
		} else {
			sub = plus.webview.create(subpages[i], subpages[i], subpage_style);
		}

		if (i > 0) {
			sub.hide();
		} else {
			temp[subpages[i]] = "true";
			mui.extend(aniShow, temp);
		}
		self.append(sub);
	}
});
//当前激活选项
var activeTab = subpages[0];
//var title = document.getElementById("title");
//选项卡点击事件
mui('.mui-bar-tab').on('tap', 'a', function (e) {
	var targetTab = this.getAttribute('href');
	// var joinState = plus.storage.getItem('joinState');
	// if(targetTab == 'learn-driving/learn-driving.html' && joinState != 'coach') {
	// 	targetTab = 'join/toJoin.html'
	// }
	console.log(targetTab + ' ' + activeTab);
	if (targetTab == activeTab) {
		let tabs = document.querySelectorAll('.mui-tab-item');
		for (let i = 0; i < tabs.length; i++) {
			if (tabs[i].getAttribute('href') == activeTab) {
				tabs[i].classList.add('mui-active1');
			} else {
				tabs[i].classList.remove('mui-active1');
			}
		}
		return;
	}
	let preTab = activeTab;
	activeTab = targetTab;
	//更换标题
	//title.innerHTML = this.querySelector('.mui-tab-label').innerHTML;
	//显示目标选项卡
	//否则，使用fade-in动画，且保存变量
	var temp = {};
	temp[targetTab] = "true";
	mui.extend(aniShow, temp);
	if (targetTab == 'laosijiURL') {
		var wv = plus.webview.getWebviewById('laosijiURL');
		mui.fire(wv, 'initsub');
	}
	showActiveTab(preTab);
});

function showActiveTab(preTab) {
	plus.webview.show(activeTab, "fade-in", 300, function () {
		//隐藏当前;
		if (preTab != activeTab) {
			plus.webview.hide(preTab);
		}
		let tabs = document.querySelectorAll('.mui-tab-item');
		for (let i = 0; i < tabs.length; i++) {
			if (tabs[i].getAttribute('href') == activeTab) {
				tabs[i].classList.add('mui-active1');
			} else {
				tabs[i].classList.remove('mui-active1');
			}
		}
	});
}
//自定义事件，模拟点击“首页选项卡”
document.addEventListener('gohome', function () {
	var defaultTab = document.getElementById("defaultTab");
	//模拟首页点击
	mui.trigger(defaultTab, 'tap');
	//切换选项卡高亮
	var current = document.querySelector(".mui-bar-tab>.mui-tab-item.mui-active1");
	if (defaultTab !== current) {
		current.classList.remove('mui-active1');
		defaultTab.classList.add('mui-active1');
	}
});

document.addEventListener('golearn', function () {
	var learnTab = document.getElementById("learnTab");
	//模拟首页点击
	mui.trigger(learnTab, 'tap');
	//切换选项卡高亮
	var current = document.querySelector(".mui-bar-tab>.mui-tab-item.mui-active1");
	if (learnTab !== current) {
		current.classList.remove('mui-active1');
		learnTab.classList.add('mui-active1');
	}
});