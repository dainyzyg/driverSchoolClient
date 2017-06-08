import imagePage from '../../../vue/imagePage.vue';

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
mui.init();
mui.back = function () {
	if (!window.vueComponent) {
		return;
	}
	if (window.vueComponent.imagePage.show) {
		window.vueComponent.imagePage.show = false;
	} else {
		Q.QuitApp();
	}
};
// function openWindow(params) {
// 	let statusBarHeight = Math.round(plus.navigator.getStatusbarHeight());
// 	if (plus.navigator.isImmersedStatusbar()) { // 兼容immersed状态栏模式
// 		params.styles = params.styles || {};
// 		params.styles.top = statusBarHeight + 'px';
// 		params.styles.bottom = '0px';
// 	}
// 	mui.openWindow(params);
// }

let sections = [{
	name: '推荐',
	id: 'recommend',
	active: true
}, {
	name: '练车近',
	id: 'distance',
	active: false
}, {
	name: '学费低',
	id: 'price',
	active: false
}, {
	name: '评价好',
	id: 'evaluate',
	active: false
}];
let posts = {};
let loadable = {};
let isLoading = {};
for (let item of sections) {
	posts[item.id] = [];
	loadable[item.id] = true;
	isLoading[item.id] = false;
}

var filterCollapsed = true
var filterfixed = false
var loading = false

// setTimeout(function () {
// 	if (!window.vueComponent) {
// 		initVue();
// 	}
// }, 2000);
mui.plusReady(function () {
	// plus.key.addEventListener("backbutton", () => {
	// 	if (window.vueComponent) {
	// 		window.vueComponent.imagePage.show = false;
	// 	}
	// });
	initVue();
})

