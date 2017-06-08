<template>
    <transition name="fade" v-on:after-enter="afterEnter">
        <div class="page" v-show="value" @touchmove.prevent>
            <div class="title">
                <span @tap="back" class="mui-icon mui-icon-back"></span>
                <span>个人资料</span>
                <span @tap="saveInfo" class="save-action">保存</span>
            </div>
            <div class="wrapper">
                <div>
                    <ul class="mui-table-view mui-table-view-chevron">
                        <li @tap="uploadIMG" class="mui-table-view-cell">
                            <a id="head" class="mui-navigate-right">头像
								<span class="mui-pull-right head">
									<img class="head-img mui-action-preview" id="head-img1" :src="myImg"/>
								</span>
							</a>
                        </li>
                    </ul>
                    <form class="mui-input-group">
                        <div class="mui-input-row">
                            <label>姓名</label>
                            <input type="text" v-model="name" placeholder="请输入">
                        </div>
                        <div class="mui-input-row">
                            <label>手机号</label>
                            <input type="tel" v-model="phone" placeholder="请输入">
                        </div>
                    </form>
                </div>
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
            userInfo: {
                default: null
            }
        },
        data() {
            return {
                phone: '',
                name: '',
                myImg: '',
                domain: 'http://118.89.225.203/'
            }
        },
        created() {},
        methods: {
            afterEnter() {
                new IScroll('.wrapper');
            },
            back() {
                this.$emit('input', false);
            },
            uploadIMG() {
                let that = this;
                plus.gallery.pick(function (e) {
                    var name = e.substr(e.lastIndexOf('/') + 1);
                    plus.zip.compressImage({
                        src: e,
                        dst: '_doc/' + name,
                        overwrite: true,
                        quality: 10
                    }, function (zip) {
                        if (zip.size > (10 * 1024 * 1024)) {
                            return mui.toast('文件超大,请重新选择~');
                        }
                        that.myImg = zip.target;
                        let uploader = plus.uploader.createUpload(
                            `${that.domain}api/uploaduserimg?userid=${that.userInfo.id}`, {
                                method: 'POST'
                            },
                            function (upload, status) {
                                if (status == 200) {
                                    var data = JSON.parse(upload.responseText);
                                    //上传成功，重置表单
                                    if (data.success) {
                                        mui.toast('上传头像成功！');
                                    } else {
                                        mui.toast(data.message);
                                    }
                                } else {
                                    mui.toast('服务器未响应！')
                                }
                            });
                        uploader.addFile(zip.target, {
                            key: name
                        });
                        uploader.start();
                    }, function (zipe) {
                        mui.toast('压缩失败！')
                    });
                }, function (e) {
                    //mui.toast(e.message);
                }, {});
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
                            result.data.userimgurl && (this.myImg = result.data.userimgurl);
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
            value(val) {
                if (val) {
                    this.getInfo();
                }
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
        background-color: #fafafa;
    }
    
    .title {
        background-color: rgb(255, 228, 0);
        height: 38px;
        display: flex;
        justify-content: center;
        align-items: stretch;
        position: relative;
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