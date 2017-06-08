import loading from '../../../vue/loading.vue';
mui.plusReady(() => {
    // 获取支付通道
    plus.payment.getChannels(function (channels) {
        for (let item of channels) {
            if (item.id == 'alipay') {
                window.alipay = item;
                break;
            }
        }
    }, function (e) {
        alert("获取支付通道失败：" + e.message);
    });
    let userInfo = null;
    if (plus.storage.getItem('userInfo')) {
        userInfo = JSON.parse(plus.storage.getItem('userInfo'));
    }
    initVue(userInfo);
});
if (!mui.os.plus) {
    initVue({
        id: '58b97c93d6da454f31fe0e44'
    });
}

function initVue(userInfo) {
    window.vueComponent = new Vue({
        el: '.vue-body',
        components: {
            // <my-component> 将只在父模板可用
            loading: loading
        },
        data: {
            userInfo: userInfo,
            tradeInfo: {},
            loadingShow: false
        },
        created() {
            if (userInfo) {
                mui.ajax('http://118.89.225.203/api/trade', {
                    data: {
                        action: 'gettradeorder',
                        userid: this.userInfo.id
                    },
                    dataType: 'json', //服务器返回json格式数据
                    type: 'post', //HTTP请求类型
                    timeout: 5000, //超时时间设置为10秒；
                    success: (result) => {
                        console.log('created')
                        console.log(JSON.stringify(result));
                        this.tradeInfo = result.tradelist.pop();
                    },
                    error: (xhr, type, errorThrown) => {
                        console.log('created err')
                        console.log(xhr)
                    }
                });
            }
        },
        updated() {

        },
        mounted() {

        },
        methods: {
            cancelOrder() {
                var btnArray = ['是', '否'];
                mui.confirm(' ', '确定取消订单？', btnArray, (e) => {
                    if (e.index == 0) {
                        this.loadingShow = true;
                        mui.ajax('http://118.89.225.203/api/trade', {
                            data: {
                                action: 'tradecancel',
                                tradeorderid: this.tradeInfo.orderid
                            },
                            dataType: 'json', //服务器返回json格式数据
                            type: 'post', //HTTP请求类型
                            timeout: 5000, //超时时间设置为10秒；
                            success: (result) => {
                                console.log(JSON.stringify(result))
                                if (result.returnobj.succees) {
                                    mui.toast(result.returnobj.message);
                                    mui.back();
                                } else {
                                    this.loadingShow = false;
                                    mui.toast(result.returnobj.message);
                                }
                            },
                            error: (xhr, type, errorThrown) => {
                                console.log('err')
                                mui.toast('数据请求失败！');
                                this.loadingShow = false;
                            }
                        });
                    }
                });
            },
            pay() {
                this.loadingShow = true;
                console.log(this.tradeInfo.orderid);
                mui.ajax(`http://118.89.225.203/api/trade`, {
                    data: {
                        "action": "payfortrade", //提交付款申请
                        "tradeorderid": this.tradeInfo.orderid, //订单id，即为获得订单列表中的orderid
                    },
                    dataType: 'json', //服务器返回json格式数据
                    type: 'post', //HTTP请求类型
                    timeout: 5000, //超时时间设置为10秒；
                    success: (result) => {
                        this.loadingShow = false;
                        if (result.err) {
                            mui.toast('数据提交失败');
                            return;
                        }
                        if (result.success) {
                            console.log(result.aplipayurl);
                            plus.payment.request(window.alipay, result.aplipayurl, (result) => {
                                plus.nativeUI.alert("支付成功！", function () {
                                    let userInfo = JSON.parse(plus.storage.getItem('userInfo'));
                                    userInfo.isenroll = true;
                                    plus.storage.setItem('userInfo', JSON.stringify(userInfo));
                                    this.tradeInfo.tradestatus = 'finish';
                                    mui.toast('支付成功！');
                                });
                            }, (error) => {
                                plus.nativeUI.alert("支付失败：" + error.code);
                            });
                        } else {
                            mui.toast(result.message);
                        }
                    },
                    error: (xhr, type, errorThrown) => {
                        //异常处理；
                        mui.toast('数据提交失败');
                        this.loadingShow = false;
                    }
                })
            }
        },
        computed: {

        }
    })
}