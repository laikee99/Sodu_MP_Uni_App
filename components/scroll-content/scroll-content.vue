<template>
	<view class="scroll-container">
		<mescroll-uni :fixed="false" class="scroll" ref="mescrollRef" @init="mescrollInit" :down="downOption" :up="upOption">
			<view class="content" :style="{'min-height' : `calc(100vh - ${navBarHeight}px - 20px)`}">
				<view class="list">
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
			</view>
		</mescroll-uni>
	</view>

</template>

<script>
	import MescrollMixin from "mescroll-uni/mescroll-mixins.js";
	export default {
		mixins: [MescrollMixin],
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
					this.mescroll.scrollTo(0, 0)
				}
			}
		},
		data() {
			return {
				navBarHeight: 44 + uni.getSystemInfoSync().statusBarHeight,
				// 下拉刷新的常用配置
				downOption: {
					use: false, // 是否启用下拉刷新; 默认true
					auto: false, // 是否在初始化完毕之后自动执行下拉刷新的回调; 默认true
					textLoading: ' 加载中...'
				},
				upOption: {
					use: false
				}
			};
		},
		mounted() {},
		methods: {
			handleSwitchAction(key) {
				this.$emit('switchAction', key)
			},
			debounceScroll(e) {
				clearTimeout(this.timerId)
				this.timerId = setTimeout(() => {
					this.scrollTop = e.detail.scrollTop
				}, 1000)
			}
		}
	}
</script>

<style lang="less">
	.scroll-container {
		width: 100%;
		height: 100%;

		.content {
			box-sizing: border-box;
			position: relative;
			padding: 10upx 14upx 0 30upx;
			z-index: 1;
			position: relative;
			display: flex;
			flex-direction: column;

			.list {
				flex: 1;
			}

			.paragrah {
				text-indent: 2em;
			}
		}

		.btns {
			width: 100%;
			margin-left: -10upx;
			display: flex;
			justify-content: space-around;
			align-items: center;
			height: 80upx;
			z-index: 2;
			position: relative;
			margin-top: 20px;


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
