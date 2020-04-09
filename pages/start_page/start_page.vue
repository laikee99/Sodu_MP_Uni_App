<template>
	<view class="start-page">
		<image class="img" src="../../static/logo.png" mode="scaleToFill"></image>

		<view class="text">
			启动中，请稍候...
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {

			}
		},
		onLoad() {
			this.checkStatus()
		},
		methods: {
			checkStatus() {
				setTimeout(() => {
					this.goHome()
				}, 1000)
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
	.start-page {
		overflow: auto;

		.img {
			display: block;
			width: 600upx;
			height: 300upx;
			margin: 0 auto;
			margin-top: 20vh;
		}

		.text {
			font-size: 30upx;
			color: #808080;
			text-align: center;
			margin-top: 100upx;
		}
	}
</style>
