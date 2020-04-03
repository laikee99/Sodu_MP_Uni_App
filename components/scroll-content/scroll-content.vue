<template>
	<view class="scroll-container">
		<scroll-view class="scroll" scroll-y="true" :style="{'height': height}" :scroll-top="scrollTop" @scroll="handleScroll">
			<view class="content">
				<view class="paragrah" v-for="(item,index) in content" :key="index">
					{{item}}
				</view>
			</view>
			<view class="btns">
				<view class="btn" @click="handleSwitchAction(1)">
					上一章
				</view>
				<view class="btn" @click="handleSwitchAction(2)">
					目录
				</view>
				<view class="btn" @click="handleSwitchAction(3)">
					下一章
				</view>
				<view v-if="book && book.soduUpdatePageUrl" class="btn" @click="handleSwitchAction(4)">
					更新站点
				</view>
			</view>
		</scroll-view>
	</view>

</template>

<script>
	export default {
		props: {
			book: {
				type: Object,
				default: null
			},
			content: {
				type: Array,
				default: () => []
			},
			height: {
				type: String,
				default: ''
			}
		},
		watch: {
			content(newValue, oldValue) {
				if (newValue) {
					this.toTop()
				}
			}
		},
		data() {
			return {
				scrollTop: 0
			};
		},
		methods: {
			handleSwitchAction(key) {
				this.$emit('switchAction', key)
			},
			toTop() {
				this.scrollTop = 0
			},
			handleScroll(e) {
				// console.log(e)
				// console.log(this.scrollTop, '=========')
				this.scrollTop = e.detail.scrollTop
			}
		}
	}
</script>

<style lang="less">
	.scroll-container {
		width: 100%;
		height: 100%;

		.scroll {
			overflow-x: hidden;
			box-sizing: border-box;
		}

		.content {
			min-height: 100%;
			box-sizing: border-box;
			position: relative;
			padding: 10upx 16upx 0 30upx;
			padding-bottom: 70upx;
			z-index: 1;
			position: relative;

			.paragrah {
				text-indent: 2em;
			}
		}

		.btns {
			width: 100vw;
			display: flex;
			justify-content: space-around;
			align-items: center;
			height: 70upx;
			margin-top: -70upx;
			z-index: 2;
			position: relative;

			.btn {
				height: 60upx;
				width: 140upx;
				font-size: 28upx;
				border: 1px solid #c4c4c4;
				background-color: rgba(255, 255, 255, 0.8);
				line-height: 60upx;
				text-align: center;
				border-radius: 8upx;
				box-sizing: border-box;

			}
		}
	}
</style>
