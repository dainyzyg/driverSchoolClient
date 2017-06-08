<template>
	<div class="slider" :class="{disAnimation:disAnimation}" :style="{transform:transform}" @touchstart='touchstart' @touchmove='touchmove'
					@touchend='touchend'>
		<slot></slot>
	</div>
</template>
<script>
	export default {
		name: 'silder',
		props: {
			value: {
				default: 0
			},
			count: {
				default: 1
			}
		},
		data() {
			return {
				currentPage: 0,
				transform: 'translate3d(0,0,0)',
				moveX: 0,
				disAnimation: false
			}
		},
		methods: {
			touchstart(e) {
				this.flag = null
				this.disAnimation = true
				var touches = e.touches[0] //触控开始
					//记录落点
				this.pageX = touches.pageX
				this.pageY = touches.pageY
			},
			touchmove(e) {
				var touches = e.touches[0]
				var X = touches.pageX - this.pageX
				var Y = touches.pageY - this.pageY
				this.flag = this.flag || (Math.abs(X) > Math.abs(Y) ? 'X' : 'Y')
				if(this.flag === 'X') {
					e.preventDefault()
					e.stopPropagation()
					this.moveX = X
					this.transform = `translate3d(calc(${this.moveX}px - ${this.currentPage*100}%),0,0)`
				}
			},
			touchend(e) {
				this.disAnimation = false;
				var minRange = 50;
				if(!this.flag) return
				e.preventDefault() //滑动结束前往下一页面,next()方法调用了go()方法
				if(this.moveX < -minRange && this.currentPage < this.count - 1) {
					this.currentPage++;

				} else if(this.moveX > minRange && this.currentPage > 0) {
					this.currentPage--
				} else {
					this.transform = `translate3d(-${this.currentPage*100}%,0,0)`
				}
			}
		},
		computed: {
			// a computed getter
			transform1() {
				// `this` points to the vm instance
				return `translate3d(-${this.currentPage*100}%,0,0)`
			}
		},
		watch: {
			currentPage: function(val) {
				this.transform = `translate3d(-${val*100}%,0,0)`;
				this.$emit('change', val)
				this.$emit('input', val)
			},
			value: function(val) {
				this.currentPage = val
			}
		}
	}
</script>
<style scoped>
	.slider {
		width: 100%;
		align-self: stretch;
		align-items: stretch;
		display: flex;
		flex: 1;
		transition: transform .3s ease-out
	}
	
	.slider-content {
		display: flex;
	}
	
	.page {
		flex: 0 0 100%;
		display: flex;
	}
	
	.disAnimation {
		transition: none;
	}
</style>