import loading from '../../../vue/loading.vue';
mui.plusReady(() => {
    let userInfo = null;
    if (plus.storage.getItem('userInfo')) {
        userInfo = JSON.parse(plus.storage.getItem('userInfo'));
    }
    initVue(userInfo);
});
if (!mui.os.plus) {
    initVue();
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
            cashback_total: 0,
            cashbackidlist: [],
            loadingShow: false
        },
        created() {
            if (userInfo) {
                mui.ajax('http://118.89.225.203/api/cashback', {
                    data: {
                        action: 'getusercash',
                        userid: this.userInfo.id
                    },
                    dataType: 'json', //服务器返回json格式数据
                    type: 'post', //HTTP请求类型
                    timeout: 5000, //超时时间设置为10秒；
                    success: (result) => {
                        console.log(JSON.stringify(result));
                        if (!result.err) {
                            this.cashback_total = result.returnobj.cashback_total;
                            this.cashbackidlist = result.returnobj.cashbacklist.map((item) => {
                                return item._id;
                            });
                        }
                    },
                    error: (xhr, type, errorThrown) => {

                    }
                });
            }
        },
        updated() {

        },
        mounted() {

        },
        methods: {
            tixian() {
                this.loadingShow = true;
                console.log(JSON.stringify(this.cashbackidlist))
                mui.ajax('http://118.89.225.203/api/cashback', {
                    data: {
                        action: 'applycash',
                        userid: this.userInfo.id,
                        cashbackidlist: JSON.stringify(this.cashbackidlist)
                        //cashbackidlist: '["5900a0d5d6da454f310e0087", "5900a0d5d6da454f310e008a", "5900a0d5d6da454f310e008d"]'
                    },
                    dataType: 'json', //服务器返回json格式数据
                    type: 'post', //HTTP请求类型
                    timeout: 5000, //超时时间设置为10秒；
                    success: (result) => {
                        mui.toast(result.returnobj.message);
                        this.loadingShow = false;
                    },
                    error: (xhr, type, errorThrown) => {
                        mui.toast('数据请求失败！');
                        this.loadingShow = false;
                    }
                });
            }
        },
        computed: {

        }
    })
}