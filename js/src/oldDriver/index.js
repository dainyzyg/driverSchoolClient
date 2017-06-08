mui.init();

let sections = [{
	name: '司机头条',
	id: 'sijitoutiao',
	active: true
}, {
	name: '污污污',
	id: 'wuwuwu',
	active: false
}, {
	name: '段子手',
	id: 'duanzishou',
	active: false
}, {
	name: '学车趣闻',
	id: 'xuechequwen',
	active: false
}, {
	name: '老司机',
	id: 'laosiji',
	active: false
}, {
	name: '考前许愿',
	id: 'kaoqianxuyuan',
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
initVue();

function initVue() {
	window.vueComponent = new Vue({
		el: '.vue-body',
		data: {
			activeSection: 'sijitoutiao',
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
			commentBoxShow: false,
			domain: 'http://118.89.225.203/',
			commentLoadable: true,
			commentLoading: false,
			commentList: [],
			commentStr: ''
		},
		created() {
			this.getData();
		},
		updated() {
			//console.log('update', this.scrollYs[this.activeSection], this.activeSection)
			this.scrollable && this.scrollYs[this.activeSection] && window.scrollTo(0, this.scrollYs[this.activeSection]);
			this.scrollable = false;
			pullRefresh();
		},
		methods: {
			getData() {
				this.isLoading[this.activeSection] = true;
				let len = this.posts[this.activeSection].length;
				mui.ajax('http://118.89.225.203/api/getforum', {
					data: {
						action: "getlist",
						sectionid: this.activeSection,
						lastforumid: len ? this.posts[this.activeSection][len - 1]._id : ''
					},
					dataType: 'json', //服务器返回json格式数据
					type: 'post', //HTTP请求类型
					timeout: 5000, //超时时间设置为10秒；
					success: (result) => {
						if (result.err) {
							mui.toast('数据加载失败');
							return;
						}
						this.posts[this.activeSection] = this.posts[this.activeSection].concat(result.data);
						this.loadable[this.activeSection] = result.loadable;
						this.isLoading[this.activeSection] = false;
					},
					error: (xhr, type, errorThrown) => {
						mui.toast('连接服务器异常');
					}
				})
			},
			refreshData(sectionID) {
				this.posts[sectionID] = [];
				this.loadable[sectionID] = true;
				this.isLoading[sectionID] = false;
			},
			loadingData() {
				if (!this.loadable[this.activeSection] || this.isLoading[this.activeSection]) {
					return;
				}
				this.getData();
			},
			loadingComment() {
				if (!this.commentLoadable || this.commentLoading) {
					return;
				}
				this.getComment();
			},
			getComment() {
				this.commentLoading = true;
				let len = this.commentList.length;
				let lastcommentid = len ? this.commentList[len - 1]._id : '';
				mui.ajax('http://118.89.225.203/api/comment', {
					data: {
						"action": "getlist",
						forumid: this.activePostInfo._id, //帖子id
						lastcommentid: lastcommentid //上次获取的最后一个评论id
					},
					dataType: 'json', //服务器返回json格式数据
					type: 'post', //HTTP请求类型
					timeout: 5000, //超时时间设置为10秒；
					success: (result) => {
						if (result.err) {
							mui.toast('数据加载失败');
							return;
						}
						this.commentList = this.commentList.concat(result.data);
						this.commentLoadable = result.loadable;
						this.commentLoading = false;
						this.$nextTick(() => {
							window.wrapperScroll.refresh();
							commentRefresh();
						});
					},
					error: (xhr, type, errorThrown) => {
						mui.toast('连接服务器异常');
					}
				})
			},
			sectionTap(id) {
				if (window.inFixTop) {
					this.scrollYs[this.activeSection] = window.scrollY;
					this.scrollable = true
				} else {
					this.scrollYs[this.activeSection] = window.fullY;
				}
				console.log(this.activeSection, this.scrollYs[this.activeSection], this.scrollable)
				this.activeSection = id;
			},
			cancelPosting() {
				this.createPostingDisplay = false;
				document.querySelector('.new-posting-textarea').blur();
			},
			posting() {
				//document.querySelector('.new-posting-textarea').blur();
				document.querySelector('.new-posting-textarea').style.backgroundColor = 'yellow';
				document.querySelector('.new-posting-textarea').focus();
				// this.$nextTick(() => {
				// 	document.querySelector('.new-posting-textarea').focus();
				// })
				console.log('posting')
			},
			createPosting() {
				//this.createPostingDisplay = true;
				let userInfo = plus.storage.getItem('userInfo') && JSON.parse(plus.storage.getItem('userInfo'));
				if (!userInfo) {
					var btnArray = ['现在就去', '再看看'];
					mui.confirm(' ', '请先登录或注册', btnArray, (e) => {
						if (e.index == 0) {
							this.tologin();
						}
					})
				} else {
					mui.openWindow({
						url: 'newPosting.html',
						show: {
							autoShow: true, //页面loaded事件发生后自动显示，默认为true
							aniShow: 'pop-in', //页面显示动画，默认为”slide-in-right“；
							duration: 300 //页面动画持续时间，Android平台默认100毫秒，iOS平台默认200毫秒；
						}
					});
				}

			},
			tologin() {
				mui.openWindow({
					url: '../login/login.html',
					show: {
						autoShow: true, //页面loaded事件发生后自动显示，默认为true
						aniShow: 'pop-in', //页面显示动画，默认为”slide-in-right“；
						duration: 300 //页面动画持续时间，Android平台默认100毫秒，iOS平台默认200毫秒；
					}
				})
			},
			changeTextareaHeight() {
				let ta = document.querySelector('.new-posting-textarea');
				ta.style.height = ta.scrollHeight + 'px'
			},
			afterEnter() {
				//new IScroll('#wrapper');
				document.querySelector('.new-posting-textarea').focus();
			},
			showPostInfo(post) {
				this.activePostInfo = post;
				this.postInfoVisible = true;
				this.$nextTick(() => {
					window.wrapperScroll = new IScroll('#wrapper');
					window.wrapperScroll.on('scrollEnd', commentRefresh);
					commentRefresh();
				})
			},
			like(post) {
				console.log('like');
			},
			comment() {
				window.userInfo = plus.storage.getItem('userInfo') && JSON.parse(plus.storage.getItem('userInfo'));
				if (!userInfo) {
					var btnArray = ['现在就去', '再看看'];
					mui.confirm(' ', '请先登录或注册', btnArray, (e) => {
						if (e.index == 0) {
							this.tologin();
						}
					})
				} else {
					this.commentBoxShow = true;
					this.commentStr = '';
					this.$refs.commentTxt.focus();
					this.$nextTick(() => {
						this.$refs.commentTxt.focus();
					});
				}
			},
			postComment() {
				console.log(window.userInfo.id);
				mui.ajax('http://118.89.225.203/api/comment', {
					data: {
						"action": "comment",
						forumid: this.activePostInfo._id, //帖子id
						userid: window.userInfo.id, //评论人id
						content: this.commentStr, //评论内容
					},
					dataType: 'json', //服务器返回json格式数据
					type: 'post', //HTTP请求类型
					timeout: 5000, //超时时间设置为10秒；
					success: (result) => {
						if (result.err) {
							mui.toast('数据加载失败');
							return;
						}
						if (result.success) {
							mui.toast('发表评论成功！');
							this.commentBoxShow = false;
							this.commentList = [];
							this.commentLoadable = true;
							this.commentLoading = false;
							this.$nextTick(() => {
								this.$refs.commentTxt.blur();
								commentRefresh();
							});
						} else {
							mui.toast(result.message);
						}
					},
					error: (xhr, type, errorThrown) => {
						mui.toast('连接服务器异常');
					}
				})
			}
		},
		computed: {
			activePosts: function () {
				return this.posts[this.activeSection];
			}
		},
		watch: {
			postInfoVisible(val) {
				this.commentList = [];
				this.commentLoadable = true;
				this.commentLoading = false;
			}
		}
	})
}

var slider = mui("#slider");

slider.slider({
	interval: 5000
});

window.addEventListener("scroll", scroll, true);
document.querySelector('#wrapper').addEventListener('touchmove', (e) => {
	e.preventDefault();
	commentRefresh();
})

function commentRefresh() {
	var pullRefresh = document.querySelector(".comment-refresh");
	var willRefresh = pullRefresh.getBoundingClientRect().top < document.body.clientHeight
	if (willRefresh && vueComponent.postInfoVisible) {
		//console.log(pullRefresh.getBoundingClientRect().top, document.body.clientHeight)
		vueComponent && vueComponent.loadingComment();
	}
}

function scroll(event) {
	var searchBar = document.getElementById("searchBar");
	var segmentedControl = document.getElementById('segmentedControl');
	var fixTop = document.getElementById('fixTop');
	var top = searchBar.getBoundingClientRect().top;
	window.fullY = top + window.scrollY
		//console.log(top, window.scrollY, top + window.scrollY)
	if (top <= 0) {
		fixTop.appendChild(segmentedControl);
		window.inFixTop = true;
	} else {
		searchBar.appendChild(segmentedControl);
		window.inFixTop = false;
	}
	//console.log('scroll', document.querySelector('body').scrollTop)
	pullRefresh();
	//判断上拉加载
	// var pullRefresh = document.querySelector(".pull-refresh")
	// var willRefresh = pullRefresh.getBoundingClientRect().top < document.body.clientHeight
	// if (willRefresh) {
	// 	//loadData()
	// }

}

function pullRefresh() {
	var pullRefresh = document.querySelector(".pull-refresh")
	var willRefresh = pullRefresh.getBoundingClientRect().top < document.body.clientHeight
	if (willRefresh) {
		//console.log(pullRefresh.getBoundingClientRect().top, document.body.clientHeight)
		vueComponent && vueComponent.loadingData();
	}
}

window.addEventListener('refresh', function (event) {
	console.log(event.detail);
	window.vueComponent.refreshData(event.detail);
});