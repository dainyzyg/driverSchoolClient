let url;
if (GetQueryString('image')) {
	url = 'imageview.html?image=' + encodeURIComponent(GetQueryString('image'));
} else {
	url = GetQueryString('url');
}

mui.init();
let subpage;
mui.back = function () {
	subpage.canBack((e) => {
		console.log(e.canBack);
		if (e.canBack) {
			subpage.back();
		} else {
			plus.webview.currentWebview().close();
		}
	});
};
mui.plusReady(() => {
	var self = plus.webview.currentWebview();
	subpage = plus.webview.create(url, "subpage", {
		top: "64px",
		bottom: 0,
		left: 0,
		right: 0
	});
	self.append(subpage);
});
document.querySelector(".mui-title").innerHTML = GetQueryString('title');

function GetQueryString(name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
	var r = window.location.search.substr(1).match(reg);
	if (r != null) return decodeURIComponent(r[2]);
	return null;
}