<template>
    <transition name="fade" v-on:after-enter="afterEnter">
        <div class="page" v-show="value" @touchmove.prevent>
            <div class="title">
                <span @tap="back" class="mui-icon mui-icon-back"></span>
                <span>设置</span>
            </div>
            <div class="wrapper">
                <div>
                    <ul class="mui-table-view mui-table-view-chevron">
                        <li @tap="profileShow=true" class="mui-table-view-cell">
                            <span class="mui-navigate-right">修改个人资料</span>
                        </li>
                        <li class="mui-table-view-cell">
                            <span class="mui-navigate-right">联系我们</span>
                        </li>
                        <li class="mui-table-view-cell">
                            <span class="mui-navigate-right">评价我们</span>
                        </li>
                    </ul>
                    <ul class="mui-table-view">
                        <li @tap="logoff" class="mui-table-view-cell " style="text-align: center; ">
                            <a>退出登录</a>
                        </li>
                    </ul>
                </div>
            </div>
            <profile v-model="profileShow " :user-info="userInfo "></profile>
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
            }
        },
        components: {
            profile
        },
        data() {
            return {
                profileShow: false
            }
        },
        methods: {
            logoff() {
                this.$emit('logoff');
            },
            afterEnter() {
                new IScroll('.wrapper');
            },
            back() {
                this.$emit('input', false);
            },
        },
        computed: {

        },
        watch: {

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
</style>