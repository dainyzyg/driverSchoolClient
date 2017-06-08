import share from '../../../vue/share.vue'
window.vueComponent = new Vue({
    el: '.vue-body',
    components: {
        share
    },
    data: {
        showShare: false
    },
    created() {

    },
    updated() {

    },
    methods: {
        myPosts() {

        },
        // showSetting() {
        // 	this.showSetting = true;
        // },
        showMyCouponFunc() {
            if (this.userInfo) {
                this.showMyCoupon = true;
            } else {
                var btnArray = ['现在就去', '再看看'];
                mui.confirm(' ', '请先登录或注册', btnArray, (e) => {
                    if (e.index == 0) {
                        this.toLogin();
                    } else {

                    }
                });
            }
        },
        logoff() {
            var btnArray = ['确定', '取消'];
            mui.confirm(' ', '确认退出当前帐号？', btnArray, (e) => {
                if (e.index == 0) {
                    plus.storage.setItem('userInfo', '');
                    this.userInfo = null;
                    this.showSetting = false;
                }
            });
        },
        toggleLogin() {
            if (!this.userInfo) {
                this.toLogin();
            } else {
                var btnArray = ['确定', '取消'];
                mui.confirm(' ', '确认退出当前帐号？', btnArray, (e) => {
                    if (e.index == 0) {
                        plus.storage.setItem('userInfo', '');
                        this.userInfo = null;
                    }
                });
            }
        },
        toLogin() {
            mui.openWindow({
                url: '../login/login.html',
                show: {
                    autoShow: true, //页面loaded事件发生后自动显示，默认为true
                    aniShow: 'pop-in', //页面显示动画，默认为”slide-in-right“；
                    duration: 300 //页面动画持续时间，Android平台默认100毫秒，iOS平台默认200毫秒；
                }
            });
        },
        share() {
            console.log('share');
            if (window.sharewx) {
                sharewx.send({
                    content: "DCloud HBuilder-做最好的HTML5开发工具",
                    href: "http://www.dcloud.io/",
                    extra: {
                        scene: "WXSceneTimeline"
                    }
                }, function () {
                    alert("分享成功！");
                }, function (e) {
                    alert("分享失败：" + e.message);
                });
            } else {
                alert('请安装微信！')
            }
        }
    },
    computed: {

    }
})