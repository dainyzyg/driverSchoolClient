import rateCoach from '../../../vue/rateCoach.vue'
mui.init()

mui.plusReady(() => {
    window.userInfo = JSON.parse(plus.storage.getItem('userInfo'));
    initVue();
});
let list = [{
    status: '未学完',
    date: '2016-12-31',
    week: '星期五',
    subject: '科目二',
    time: '8:00-10:00',
    price: '600',
    checked: false
}, {
    status: '已学完',
    date: '2016-12-31',
    week: '星期五',
    subject: '科目二',
    time: '10:00-12:00',
    isRate: false,
    price: '600',
    checked: true
}, {
    status: '已学完',
    date: '2016-12-31',
    week: '星期五',
    subject: '科目二',
    time: '10:00-12:00',
    isRate: true
}, {
    status: '已取消',
    date: '2016-12-31',
    week: '星期五',
    subject: '科目二',
    time: '2:00-4:00'
}]
for (let item of list) {
    item.checked = false;
}
//initVue();

function initVue() {
    window.vueComponent = new Vue({
        el: '.vue-body',
        components: {
            rateCoach
        },
        data: {
            domain: 'http://118.89.225.203/',
            preorderList: [],
            loading: true,
            showRate: false,
            selectAll: false,
            loadingShow: false,
            alipay: null,
            params: JSON.parse(decodeURIComponent(GetQueryString('params'))),
            rateInfo: {}
        },
        mounted() {
            let that = this;
            plus.payment.getChannels(function (channels) {
                for (let item of channels) {
                    if (item.id == 'alipay') {
                        that.alipay = item;
                        console.log('alipay');
                        break;
                    }
                }
            }, function (e) {
                alert("获取支付通道失败：" + e.message);
            });
            this.getRecord();
        },
        created() {

        },
        updated() {

        },
        methods: {
            getStatus(item) {
                let result;
                if (item.iscomplete) {
                    result = '已学完';
                } else {
                    if (!item.isconfirm) {
                        result = '已取消';
                    } else {
                        if (!item.isneedpay) {
                            result = '未学完';
                        } else {
                            if (item.ishaspay) {
                                result = '未学完';
                            } else {
                                result = '待付款';
                            }
                        }
                    }
                }
                return result;
            },
            formatData(ds) {
                var weekArray = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];
                let date = new Date(ds);
                return {
                    week: weekArray[date.getDay()],
                    date: `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`,
                };
            },
            toggleSelectAll() {
                this.selectAll = !this.selectAll;
                for (let item of this.preorderList) {
                    if (this.getStatus(item) == '待付款') {
                        item.checked = this.selectAll;
                    }
                }
            },
            back() {
                mui.back();
            },
            pay() {
                let that = this;
                if (!that.loadingShow) {
                    that.loadingShow = true;
                    let bookingid = [];
                    for (let item of this.preorderList) {
                        if (that.getStatus(item) == '待付款' && item.checked) {
                            bookingid.push(item._id);
                        }
                    }
                    mui.ajax('http://118.89.225.203/api/bookingpay', {
                        data: {
                            action: 'payforlist', //获取用户信息方法
                            bookingid: JSON.stringify(bookingid),
                            paytype: "alipay"
                        },
                        dataType: 'json', //服务器返回json格式数据
                        type: 'post', //HTTP请求类型
                        timeout: 5000, //超时时间设置为10秒；
                        success: (result) => {
                            that.loadingShow = false;
                            if (result.success) {
                                plus.payment.request(that.alipay, result.aplipayurl, function (result) {
                                    plus.nativeUI.alert("支付成功！", function () {
                                        that.selectAll = false;
                                        that.getRecord();
                                    });
                                }, function (error) {
                                    plus.nativeUI.alert("支付失败：" + error.code);
                                });
                            } else {
                                mui.toast(result.message);
                            }
                        },
                        error: (xhr, type, errorThrown) => {
                            this.loading = false;
                            //异常处理；
                            mui.toast('连接服务器异常！');
                        }
                    });
                }
            },
            rate(item) {
                this.rateInfo = item;
                this.showRate = true;
            },
            rateSuccess() {
                console.log('rateSuccess')
                this.getRecord();
                this.showRate = false;
            },
            getRecord() {
                mui.ajax('http://118.89.225.203/api/booking', {
                    data: {
                        "action": "getbookingrecord",
                        "userid": window.userInfo.id,
                        "course": getCourse()
                    },
                    dataType: 'json', //服务器返回json格式数据
                    type: 'post', //HTTP请求类型
                    timeout: 5000, //超时时间设置为10秒；
                    success: (result) => {
                        console.log(JSON.stringify(result));
                        if (result.success) {
                            for (let item of result.recordlist) {
                                item.checked = false;
                            }
                            this.preorderList = result.recordlist;

                        } else {
                            mui.toast('数据加载失败');
                        }
                        this.loading = false;
                    },
                    error: (xhr, type, errorThrown) => {
                        mui.toast('连接服务器异常');
                    }
                });
            }
        },
        computed: {
            btnName() {
                if (this.loadingShow) {
                    return '付款中';
                } else {
                    return '去付款';
                }
            },
            priceTotal() {
                let result = 0;
                for (let item of this.preorderList) {
                    if (this.getStatus(item) == '待付款' && item.checked) {
                        result += parseFloat(item.price);
                    }
                }
                return result;
            },
            count() {
                let result = 0;
                for (let item of this.preorderList) {
                    if (this.getStatus(item) == '待付款' && item.checked) {
                        result++;
                    }
                }
                return result;
            }
        }
    });
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