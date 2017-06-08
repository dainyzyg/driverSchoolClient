mui.init()
let domain = 'http://118.89.225.203/';
mui.ajax(`${domain}api/school`, {
	data: {
		ordertype: 'detail',
		schoolid: GetQueryString('id')
	},
	dataType: 'json', //服务器返回json格式数据
	type: 'post', //HTTP请求类型
	timeout: 10000, //超时时间设置为10秒；
	success: (result) => {
		if (result.err) {
			mui.toast('数据加载失败');
			return;
		}
		console.log(result)
		initVue(result.school)
	},
	error: (xhr, type, errorThrown) => {
		//异常处理；
		mui.toast('数据加载失败');
	}
})

function initVue(schoolInfo) {
	window.vueComponent = new Vue({
		el: '.vue-body',
		data: {
			domain,
			schoolInfo: schoolInfo,
			showSchoolInfo: false
		},
		mounted() {
			mui('.mui-scroll-wrapper').scroll({
				deceleration: 0.0005 //flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006
			});
		},
		created() {

		},
		updated() {

		},
		methods: {
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
			showInfo() {
				console.log('showInfo');
			}
		},
		computed: {

		}
	})
}




function GetQueryString(name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
	var r = window.location.search.substr(1).match(reg);
	if (r != null) return unescape(r[2]);
	return null;
}