function initVue() {
	window.isInitVue = true;
	window.vueComponent = new Vue({
		el: '.vue-body',
		components: {
			imagePage
		},
		data: {
			params: {
				ordertype: 'recommend',
				distance: 0,
				schoolid: '',
				lat: null,
				lng: null
			},
			domain: 'http://118.89.225.203/',
			sliderGroup: [],
			activeSection: 'recommend',
			scrollYs: {},
			sections: sections,
			posts: posts,
			loadable: loadable,
			isLoading: isLoading,
			loading: false,
			scrollable: false,
			createPostingDisplay: false,
			postInfoVisible: false,
			activePostInfo: {},
			imagePage: {
				path: '',
				show: false,
				title: ''
			},
			isSliderTap: false,
			gotGeolocation: false

		},
		ready() {
			//initSomething();
		},
		mounted() {
			let guideHidden = plus.storage.getItem('guideHidden');
			if (guideHidden == 'true') {
				setTimeout(() => {
					plus.navigator.closeSplashscreen();
				}, 0);
			}
			plus.navigator.setStatusBarBackground("#ffe400");

			initSomething();
			this.getSliderGroup();
			//this.isLoading[this.activeSection] = true;
			plus.geolocation.getCurrentPosition((p) => {
				this.params.lat = p.coords.latitude;
				this.params.lng = p.coords.longitude;
				console.log('getCurrentPosition success');
				this.gotGeolocation = true;
				this.getData();
			}, function (e) {
				console.log('getCurrentPosition false');
				this.gotGeolocation = true;
				this.getData();
			}, {
				provider: 'baidu'
			});

		},
		updated() {
			this.scrollable && this.scrollYs[this.activeSection] && window.scrollTo(0, this.scrollYs[this.activeSection]);
			this.scrollable = false;
			pullRefresh();
			//new IScroll('#wrapper');
		},
		methods: {
			touchstart() {
				this.isSliderTap = true;
			},
			touchmove() {
				this.isSliderTap = false;
			},
			touchend(item) {
				if (this.isSliderTap) {
					let i = mui('#slider').slider().getSlideNumber();
					if (this.sliderGroup[i].carouselurl) {
						mui.openWindow({
							url: `../webview.html?title=${encodeURIComponent(this.sliderGroup[i].carouselname)}&url=${encodeURIComponent(this.sliderGroup[i].carouselurl)}`
						});
					}
				}
			},
			sliderTap(item) {
				console.log(item.carouselname);
				mui.openWindow({
					url: `../webview.html?title=${encodeURIComponent(item.carouselname)}&url=${encodeURIComponent(item.carouselurl)}`
				});
			},
			getSliderGroup() {
				mui.ajax('http://118.89.225.203/api/carousel', {
					data: {
						action: 'getCarousel'
					},
					dataType: 'json', //服务器返回json格式数据
					type: 'post', //HTTP请求类型
					timeout: 5000, //超时时间设置为10秒；
					success: (result) => {
						if (result.data) {
							console.log(JSON.stringify(result.data));
							this.sliderGroup = result.data;
							this.$nextTick(() => {
								var slider = mui("#slider");
								slider.slider({
									interval: 5000
								});
								// document.querySelector("#slider").addEventListener('tap', () => {
								// 	alert('q');
								// });
							});
						}
					},
					error: (xhr, type, errorThrown) => {
						mui.toast('轮播图数据加载失败！');
					}
				})
				// this.sliderGroup = [{
				// 		"_id": "58f083e8d6da454f310a97c5",
				// 		"imgurl": [
				// 			"uploads/58b628add6da454f31fd2bbb/11.jpg"
				// 		],
				// 		"carouselname": "头部图",
				// 		"isuse": "1", //是否在用，1为是，0为否
				// 		"ishasurl": "1", //是否具有连接，1为是，0为否
				// 		"carouselurl": "http://www.baidu.com"
				// 	},
				// 	{
				// 		"_id": "58f08460d6da454f310a981f",
				// 		"imgurl": [
				// 			"uploads/58b628add6da454f31fd2bbb/thumbnails.jpg"
				// 		],
				// 		"carouselname": "中间图",
				// 		"isuse": "1",
				// 		"ishasurl": "1",
				// 		"carouselurl": "http://www.163.com"
				// 	},
				// 	{
				// 		"_id": "58f084cbd6da454f310a9873",
				// 		"imgurl": [
				// 			"uploads/58b628add6da454f31fd2bbb/1.jpg"
				// 		],
				// 		"carouselname": "全图",
				// 		"isuse": "1",
				// 		"ishasurl": "0",
				// 		"carouselurl": ""
				// 	}
				// ];

			},
			getData() {
				if (!this.loadable[this.activeSection] || this.isLoading[this.activeSection] || !this.gotGeolocation) {
					return;
				}
				this.isLoading[this.activeSection] = true;
				console.log(JSON.stringify(this.params));
				mui.ajax('http://118.89.225.203/api/school', {
					data: this.params,
					dataType: 'json', //服务器返回json格式数据
					type: 'post', //HTTP请求类型
					timeout: 5000, //超时时间设置为10秒；
					success: (result) => {
						if (result.err) {}
						this.posts[this.activeSection] = this.posts[this.activeSection].concat(result.school);
						this.loadable[this.activeSection] = result.loadable;
						this.isLoading[this.activeSection] = false;
					},
					error: (xhr, type, errorThrown) => {
						mui.toast('数据加载失败');
					}
				})
			},
			toggleFilter() {
				var searchBar = document.getElementById("searchBar")
				var segmentedControl = document.getElementById("segmentedControl")
				var content = document.querySelector(".content")
				var filter = document.querySelector(".filter")
				var filterForm = document.getElementById("filterForm")
				if (filterCollapsed) {
					filterForm.style.display = 'flex'
					filter.classList.add('expand')
					var top = searchBar.getBoundingClientRect().top
					if (top > 0) {
						searchBar.style.height = document.body.clientHeight + 'px'
						content.style.transition = 'all 0.3s ease-in-out'
						content.style.transform = 'translateY(-' + top + 'px)'
					} else {
						window.location.href = '#searchBar'
						searchBar.appendChild(segmentedControl)
						searchBar.style.height = document.body.clientHeight + 'px'
					}

					filterCollapsed = false
				} else {
					filter.classList.remove('expand')
					content.style.transition = 'none'
					content.style.transform = 'translateY(0%)'
					window.location.href = '#searchBar'
					searchBar.style.height = '40px'
					filterCollapsed = true
				}
			},

			sectionTap(id) {
				if (window.inFixTop) {
					this.scrollYs[this.activeSection] = window.scrollY;
					this.scrollable = true
				} else {
					this.scrollYs[this.activeSection] = window.fullY;
				}
				this.activeSection = id;
				this.params.ordertype = id;
			},
			toSchoolDetail(id) {
				console.log(id);
				var detailPage = mui.openWindow({
					url: `schoolDetail.html?id=${id}`,
					show: {
						autoShow: true, //页面loaded事件发生后自动显示，默认为true
						aniShow: 'pop-in', //页面显示动画，默认为”slide-in-right“；
						duration: 300 //页面动画持续时间，Android平台默认100毫秒，iOS平台默认200毫秒；
					}
				})
			},
			toJoinInfo(id) {
				mui.openWindow({
					url: `joinInfo.html?id=${id}`,
					show: {
						autoShow: true, //页面loaded事件发生后自动显示，默认为true
						aniShow: 'pop-in', //页面显示动画，默认为”slide-in-right“；
						duration: 300 //页面动画持续时间，Android平台默认100毫秒，iOS平台默认200毫秒；
					}
				})
			},
			weizhangchaxun() {
				mui.openWindow({
					url: '../webview.html',
					show: {
						autoShow: true, //页面loaded事件发生后自动显示，默认为true
						aniShow: 'pop-in', //页面显示动画，默认为”slide-in-right“；
						duration: 300 //页面动画持续时间，Android平台默认100毫秒，iOS平台默认200毫秒；
					}
				});
			},
			learnFlow() {
				this.imagePage.title = "学车流程";
				this.imagePage.show = true;
				this.imagePage.path = '../../images/image-page/learn-flow.jpg';
			},
			lilunxuexi() {
				// this.imagePage.title = "理论学习";
				// this.imagePage.show = true;
				// this.imagePage.path = '../../images/guild/kp1.png';

				//获得主页面的webview
				var main = plus.webview.currentWebview().parent();
				//触发主页面的gohome事件
				mui.fire(main, 'golearn');
			},
			kaoshixuzhi() {
				this.imagePage.title = "考试须知";
				this.imagePage.show = true;
				this.imagePage.path = '../../images/image-page/baomingxuzhi.png';
			},
			fuwuchengnuo() {
				this.imagePage.title = "承诺服务";
				this.imagePage.show = true;
				this.imagePage.path = '../../images/image-page/pingtaibaozhang.png';
			}
		},
		computed: {
			activePosts: function () {
				return this.posts[this.activeSection];
			}
		},
		watch: {
			activePosts(data) {
				let len = data.length;
				if (len > 0) {
					let lastItem = data[len - 1]
					this.params.schoolid = lastItem._id;
					this.params.distance = lastItem.dis || 0;
				} else {
					this.params.schoolid = '';
					this.params.distance = 0;
				}
			}
		}
	})
}

function initSomething() {
	// var slider = mui(".mui-slider");
	// slider.slider({
	// 	interval: 5000
	// });
	window.addEventListener("touchmove", touchmove, true);
	window.addEventListener("scroll", scroll, true);
}

function touchmove(event) {
	if (!filterCollapsed) {
		event.preventDefault()
	}
}

function scroll(event) {
	if (filterCollapsed) {
		var searchBar = document.getElementById("searchBar");
		var segmentedControl = document.getElementById('segmentedControl');
		var fixTop = document.getElementById('fixTop');
		var filterForm = document.getElementById("filterForm");
		filterForm.style.display = 'none';
		var top = searchBar.getBoundingClientRect().top;
		window.fullY = top + window.scrollY;
		if (top <= 0) {
			fixTop.appendChild(segmentedControl);
			window.inFixTop = true;
		} else {
			searchBar.appendChild(segmentedControl);
			window.inFixTop = false;
		}
		pullRefresh();
	} else {
		event.preventDefault()
	}
}

function pullRefresh() {
	var pullRefresh = document.querySelector(".pull-refresh")
	var willRefresh = pullRefresh.getBoundingClientRect().top < document.body.clientHeight
	if (willRefresh) {
		vueComponent && vueComponent.getData();
	}
}