<template>
    <transition name="fade" v-on:after-enter="afterEnter">
        <div class="page" :style="{top:top}" v-show="value" @touchmove.prevent>
            <div class="title">
                <span @tap="back" class="mui-icon mui-icon-back"></span>
                <span>我的优惠券</span>
            </div>
            <template v-if="loading">
                <div class="loading">
                    <span class="mui-spinner "></span>正在加载...
                </div>
            </template>
            <template v-else>
                <div class="wrapper-coupon">
                    <div style="padding-bottom: 20px;">
                        <div class="add-coupon">
                            <input ref="commentTxt" type="text" v-model="invitecode" lass="mui-input-clear" placeholder="请输入优惠码">
                            <button @tap="addinvitecode" type="button" class="mui-btn mui-btn-primary">兑换</button>
                        </div>
                        <div v-for="item in invitecodeList" class="coupon-item">
                            <div class="value">¥{{item.discount}}</div>
                            <div class="description">
                                <div class="description-header">
                                    {{item.des}}
                                </div>
                                <div class="description-footer">
                                    <div class="invitecode">NO.{{item.invitecode}}</div>
                                    <div @tap="use(item)" class="use-btn">立即使用</div>
                                </div>
                            </div>
                        </div>
                    </div>
            </template>
            <profile v-model="profileShow"></profile>
            </div>
    </transition>
</template>
<script>
    import profile from './profile.vue'
    export default {
        props: {
            value: {
                default: false
            },
            userInfo: {
                default: null
            },
            toJoin: {
                default: false
            },
            top: {
                default: '0px'
            }
        },
        components: {
            profile
        },
        mounted() {
            //alert(JSON.stringify(this.params))
            // setTimeout(() => {
            //     mui.ajax(`http://118.89.225.203/api/userinvitecode`, {
            //         data: {
            //             "action": "getlist",
            //             "userid": this.userInfo.id
            //         },
            //         dataType: 'json', //服务器返回json格式数据
            //         type: 'post', //HTTP请求类型
            //         timeout: 5000, //超时时间设置为10秒；
            //         success: (result) => {
            //             alert(JSON.stringify(result));
            //             return;
            //             mui.toast(result.message);
            //             return;
            //             if (result.err) {
            //                 mui.toast(result.message);
            //                 return;
            //             }
            //             initVue(result.classdetail)
            //         },
            //         error: (xhr, type, errorThrown) => {
            //             //异常处理；
            //             mui.toast('数据加载失败');
            //         }
            //     });
            // }, 0);
        },
        data() {
            return {
                profileShow: false,
                invitecode: '',
                invitecodeList: [],
                loading: true
            }
        },
        methods: {
            use(item) {
                if (this.toJoin) {
                    //获得主页面的webview
                    var main = plus.webview.currentWebview().parent();
                    //触发主页面的gohome事件
                    mui.fire(main, 'gohome');
                } else {
                    console.log('emit changeCoupon')
                    this.$emit('changecoupon', item);
                }
                this.back();
            },
            addinvitecode() {
                // mui.ajax(`http://118.89.225.203/api/generateinvitecode`, {
                //     data: {
                //         "userid": this.userInfo.id
                //     },
                //     dataType: 'json', //服务器返回json格式数据
                //     type: 'post', //HTTP请求类型
                //     timeout: 5000, //超时时间设置为10秒；
                //     success: (result) => {
                //         alert(JSON.stringify(result));
                //         return;
                //         mui.toast(result.message);
                //         return;
                //         if (result.err) {
                //             mui.toast(result.message);
                //             return;
                //         }
                //         initVue(result.classdetail)
                //     },
                //     error: (xhr, type, errorThrown) => {
                //         //异常处理；
                //         mui.toast('数据加载失败');
                //     }
                // });
                // return;
                this.loading = true;
                mui.ajax(`http://118.89.225.203/api/userinvitecode`, {
                    data: {
                        "action": "save",
                        "userid": this.userInfo.id,
                        "invitecode": this.invitecode
                    },
                    dataType: 'json', //服务器返回json格式数据
                    type: 'post', //HTTP请求类型
                    timeout: 5000, //超时时间设置为10秒；
                    success: (result) => {
                        this.loading = false;
                        if (result.err) {
                            mui.toast(result.message);
                            return;
                        }
                        this.getInvitecodeList();
                    },
                    error: (xhr, type, errorThrown) => {
                        //异常处理；
                        mui.toast('数据加载失败');
                    }
                });
            },
            afterEnter() {
                console.log('afterEnter coupon')
                //new IScroll('.wrapper-coupon');
            },
            back() {
                this.$emit('input', false);
                this.$nextTick(() => {
                    this.$refs.commentTxt.blur();
                });
            },
            getInvitecodeList() {
                mui.ajax(`http://118.89.225.203/api/userinvitecode`, {
                    data: {
                        "action": "getlist",
                        "userid": this.userInfo.id
                    },
                    dataType: 'json', //服务器返回json格式数据
                    type: 'post', //HTTP请求类型
                    timeout: 5000, //超时时间设置为10秒；
                    success: (result) => {
                        if (result.err) {
                            mui.toast(result.message);
                            return;
                        }
                        this.invitecodeList = result.userinvite;
                        this.loading = false;
                        this.$nextTick(() => {
                            new IScroll('.wrapper-coupon');
                        });
                    },
                    error: (xhr, type, errorThrown) => {
                        //异常处理；
                        mui.toast('数据加载失败');
                    }
                });
            }
        },
        computed: {

        },
        watch: {
            value(val) {
                if (val) {
                    this.getInvitecodeList();
                }
            }
        }
    }
</script>
<style scoped>
    .page {
        position: fixed;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        z-index: 998;
        background-color: #f0eff4;
    }
    
    .title {
        background-color: rgb(255, 228, 0);
        height: 38px;
        display: flex;
        justify-content: center;
        align-items: center;
        position: relative;
    }
    
    .wrapper-coupon {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        top: 38px;
        overflow: hidden;
    }
    
    .mui-icon.mui-icon-back {
        position: absolute;
        top: 7px;
        left: 10px;
    }
    
    .fade-enter-active,
    .fade-leave-active {
        transition: transform .3s ease-in;
    }
    
    .fade-enter,
    .fade-leave-active {
        transform: translate3d(100vh, 0, 0);
    }
    
    .add-coupon {
        margin: 10px;
        display: flex;
        height: 40px;
        align-items: stretch;
    }
    
    .coupon-item {
        margin: 10px;
        display: flex;
        height: 80px;
        align-items: stretch;
    }
    
    .coupon-item .value {
        display: flex;
        justify-content: center;
        align-items: center;
        color: snow;
        font-size: 26px;
        flex: 0 0 90px;
        background-color: orangered;
    }
    
    .coupon-item .description {
        padding: 10px;
        background-color: white;
        flex: 1;
        overflow: hidden;
        text-overflow: ellipsis;
        display: flex;
        flex-direction: column;
    }
    
    .description-header {
        flex: 1;
        overflow: hidden;
        font-size: 16px;
    }
    
    .description-footer {
        flex: 0 0 20px;
        font-size: 16px;
        color: #8f8f94;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    
    .loading {
        height: 40px;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    
    .use-btn {
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: #f8a523;
        color: #f3f5f4;
        width: 68px;
        height: 26px;
        border-radius: 2px;
    }
</style>