<template>
    <transition name="fade">
        <div class="page" v-show="value" @touchmove.prevent>
            <div class="title">
                <span @tap="back" class="mui-icon mui-icon-back"></span>
                <span>分享</span>
            </div>
            <div class="pages" :class="{ up: showGuize }">
                <div class="page1">
                    <div class="header">
                        <div class="header-title">
                        </div>
                        <div class="header-button">
                            <img @tap="share" class="header-button-img" src="../images/invitecode/share-button.png">
                        </div>
                        <div class="header-invitecode">您的邀请码为 {{code}}</div>
                    </div>
                    <div class="footer">
                        <div class="numbers">
                            <div class="numbers-item">
                                <div class="numbers-item-count">
                                    <div class="numbers-item-count-no">0</div>
                                    <div class="numbers-item-count-unit">人 </div>
                                </div>
                                <div class="numbers-item-des">
                                    我邀请的人数
                                </div>
                            </div>
                            <div class="numbers-item">
                                <div class="numbers-item-count">
                                    <div class="numbers-item-count-no">0</div>
                                    <div class="numbers-item-count-unit">元 </div>
                                </div>
                                <div class="numbers-item-des">
                                    我获得的现金
                                </div>
                            </div>
                        </div>
                        <div @tap="showGuize=true" class="guize"></div>
                    </div>
                </div>
                <div class="page2">
                    <img width="28px" @tap="showGuize=false" src="../images/invitecode/up.png">
                </div>
            </div>
        </div>
    </transition>
</template>
<script>
    export default {
        name: 'loading',
        props: {
            value: {
                default: false
            }
        },
        data() {
            return {
                showGuize: false,
                code: ''
            }
        },
        mounted() {
            console.log('mounted:');
        },
        created() {
            console.log('created:');
        },
        ready() {
            console.log('ready:');
        },
        methods: {
            back() {
                this.$emit('input', false);
            },
            share() {
                this.$emit('share')
            }
        },
        computed: {},
        watch: {
            value(val) {
                let userInfo = plus.storage.getItem('userInfo');
                if (userInfo) {
                    userInfo = JSON.parse(userInfo);
                }
                if (val && userInfo) {
                    mui.ajax('http://118.89.225.203/api/generateinvitecode', {
                        data: {
                            userid: userInfo.id
                        },
                        dataType: 'json', //服务器返回json格式数据
                        type: 'post', //HTTP请求类型
                        timeout: 10000, //超时时间设置为10秒；
                        success: (data) => {
                            console.log(JSON.stringify(data));
                            if (data.success) {
                                this.code = data.invitecode;
                            }
                        },
                        error: (xhr, type, errorThrown) => {
                            mui.toast('连接服务器异常！');
                        }
                    });
                }
            }
        }
    }
</script>
<style scoped>
    .fade-enter-active,
    .fade-leave-active {
        transition: transform .3s ease-in;
    }
    
    .fade-enter,
    .fade-leave-active {
        transform: translate3d(100vh, 0, 0);
    }
    
    .title {
        background-color: rgb(255, 228, 0);
        height: 38px;
        display: flex;
        justify-content: center;
        align-items: center;
        position: relative;
        z-index: 999;
    }
    
    .mui-icon.mui-icon-back {
        position: absolute;
        top: 7px;
        left: 10px;
    }
    
    .page {
        position: fixed;
        top: 0;
        right: 0;
        left: 0;
        height: 200vh;
        overflow: hidden;
        z-index: 998;
    }
    
    .pages {
        position: absolute;
        top: 38px;
        right: 0;
        left: 0;
        transition: transform .3s ease-in;
    }
    
    .up {
        transform: translate3d(0, calc(38px - 100vh), 0);
    }
    
    .page1 {
        display: flex;
        height: calc(100vh - 38px);
        z-index: 998;
        flex-direction: column;
        background-color: #ffffff;
    }
    
    .page2 {
        display: flex;
        justify-content: center;
        align-items: flex-start;
        padding: 8px;
        height: calc(100vh - 38px);
        z-index: 998;
        background-color: #f4f4f4;
        background-image: url(../images/invitecode/xize.png);
        background-position: top;
        background-repeat: no-repeat;
        background-size: 100vw;
    }
    
    .xize {
        width: 100vw;
        height: auto;
    }
    
    .header {
        flex: 1;
        /*background-color: saddlebrown;*/
        background-image: url(../images/invitecode/bg.png);
        background-position: bottom;
        background-repeat: no-repeat;
        background-size: 100vw;
        display: flex;
        flex-direction: column;
        align-items: stretch;
    }
    
    .header-title {
        flex: 30;
        width: 100%;
        background-image: url(../images/invitecode/wenan.png);
        background-position: bottom;
        background-repeat: no-repeat;
        background-size: auto 50%;
    }
    
    .header-button {
        flex: 13;
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
        align-items: center;
    }
    
    .header-button-img {
        width: 45%;
    }
    
    .header-button-img1 {}
    
    .header-invitecode {
        padding-top: 15px;
        flex: 57;
        font-size: 15px;
        color: #364250;
        display: flex;
        justify-content: center;
    }
    
    .footer {
        display: flex;
        flex-direction: column;
        flex: 0 0 180px;
    }
    
    .numbers {
        flex: 0 0 130px;
        display: flex;
        justify-content: space-around;
        align-items: center
    }
    
    .numbers-item {
        display: flex;
        flex-direction: column;
        flex: 0 0 35vw;
        height: 30vw;
        max-height: 130px;
        background-color: #e3e3e3;
        border-radius: 10px;
    }
    
    .numbers-item-count-unit {
        display: flex;
        align-items: flex-end;
        padding-bottom: 2vw;
        font-size: 16px;
        height: 18vw;
        color: black;
    }
    
    .numbers-item-count {
        flex: 1;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    
    .numbers-item-count-no {
        font-size: 18vw;
        line-height: 18vw;
        color: #fec629;
    }
    
    .numbers-item-des {
        display: flex;
        justify-content: center;
        align-items: center;
        flex: 0 0 30px;
        font-size: 14px;
        color: #9c9fa4;
    }
    
    .guize {
        flex: 0 0 40px;
        background-image: url(../images/invitecode/huodongxize.png);
        background-repeat: no-repeat;
        background-position: center;
        background-size: auto 30px;
    }
</style>