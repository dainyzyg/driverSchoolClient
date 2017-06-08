import loading from '../../../vue/loading.vue'
mui.init()

mui.plusReady(function () {
	window.userInfo = JSON.parse(plus.storage.getItem('userInfo'));
	let params = {
		"action": "getcoach", //获取报名列表
		"classid": userInfo.classid, //班型id,不可为空
	}
	mui.ajax('http://118.89.225.203/api/selectcoach', {
		data: params,
		dataType: 'json', //服务器返回json格式数据
		type: 'post', //HTTP请求类型
		timeout: 5000, //超时时间设置为10秒；
		success: (result) => {
			if (result.err) {
				mui.toast('数据加载失败');
				return;
			}
			initVue(result.data);
			console.log(result)
		},
		error: (xhr, type, errorThrown) => {
			mui.toast('连接服务器异常');
		}
	})
})

function initVue(data) {
	window.vueComponent = new Vue({
		el: '.vue-body',
		components: {
			// <my-component> 将只在父模板可用
			loading: loading
		},
		data: {
			coachList: data,
			domain: 'http://118.89.225.203/',
			loadingShow: false
		},
		created() {

		},
		updated() {},
		methods: {
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
			selectCoach(coach) {
				var btnArray = ['确定', '取消'];
				mui.confirm(' ', `确定选择教练:${coach.coachname}?`, btnArray, (e) => {
					if (e.index == 0) {
						this.loadingShow = true;
						mui.ajax('http://118.89.225.203/api/selectcoach', {
							data: {
								action: 'selectcoach',
								userid: window.userInfo.id, //用户id,不可为空
								coachid: coach._id, //教练id，不可为空
							},
							dataType: 'json', //服务器返回json格式数据
							type: 'post', //HTTP请求类型
							timeout: 5000, //超时时间设置为10秒；
							success: (result) => {
								this.loadingShow = false;
								if (result.err) {
									mui.toast('数据加载失败');
									return;
								}
								if (result.succees) {
									window.userInfo.coachid = coach._id;
									window.userInfo.isselectcoach = true;
									plus.storage.setItem('userInfo', JSON.stringify(window.userInfo));
									mui.back();
								}
								mui.toast(result.message);
							},
							error: (xhr, type, errorThrown) => {
								mui.toast('连接服务器异常');
								this.loadingShow = false;
							}
						})
					} else {

					}
				})
			}
		},
		computed: {

		}
	})
}