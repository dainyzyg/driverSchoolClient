<template>
    <transition name="fade" v-on:after-enter="afterEnter">
        <div class="page" v-show="value" @touchmove.prevent>
            <div class="title">
                <span @tap="back" class="mui-icon mui-icon-back"></span>
                <span>{{title}}</span>
            </div>
            <div class="wrapper">
                <div>
                    <img style="width: 100vw;" :src="path" />
                </div>
            </div>
        </div>
    </transition>
</template>
<script>
    // import profile from './profile.vue'
    let wrapperScroll = null;
    export default {
        props: {
            value: {
                default: false
            },
            path: {
                default: null
            },
            title: {
                default: ''
            }
        },
        components: {

        },
        data() {
            return {
                profileShow: false
            }
        },
        methods: {
            afterEnter() {
                if (!wrapperScroll) {
                    wrapperScroll = new IScroll('.wrapper');
                } else {
                    wrapperScroll.refresh();
                }
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