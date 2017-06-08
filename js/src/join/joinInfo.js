import myCoupon from '../../../vue/myCoupon.vue'

mui.init();
let domain = 'http://118.89.225.203/';

mui.plusReady(() => {
	getData();
});

function getData() {
	mui.ajax(`${domain}api/enroll`, {
		data: {
			action: 'classdetail',
			classid: GetQueryString('id')
		},
		dataType: 'json', //服务器返回json格式数据
		type: 'post', //HTTP请求类型
		timeout: 5000, //超时时间设置为10秒；
		success: (result) => {
			if (result.err) {
				mui.toast('数据加载失败');
				return;
			}
			let userInfo = plus.storage.getItem('userInfo');
			if (userInfo) {
				userInfo = JSON.parse(userInfo);
			}
			initVue(result.classdetail, userInfo)
		},
		error: (xhr, type, errorThrown) => {
			//异常处理；
			mui.toast('数据加载失败');
		}
	})
}

function initVue(classdetail, userInfo) {
	window.vueComponent = new Vue({
		el: '.vue-body',
		components: {
			myCoupon
		},
		data: {
			domain,
			classdetail: classdetail,
			detailShow: true,
			coupondes: '',
			showMyCoupon: false,
			userInfo: userInfo,
			couponVal: 0,
			couponItem: null,
			params: {
				action: "enroll", //提交报名信息
				userid: '', //用户id
				classid: classdetail._id, //班型id
				paymenttype: 'instalment', //付费方式
				username: '', //用户名称
				userphone: '', //联系方式
				useridentitycard: '', //身份证号
				firstpayment: classdetail.firstpayment,
				invitecode: '',
				payment: classdetail.firstpayment
			}
		},
		mounted() {
			this.getInvitecodeList();
			this.$nextTick(() => {
				new IScroll('.content');
			})
			// mui('.mui-scroll-wrapper').scroll({
			// 	deceleration: 0.0005 //flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006
			// });
		},
		created() {

		},
		updated() {

		},
		methods: {
			changeCoupon(item) {
				console.log('changeCoupon')
				this.couponItem = item;
				this.coupondes = `-¥${item.discount}`;
			},
			getInvitecodeList() {
				if (!this.userInfo) {
					return;
				}
				mui.ajax(`http://118.89.225.203/api/userinvitecode`, {
					data: {
						"action": "getlist",
						"userid": this.userInfo.id
					},
					dataType: 'json', //服务器返回json格式数据
					type: 'post', //HTTP请求类型
					timeout: 5000, //超时时间设置为10秒；
					success: (result) => {
						if (result.userinvite) {
							this.coupondes = '请选择优惠券';
						} else {
							this.coupondes = '暂无优惠券';
						}

					},
					error: (xhr, type, errorThrown) => {
						//异常处理；
						mui.toast('数据加载失败');
					}
				});
			},
			selectCoupon() {
				let userInfo = plus.storage.getItem('userInfo');
				if (userInfo) {
					userInfo = JSON.parse(userInfo);
					this.userInfo = userInfo;
				}
				if (!userInfo) {
					var btnArray = ['现在就去', '再看看'];
					mui.confirm(' ', '请先登录或注册', btnArray, (e) => {
						if (e.index == 0) {
							this.tologin();
						}
					});
				} else {
					this.showMyCoupon = true;
				}
			},
			setDetailShow() {
				this.detailShow = !this.detailShow;
				this.$nextTick(() => {
					new IScroll('.content');
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
			join() {
				if (!this.params.username) {
					mui.alert("请填写学员姓名！");
					return;
				}
				this.params.invitecode = "";
				if (this.couponItem) {
					this.params.invitecode = this.couponItem.invitecode;
					this.params.payment = this.params.firstpayment - this.couponItem.discount;
				}
				let params = encodeURIComponent(JSON.stringify(this.params))
				console.log(JSON.stringify(this.params));
				console.log(params);
				console.log(decodeURIComponent(params));
				mui.openWindow({
					url: `pay.html?params=${params}`,
					show: {
						autoShow: true, //页面loaded事件发生后自动显示，默认为true
						aniShow: 'pop-in', //页面显示动画，默认为”slide-in-right“；
						duration: 300 //页面动画持续时间，Android平台默认100毫秒，iOS平台默认200毫秒；
					}
				});
			},
			confirm() {
				let userInfo = plus.storage.getItem('userInfo');
				if (userInfo) {
					this.params.userid = (JSON.parse(userInfo)).id;
				}
				if (this.params.userid) {
					this.join();
				} else {
					var btnArray = ['现在就去', '再看看'];
					mui.confirm(' ', '请先登录或注册', btnArray, (e) => {
						if (e.index == 0) {
							this.tologin();
						} else {

						}
					})
				}
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