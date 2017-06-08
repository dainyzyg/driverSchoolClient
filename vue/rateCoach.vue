<template>
    <transition name="fade" v-on:after-enter="afterEnter">
        <div class="page" v-show="value" @touchmove.prevent>
            <div class="title">
                <span @tap="back" class="mui-icon mui-icon-back"></span>
                <div class="title-title" @tap="back">评价教练</div>
            </div>
            <div class="content">
                <img v-if="coachInfo.url" :src="'http://118.89.225.203/'+coachInfo.url" class="margin-top" style="height: 80px;width: 80px;border-radius: 50%;">
                <span v-else class="mui-icon mui-icon-contact margin-top"></span>
                <div class="margin-top">{{coachInfo.coachname}}</div>
                <div class="icons mui-inline margin-top" style="margin-left: 6px;">
                    <i v-for="i in 5" @tap="evaluaterate=i" :class="{'mui-icon-star-filled':evaluaterate>=i}" class="mui-icon mui-icon-star"></i>
                </div>
                <textarea ref="commentTxt" v-model="evaluatecontent" class="margin-top comment-textarea" placeholder="这位教练怎么样？是否详细？"></textarea>
                <div @tap="submit" class="btn">提 交</div>
            </div>
        </div>
    </transition>
</template>
<script>
    export default {
        props: {
            value: {
                default: false
            },
            props: {
                default: null
            }
        },
        data() {
            return {
                evaluatecontent: '',
                evaluaterate: 0,
                domain: 'http://118.89.225.203/',
                coachInfo: {
                    "coachname": "",
                    "imgurl": ""
                }
            }
        },

        methods: {
            afterEnter() {
                this.getCoachInfo();
            },
            back() {
                this.$emit('input', false);
            },
            submit() {
                mui.ajax('http://118.89.225.203/api/coachevaluate', {
                    data: {
                        action: 'coachevaluate',
                        coachid: this.props.coachid,
                        userid: window.userInfo.id,
                        evaluaterate: this.evaluaterate,
                        evaluatecontent: this.evaluatecontent,
                        bookingid: this.props._id
                    },
                    dataType: 'json', //服务器返回json格式数据
                    type: 'post', //HTTP请求类型
                    timeout: 5000, //超时时间设置为10秒；
                    success: (result) => {
                        if (result.err) {
                            mui.toast(result.err.message);
                        } else if (result.success) {
                            mui.toast('评价成功！');
                            this.$emit('ratesuccess');
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
            },
            getCoachInfo() {
                mui.ajax('http://118.89.225.203/api/coachevaluate', {
                    data: {
                        action: 'getcocahinfo', //获取用户信息方法
                        coachid: this.props.coachid,
                    },
                    dataType: 'json', //服务器返回json格式数据
                    type: 'post', //HTTP请求类型
                    timeout: 5000, //超时时间设置为10秒；
                    success: (result) => {
                        if (result.err) {
                            mui.toast('获取教练信息失败！');
                        } else {
                            this.coachInfo.coachname = result.coachinfo.coachname;
                            this.coachInfo.url = result.coachinfo.imgurl[0];
                        }
                    },
                    error: (xhr, type, errorThrown) => {
                        this.loading = false;
                        //异常处理；
                        mui.toast('连接服务器异常！');
                    }
                });
            },
            getInfo() {
                mui.ajax('http://118.89.225.203/api/userinfo', {
                    data: {
                        action: 'getinfo', //获取用户信息方法
                        userid: this.userInfo.id,
                    },
                    dataType: 'json', //服务器返回json格式数据
                    type: 'post', //HTTP请求类型
                    timeout: 5000, //超时时间设置为10秒；
                    success: (result) => {
                        if (result.success) {
                            console.log(JSON.stringify(result));
                            this.name = result.data.name;
                            this.phone = result.data.phone;
                            result.data.userimgurl && (this.myImg = this.domain + result.data.userimgurl);
                        } else {
                            mui.toast('获取信息失败！');
                        }
                    },
                    error: (xhr, type, errorThrown) => {
                        this.loading = false;
                        //异常处理；
                        mui.toast('连接服务器异常！');
                    }
                });
            },
            saveInfo() {
                mui.ajax('http://118.89.225.203/api/userinfo', {
                    data: {
                        action: 'upsert', //更新方法
                        userid: this.userInfo.id, //用户id
                        phone: this.phone, //电话号码
                        name: this.name //姓名
                    },
                    dataType: 'json', //服务器返回json格式数据
                    type: 'post', //HTTP请求类型
                    timeout: 5000, //超时时间设置为10秒；
                    success: (data) => {
                        mui.toast(data.message);
                    },
                    error: (xhr, type, errorThrown) => {
                        this.loading = false;
                        //异常处理；
                        mui.toast('连接服务器异常！');
                    }
                });
            }
        },
        computed: {

        },
        watch: {

        }
    }
</script>
<style scoped>
    .comment-textarea {
        border-radius: 5px;
        border: 1px solid #bababa;
        width: 94%;
        height: 100px;
        margin: 0;
        padding: 5px;
        line-height: 20px;
        font: 16px;
        color: #6d6d72;
        background-color: #f8f8f8;
    }
    
    .btn {
        height: 40px;
        border-radius: 5px;
        width: 94%;
        display: flex;
        justify-content: center;
        align-items: center;
        font: 16px;
        color: #fcfdf8;
        background-color: #f5a623;
        margin-top: 30px;
    }
    
    .btn:active {
        background-color: #d59f45;
    }
    
    .mui-icon-star {
        color: #B5B5B5;
        font-size: 13vw;
    }
    
    .mui-icon-star-filled {
        color: #f8e71d;
        font-size: 13vw;
    }
    
    .margin-top {
        margin-top: 10px;
    }
    
    .page {
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        z-index: 998;
        background-color: #fafafa;
    }
    
    .mui-icon-contact {
        color: #8F8F94;
        font-size: 80px;
    }
    
    .content {
        display: flex;
        flex-direction: column;
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
    
    .title-title {
        font-size: 17px;
        font-weight: 500;
    }
    
    .wrapper {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        top: 38px;
        overflow: hidden;
    }
    
    .save-action {
        position: absolute;
        top: 0px;
        right: 10px;
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
    
    #head {
        line-height: 40px;
    }
    
    .head-img {
        width: 40px;
        height: 40px;
    }
    
    #head-img1 {
        position: absolute;
        bottom: 10px;
        right: 40px;
        width: 40px;
        height: 40px;
        border-radius: 20px;
    }
</style>