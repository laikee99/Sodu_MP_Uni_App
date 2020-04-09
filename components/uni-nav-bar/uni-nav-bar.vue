<template>
	<view class="uni-navbar" :class="{'uni-navbar-fixed':isFixed,'uni-navbar-shadow':hasShadow}" :style="{'background-color':backgroundColor}">
		<uni-status-bar v-if="insertStatusBar"></uni-status-bar>
		<view class="uni-navbar-header" :style="{color:color}">
			<view :class="{'hide-left' : !showLeft}" class="uni-navbar-header-btns left-container">
				<view class="icon-container" @tap="handleBackClick">
					<uni-icon type="back" :color="leftColor" size="22"></uni-icon>
				</view>
				<view class="icon-split"></view>
				<view class="icon-container" @tap="goHome">
					<uni-icon type="home-filled" :color="leftColor" size="22"></uni-icon>
				</view>
			</view>

			<view class="uni-navbar-container">
				<view v-if="title.length" class="uni-navbar-container-title">{{title}}</view>
				<!-- 标题插槽 -->
				<slot></slot>
			</view>
			<view class="right-container uni-navbar-header-btns" @tap="onClickRight">
				<view v-if="rightIcon.length">
					<uni-icon type="rightIcon" :color="color" size="24"></uni-icon>
				</view>
				<!-- 优先显示图标 -->
				<view v-if="rightText.length&&!rightIcon.length" class="uni-navbar-btn-text">{{rightText}}</view>
				<slot name="right"></slot>
			</view>
		</view>
	</view>
</template>

<script>
	import uniStatusBar from '../uni-status-bar/uni-status-bar.vue'
	import uniIcon from './uni-icon.vue'

	export default {
		components: {
			uniStatusBar,
			uniIcon
		},
		props: {
			/**
			 * 标题文字
			 */
			title: {
				type: String,
				default: ''
			},
			/**
			 * 左侧按钮文本
			 */
			leftText: {
				type: String,
				default: ''
			},
			/**
			 * 右侧按钮文本
			 */
			rightText: {
				type: String,
				default: ''
			},
			/**
			 * 左侧按钮图标
			 */
			leftIcon: {
				type: [Array, String],
				default: () => ['back', 'home-filled']
			},
			/**
			 * 右侧按钮图标
			 */
			rightIcon: {
				type: String,
				default: ''
			},
			/**
			 * 是否固定在顶部
			 */
			fixed: {
				type: [Boolean, String],
				default: false
			},
			/**
			 * 按钮图标和文字颜色
			 */
			leftColor: {
				type: String,
				default: '#000000'
			},
			/**
			 * 按钮图标和文字颜色
			 */
			color: {
				type: String,
				default: '#000000'
			},
			/**
			 * 背景颜色
			 */
			backgroundColor: {
				type: String,
				default: '#FFFFFF'
			},
			/**
			 * 是否包含状态栏，默认固定在顶部时包含
			 */
			statusBar: {
				type: [Boolean, String],
				default: ''
			},
			customBack: {
				type: [Boolean],
				default: false
			},
			showLeft: {
				type: Boolean,
				default: true
			},
			/**
			 * 是否使用阴影，默认根据背景色判断
			 */
			shadow: {
				type: String,
				default: ''
			},
			leftClick: {
				type: Object,
				default: undefined
			}
		},
		data() {
			return {}
		},
		computed: {
			isFixed() {
				return String(this.fixed) === 'true'
			},
			insertStatusBar() {
				switch (String(this.statusBar)) {
					case 'true':
						return true
					case 'false':
						return false
					default:
						return this.isFixed
				}
			},
			hasShadow() {
				var backgroundColor = this.backgroundColor
				switch (String(this.shadow)) {
					case 'true':
						return true
					case 'false':
						return false
					default:
						return backgroundColor !== 'transparent' && backgroundColor.indexOf('rgba') < 0
				}
			}
		},
		mounted() {},
		methods: {
			handleBackClick() {
				if (this.customBack) {
					this.$emit('back')
				} else {
					uni.navigateBack()
				}
			},
			goHome() {
				uni.redirectTo({
					url: '../../pages/home_page/home_page',
					animationType: 'pop-in'
				})
			}
		}
	}
</script>

<style lang="less">
	.uni-navbar {
		display: block;
		position: relative;
		width: 100%;
		overflow: hidden;
	}

	.left-container {
		border: 1px solid #e5e5e5;
		border-radius: 16px;
		height: 60upx;
		line-height: 60upx;
		margin-left: 8px;
		width: 87px !important;
		display: flex;
		align-items: center;
		background: rgba(255, 255, 255, 0.6);
	}

	.hide-left {
		visibility: hidden !important;
	}

	.single-icon-container {
		padding-left: 30upx !important;
	}

	.icon-container {
		flex: 1;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.icon-split {
		height: 55%;
		width: 2upx;
		background: rgba(0, 0, 0, 0.2);
	}

	.right-container {
		width: 87px !important;
	}

	.uni-navbar-shadow {
		box-shadow: 0 1px 6px #ccc;
	}

	.uni-navbar.uni-navbar-fixed {
		position: fixed;
		z-index: 998;
		top: 0;
		left: 0;
	}

	.uni-navbar-header {
		display: flex;
		flex-direction: row;
		width: 100%;
		height: 44px;
		line-height: 44px;
		font-size: 16px;
		align-items: center;
	}

	.uni-navbar-header .uni-navbar-header-btns {
		display: inline-flex;
		flex-wrap: nowrap;
		flex-shrink: 0;
		width: 120upx;
		padding: 0 12upx;
	}

	.uni-navbar-header .uni-navbar-header-btns:first-child {
		padding-left: 0;
	}

	.uni-navbar-header .uni-navbar-header-btns:last-child {
		width: 60upx;
	}

	.uni-navbar-container {
		width: 100%;
		margin: 0 10upx;
	}

	.uni-navbar-container-title {
		font-size: 34upx;
		text-align: center;
	}
</style>
