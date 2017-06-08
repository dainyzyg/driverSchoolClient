<template>
    <div class="loading" :style="{display:display}" @touchmove.prevent>
        <span class="mui-spinner"></span>
    </div>
</template>
<script>
    export default {
        name: 'loading',
        props: {
            show: {
                default: false
            }
        },
        data() {
            return {

            }
        },
        methods: {
            onTouchMove() {
                console.log('sds')
            }
        },
        computed: {
            display() {
                if (this.show) {
                    return 'flex';
                } else {
                    return 'none';
                }
            }
        },
        watch: {

        }
    }
</script>
<style scoped>
    .loading {
        color: white;
        position: fixed;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        justify-content: center;
        align-items: center;
        z-index: 998;
        background-color: rgba(0, 0, 0, .2);
    }
    
    .mui-spinner {
        font-size: 30px;
    }
</style>