mui.init()
			document.getElementById("toJoin").addEventListener('tap', function() {
				//获得主页面的webview
				var main = plus.webview.currentWebview().parent();
				//触发主页面的gohome事件
				mui.fire(main, 'gohome');
			});