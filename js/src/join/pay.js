mui.init()

mui.plusReady(() => {
    // 获取支付通道
    plus.payment.getChannels(function (channels) {
        for (let item of channels) {
            window[item.id] = item;
        }
    }, function (e) {
        alert("获取支付通道失败：" + e.message);
    });
    initVue();
    console.log(window.location);
    console.log(GetQueryString('params'));
});

function initVue() {
    window.vueComponent = new Vue({
        el: '.vue-body',
        data: {
            domain: 'http://118.89.225.203/',
            params: JSON.parse(GetQueryString('params')),
            payType: 'alipay'
        },
        mounted() {
            //alert(JSON.stringify(this.params))
        },
        created() {

        },
        updated() {

        },
        methods: {
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
            alipay() {
                this.params.paytype = "alipay";
                let that = this;
                mui.ajax(`${this.domain}api/enroll`, {
                    data: this.params,
                    dataType: 'json', //服务器返回json格式数据
                    type: 'post', //HTTP请求类型
                    timeout: 5000, //超时时间设置为10秒；
                    success: (result) => {
                        if (result.err) {
                            mui.toast('数据提交失败');
                            return;
                        }
                        if (result.success) {
                            plus.payment.request(window.alipay, result.aplipayurl, function (result) {
                                plus.nativeUI.alert("支付成功！", function () {
                                    let userInfo = JSON.parse(plus.storage.getItem('userInfo'));
                                    userInfo.isenroll = true;
                                    plus.storage.setItem('userInfo', JSON.stringify(userInfo));
                                    mui.back();
                                });
                            }, function (error) {
                                plus.nativeUI.alert("支付失败：" + error.code);
                            });
                        } else {
                            mui.toast(result.message);
                        }
                    },
                    error: (xhr, type, errorThrown) => {
                        //异常处理；
                        mui.toast('数据提交失败');
                    }
                });
            },
            wxpay() {
                this.params.paytype = "wxpay";
                let that = this;
                console.log(JSON.stringify(this.params));
                mui.ajax(`${this.domain}api/enrollnew`, {
                    data: this.params,
                    dataType: 'json', //服务器返回json格式数据
                    type: 'post', //HTTP请求类型
                    timeout: 5000, //超时时间设置为10秒；
                    success: (result) => {
                        if (result.err) {
                            mui.toast('数据提交失败');
                            return;
                        }
                        if (result.success) {
                            let data1 = {
                                "appid": "wx0411fa6a39d61297",
                                "noncestr": "FwBN9IbHmcjL21kP",
                                "package": "Sign=WXPay",
                                "partnerid": "1230636401",
                                "prepayid": "wx201706031418533bcb89e7660064346850",
                                "timestamp": 1496470733,
                                "sign": "3EFC4DF83F2408DC5AEFD30B5B0A7A87"
                            };
                            let data2 = {
                                "appid": "wx30a8839395816bc5",
                                "noncestr": "up9efmgg1euo7px",
                                "package": "Sign=WXPay",
                                "partnerid": "1286342601",
                                "prepayid": "wx201706031437103dcf8b2be70377435845",
                                "timestamp": 1496471830,
                                "sign": "7BC1CCAB064AF8E3528D9D94124FF2AF"
                            };
                            //console.log(JSON.stringify(result.data));
                            //console.log(JSON.stringify(data1));
                            alert(JSON.stringify(result.data));
                            plus.payment.request(window.wxpay, JSON.stringify(result.data), function (r) {
                                plus.nativeUI.alert("支付成功！", function () {
                                    let userInfo = JSON.parse(plus.storage.getItem('userInfo'));
                                    userInfo.isenroll = true;
                                    plus.storage.setItem('userInfo', JSON.stringify(userInfo));
                                    mui.back();
                                });
                            }, function (error) {
                                plus.nativeUI.alert("支付失败：" + error.code);
                            });
                        } else {
                            mui.toast(result.message);
                        }
                    },
                    error: (xhr, type, errorThrown) => {
                        //异常处理；
                        mui.toast('数据提交失败');
                    }
                });
            },
            pay1() {
                let data = {
                    "appid": "wx0411fa6a39d61297",
                    "noncestr": "FwBN9IbHmcjL21kP",
                    "package": "Sign=WXPay",
                    "partnerid": "1230636401",
                    "prepayid": "wx201706031418533bcb89e7660064346850",
                    "timestamp": 1496470733,
                    "sign": "3EFC4DF83F2408DC5AEFD30B5B0A7A87"
                };
                plus.payment.request(window.wxpay, JSON.stringify(data), function (r) {
                    plus.nativeUI.alert("支付成功！", function () {
                        let userInfo = JSON.parse(plus.storage.getItem('userInfo'));
                        userInfo.isenroll = true;
                        plus.storage.setItem('userInfo', JSON.stringify(userInfo));
                        mui.back();
                    });
                }, function (error) {
                    plus.nativeUI.alert("支付失败：" + error.code);
                });
            },
            pay2() {
                let data = {
                    "appid": "wx30a8839395816bc5",
                    "noncestr": "up9efmgg1euo7px",
                    "package": "Sign=WXPay",
                    "partnerid": "1286342601",
                    "prepayid": "wx201706031437103dcf8b2be70377435845",
                    "timestamp": 1496471830,
                    "sign": "7BC1CCAB064AF8E3528D9D94124FF2AF"
                };
                plus.payment.request(window.wxpay, JSON.stringify(data), function (r) {
                    plus.nativeUI.alert("支付成功！", function () {
                        let userInfo = JSON.parse(plus.storage.getItem('userInfo'));
                        userInfo.isenroll = true;
                        plus.storage.setItem('userInfo', JSON.stringify(userInfo));
                        mui.back();
                    });
                }, function (error) {
                    plus.nativeUI.alert("支付失败：" + error.code);
                });
            },
            pay() {
                console.log(this.payType);
                this[this.payType]();
            },
            payCount() {
                return this.params.firstpayment - this.params.couponItem.discount;
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
    });
}

function GetQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return decodeURIComponent(r[2]);
    return null;
}