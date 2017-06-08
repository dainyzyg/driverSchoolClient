mui.init()
mui.plusReady(function () {
	window.storage = plus.storage
	document.querySelector(".practice").addEventListener('tap', e => {
		mui.openWindow({
			url: 'exercise.html?mapping=originalMapping1.json&questionsJson=questionsJson1.json&type=1'
		})
	})
	document.querySelector(".test").addEventListener('tap', e => {
		mui.openWindow({
			url: 'exam.html?mapping=originalMapping1.json&questionsJson=questionsJson1.json&type=1'
		})
	})
	document.querySelector(".favorite").addEventListener('tap', e => {
		if (storage.getItem('favoriteList1') && JSON.parse(storage.getItem('favoriteList1')).length > 0) {
			mui.openWindow({
				url: 'exerciseCustom.html?mapping=favorite&questionsJson=questionsJson1.json&type=1'
			})
		} else {
			mui.alert('暂无收藏')
		}
	})
	document.querySelector(".wrong-questions").addEventListener('tap', e => {
		if (storage.getItem('wrongList-originalMapping1.json') && JSON.parse(storage.getItem('wrongList-originalMapping1.json')).length > 0) {
			mui.openWindow({
				url: 'exerciseCustom.html?mapping=wrong&questionsJson=questionsJson1.json&type=1'
			})
		} else {
			mui.alert('暂无错题')
		}
	})
	document.querySelector(".kaogui").addEventListener('tap', e => {
		mui.openWindow({
			url: `../webview.html?title=${encodeURIComponent('科一考规')}&image=${encodeURIComponent('../images/image-page/k1.png')}`
		});
	})
	document.querySelector(".yuyuekaoshi").addEventListener('tap', e => {
		mui.openWindow({
			url: `../webview.html?title=${encodeURIComponent('预约考试')}&url=${encodeURIComponent('http://www.122.gov.cn/m/map/select')}`
		});
	})

	document.querySelector(".special").addEventListener('tap', function () {
		mui.openWindow({
			url: 'specialSubject1.html',
			show: {
				autoShow: true, //页面loaded事件发生后自动显示，默认为true
				aniShow: 'pop-in', //页面显示动画，默认为”slide-in-right“；
				duration: 300 //页面动画持续时间，Android平台默认100毫秒，iOS平台默认200毫秒；
			}
		})
	})
})