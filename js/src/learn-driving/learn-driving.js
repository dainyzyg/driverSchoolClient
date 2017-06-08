mui.init({
	swipeBack: true //启用右滑关闭功能
});
var aniShow = {};
var subpages = ['subject1.html', 'subject2.html', 'subject3.html', 'subject4.html', 'getlicense.html'];
var activeTab = subpages[0];
mui.plusReady(function () {
	console.log('learnplusready')
	var subpage_style = {
		top: '38px',
		bottom: '0px',
		// kernel: 'WKWebview'
	};
	addlistener()
	var self = plus.webview.currentWebview();
	for (var i = 0; i < subpages.length; i++) {
		var temp = {};
		var sub = plus.webview.create(subpages[i], subpages[i], subpage_style);
		if (i > 0) {
			sub.hide();
		} else {
			temp[subpages[i]] = "true";
			mui.extend(aniShow, temp);
		}
		self.append(sub);
	}
});

function addlistener() {
	mui('.mui-segmented-control').on('tap', 'a', function (e) {
		var targetTab = this.getAttribute('href')
		if (targetTab == activeTab) {
			return;
		}
		plus.webview.show(targetTab, "slide-in-right", 200, () => {
			//隐藏当前;
			plus.webview.hide(activeTab);
			//更改当前活跃的选项卡
			activeTab = targetTab;
		});
		return
	});
}