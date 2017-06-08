<template>
    <transition name="fade" v-on:after-enter="afterEnter">
        <div class="page" v-show="value" @touchmove.prevent>
            <rate-coach v-model="showRate"></rate-coach>
            <div class="title">
                <span @tap="back" class="mui-icon mui-icon-back"></span>
                <div class="title-title">预约记录</div>
            </div>
            <template v-if="loading">
                <div class="loading">
                    <span class="mui-spinner "></span>正在加载...
                </div>
            </template>
            <template v-else>
                <div id="preorder-content" class="content">
                    <div style="width: 100%;padding-bottom: 50px;">
                        <div v-for="item, index in bookinginfo" style="width: 94%;min-height: 170px;" class="mui-card">
                            <div class="mui-card-header">
                                <div class="header" :class="{cancel:!item.isconfirm}">
                                    <div>
                                        <div v-if="item.price" class="check-cmp" @tap="checkItem(item)">
                                            <div v-if="item.checked" class="check-cmp-item"></div>
                                        </div>
                                    </div>
                                    {{getStatus(item)}}
                                </div>
                            </div>
                            <div class="mui-card-content">
                                <div class="mui-card-content-inner">
                                    <div>
                                        <p>{{formatData(item.date).date}} | {{formatData(item.date).week}}</p>
                                        {{item.course}} {{item.time}}
                                    </div>
                                    <div v-if="item.price" class="price">¥{{item.price}}</div>
                                </div>
                            </div>
                            <div class="mui-card-footer">
                                <template v-if="getStatus(item)=='已取消'">
                                    本次约车已被取消
                                </template>
                                <template v-if="getStatus(item)=='待付款'">
                                    请在十五分钟内完成付款，否则系统会取消预约
                                </template>
                            </div>
                        </div>
                    </div>
                    <div v-if="needPay" class="pay">
                        <div style="display: flex;line-height: 30px;">
                            <div style="margin-right: 10px;" class="check-cmp" @tap="toggleSelectAll">
                                <div v-if="selectAll" class="check-cmp-item"></div>
                            </div>
                            全选
                        </div>
                        <div>
                            合计:<span style="color: #f8a523;">¥{{priceTotal}}</span>
                        </div>
                        <div @tap="pay" class="pay-btn">{{btnName}}({{count}})</div>
                    </div>
                </div>
            </template>
        </div>
    </transition>
