import slider from '../../../vue/slider.vue'
import preorderRecord from '../../../vue/preorderRecord.vue'
mui.init();

mui.plusReady(() => {
	console.log(getCourse());
	window.userInfo = JSON.parse(plus.storage.getItem('userInfo'));
	mui.ajax('http://118.89.225.203/api/booking', {
		data: {
			"action": "getbookinglist", //获取报名列表
			"userid": window.userInfo.id, //用户id,不可为空
			"course": getCourse()
			// "userid": plus.storage.getItem('userid')
		},
		dataType: 'json', //服务器返回json格式数据
		type: 'post', //HTTP请求类型
		timeout: 5000, //超时时间设置为10秒；
		success: (result) => {
			if (result.err) {
				mui.toast('数据加载失败');
				mui.back();
				return;
			}
			console.log(JSON.stringify(result.data));
			initVue({
				coachInfo: result.coachInfo,
				lessonsList: result.data,
				dataNow: result.data[0].date
			})
		},
		error: (xhr, type, errorThrown) => {
			mui.toast('连接服务器异常');
			mui.back();
		}
	})
});

function initVue(params) {
	let dateArray = getDatelist(params.dataNow);
	// let sliderSegmentedControl = new Vue({
	// 	el: '#sliderSegmentedControl',
	// 	data: {
	// 		dateArray: dateArray,
	// 		loading: true,
	// 		activeTab: 0
	// 	},
	// 	methods: {
	// 		tabTap(item, index) {
	// 			sliderContent.pageIndex = index;
	// 		},
	// 		setActiveTab(index) {
	// 			this.dateArray[this.activeTab].isActive = false;
	// 			this.dateArray[index].isActive = true;
	// 			this.activeTab = index;
	// 		}
	// 	}
	// })
	let lessonsList = params.lessonsList;

	let sliderContent = new Vue({
		el: '.vue-body',
		components: {
			// <my-component> 将只在父模板可用
			slider: slider,
			preorderRecord: preorderRecord
		},
		data: {
			domain: 'http://118.89.225.203/',
			coachInfo: params.coachInfo,
			dateArray: dateArray,
			loading: true,
			activeTab: 0,
			pageIndex: 0,
			count: dateArray.length,
			lessonsList: lessonsList,
			selectedCount: 0,
			recordShow: false,
			bookinginfo: []
		},
		computed: {
			// a computed getter
			price() {
				// `this` points to the vm instance
				return this.selectedCount * 200;
			},
			lessonsListExt() {
				let lessonsListExt = [];
				for (let item of this.lessonsList) {
					let dateA = item.date.split('/');
					let preorderInfo = {
						count: 0,
						dateStr: `${dateA[1]}月${dateA[2]}日`
					};
					let enableCount = 2;
					for (let lesson of item.lessons) {
						if ((lesson.state == 'hasbooking' || lesson.selected) && enableCount > 0) {
							enableCount--;
						}
						if (lesson.state == 'enabled' && !lesson.selected) {
							preorderInfo.count++;
						}
					}
					preorderInfo.count = (enableCount <= preorderInfo.count) ? enableCount : preorderInfo.count;
					lessonsListExt.push(preorderInfo)
				}
				return lessonsListExt;
			}
		},
		methods: {
			back() {
				mui.back();
			},
			refresh() {
				let subject2 = plus.webview.getWebviewById('subject2.html');
				mui.fire(subject2, 'refresh');
				mui.ajax('http://118.89.225.203/api/booking', {
					data: {
						"action": "getbookinglist", //获取报名列表
						"userid": window.userInfo.id, //用户id,不可为空
						"course": getCourse()
					},
					dataType: 'json', //服务器返回json格式数据
					type: 'post', //HTTP请求类型
					timeout: 5000, //超时时间设置为10秒；
					success: (result) => {
						if (result.err) {
							mui.toast('数据加载失败');
							return;
						}
						this.lessonsList = result.data;
						this.dataNow = result.data[0].date;
					},
					error: (xhr, type, errorThrown) => {
						mui.toast('连接服务器异常');
					}
				})
			},
			confirm() {
				let orderList = [];
				for (let item of this.lessonsList) {
					for (let lesson of item.lessons) {
						if (lesson.selected) {
							orderList.push({
								date: item.date,
								classperiod: lesson.classperiod,
								time: lesson.time
							});
						}
					}
				}
				this.recordShow = true;
				mui.ajax('http://118.89.225.203/api/booking', {
					data: {
						action: 'booking',
						orderList: JSON.stringify(orderList),
						userid: window.userInfo.id,
						course: getCourse()
					},
					dataType: 'json', //服务器返回json格式数据
					type: 'post', //HTTP请求类型
					timeout: 5000, //超时时间设置为10秒；
					success: (result) => {
						if (result.err) {
							mui.toast('数据加载失败');
							return;
						}
						if (!result.success) {
							this.recordShow = false;
							mui.toast(result.message);
							return
						} else {
							for (let item of result.bookinginfo) {
								item.checked = false;
							}
							this.bookinginfo = result.bookinginfo
						}
						this.refresh();
					},
					error: (xhr, type, errorThrown) => {
						mui.toast('连接服务器异常');
					}
				})
			},
			tabTap(item, index) {
				sliderContent.pageIndex = index;
			},
			setActiveTab(index) {
				this.dateArray[this.activeTab].isActive = false;
				this.dateArray[index].isActive = true;
				this.activeTab = index;
			},
			pageChange(index) {
				this.setActiveTab(index);
			},
			selectItem(item, lessonsListExtItem) {
				if (lessonsListExtItem.count <= 0 && !item.selected) {
					return;
				}
				if (item.state == 'enabled') {
					item.selected = !item.selected;
					item.selected && this.selectedCount++;
					!item.selected && this.selectedCount--;
				}
			}
		}
		//render: h => h(App)
	})
}

function getDatelist(dataNow) {
	var weekArray = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];
	let date = new Date(dataNow);
	let dateArray = [];
	for (let i = 0; i < 6; i++) {
		dateArray.push({
			day: weekArray[date.getDay()],
			mmdd: `${date.getMonth()+1}-${date.getDate()}`,
			date: `${date.getFullYear()}/${date.getMonth()+1}/${date.getDate()}`,
			isActive: i == 0 ? true : false
		});
		date.setDate(date.getDate() + 1);
	}
	return dateArray;
}

function getCourse() {
	let course = ''
	switch (GetQueryString('subject')) {
		case 'subject2':
			course = '科目二';
			break;
		case 'subject3':
			course = '科目三';
			break;
		default:
			break;
	}
	return course;
}

function GetQueryString(name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
	var r = window.location.search.substr(1).match(reg);
	if (r != null) return unescape(r[2]);
	return null;
}