</template>
<script>
    import rateCoach from './rateCoach.vue'
    import loading from './loading.vue'
    export default {
        props: {
            value: {
                default: false
            },
            userInfo: {
                default: null
            },
            bookinginfo: {
                default: null
            }
        },
        components: {
            rateCoach,
            loading
        },
        data() {
            return {
                domain: 'http://118.89.225.203/',
                preorderList: [],
                loading: true,
                showRate: false,
                selectAll: false,
                alipay: null,
                loadingShow: false
            }
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
        },
        created() {

        },
        updated() {

        },
        methods: {
            pay() {
                let that = this;
                if (!that.loadingShow) {
                    that.loadingShow = true;
                    let bookingid = [];
                    for (let item of this.bookinginfo) {
                        if (item.price && item.checked) {
                            bookingid.push(item.bookid);
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
                                        that.back();
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
            checkItem(item) {
                console.log(item);
                item.checked = !item.checked;
            },
            getStatus(item) {
                let result
                if (!item.isconfirm) {
                    result = '已取消';
                } else if (!item.isneedpay) {
                    result = '已预约';
                } else {
                    result = '待付款';
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
            afterEnter() {

            },
            toggleSelectAll() {
                this.selectAll = !this.selectAll;
                for (let item of this.bookinginfo) {
                    if (item.price) {
                        item.checked = this.selectAll;
                    }
                }
            },
            back() {
                this.$emit('input', false);
            },

        },
        watch: {
            bookinginfo(val) {
                if (val) {
                    this.loading = false;
                    this.$nextTick(() => {
                        new IScroll('#preorder-content');
                    })
                }
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
            needPay() {
                if (!this.bookinginfo) {
                    return false;
                }
                if (this.bookinginfo[0].isneedpay) {
                    return true;
                } else {
                    return false;
                }
            },
            priceTotal() {
                let result = 0;
                for (let item of this.bookinginfo) {

                    if (item.price && item.checked) {
                        result += parseFloat(item.price);
                    }
                }
                return result;
            },
            count() {
                let result = 0;
                console.log(JSON.stringify('countstrat'))
                for (let item of this.bookinginfo) {

                    console.log(JSON.stringify(item))
                    if (item.price && item.checked) {
                        result++;
                    }
                }
                console.log(JSON.stringify('countend'))
                return result;
            }
        }
    }
</script>
<style scoped>
    .page {
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        z-index: 998;
        background-color: #f0eff4;
    }
    
    .content {
        position: absolute;
        top: 44px;
        left: 0;
        right: 0;
        bottom: 0;
        overflow: hidden;
    }
    
    .mui-bar.mui-bar-nav {
        background-color: rgb(255, 228, 0);
    }
    
    .mui-action-back {
        color: black;
    }
    
    .order {
        padding: 15px 20px;
        background-color: white;
    }
    
    .pay-select {
        background-color: white;
        margin-top: 15px;
    }
    
    .pay-select div {
        border-bottom: 1px solid #c8c7cc;
    }
    
    .mui-icon-extra-alipay,
    .mui-icon-weixin {
        font-size: 35px;
        color: rgb(255, 228, 0);
    }
    
    .mui-btn.mui-btn-block.confirm {
        margin-top: 20px;
        background-color: rgb(255, 228, 0);
        height: 40px;
        line-height: 10px;
        ;
    }
    
    .header {
        width: 100%;
        display: flex;
        justify-content: space-between;
        font-size: 14px;
        color: #fae112;
    }
    
    .cancel {
        color: #9b9b9b;
    }
    
    .mui-card-content-inner {
        font-size: 14px;
        color: #8f8f94;
    }
    
    .footer {
        width: 100%;
        display: flex;
        justify-content: space-between;
    }
    
    .rate-btn {
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: #f8a523;
        color: #f3f5f4;
        width: 68px;
        height: 26px;
        border-radius: 2px;
    }
    
    .loading {
        height: 40px;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    
    .title {
        background-color: rgb(255, 228, 0);
        height: 38px;
        display: flex;
        justify-content: center;
        align-items: center;
        position: relative;
    }
    
    .fade-enter-active,
    .fade-leave-active {
        transition: transform .3s ease-in;
    }
    
    .fade-enter,
    .fade-leave-active {
        transform: translate3d(100vh, 0, 0);
    }
    
    .mui-icon.mui-icon-back {
        position: absolute;
        top: 7px;
        left: 10px;
    }
    
    .title-title {
        font-size: 17px;
        font-weight: 500;
    }
    
    .check-cmp {
        width: 30px;
        height: 30px;
        border-radius: 50%;
        border: 1px solid rgb(255, 228, 0);
        display: flex;
        align-items: center;
        justify-content: center;
    }
    
    .check-cmp-item {
        width: 15px;
        height: 15px;
        border-radius: 50%;
        background-color: rgb(255, 228, 0);
    }
    
    .mui-card-content-inner {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    
    .price {
        font-size: 30px;
        color: #f8a523;
    }
    
    .pay {
        padding-left: 10px;
        position: absolute;
        bottom: 0px;
        height: 44px;
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;
        background-color: white;
        border-top: 1px solid #c8c7cc;
    }
    
    .pay-btn {
        background-color: #f8a523;
        width: 100px;
        height: 44px;
        display: flex;
        justify-content: center;
        align-items: center;
        color: white;
    }
</style>