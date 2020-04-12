<template>
	<view class="start-page">
		<image class="img" src="../../static/logo.png" mode="scaleToFill"></image>

		<view class="text">
			{{info}}
		</view>
	</view>
</template>

<script>
	import {
		init
	} from '../../api/common.js'
	import {
		mapState,
		mapMutations
	} from 'vuex'

	import {
		getManualConfig
	} from '../../utils/system.js'

	export default {
		data() {
			return {
				info: '启动中，请稍候...',
				isManual: false
			}
		},
		onLoad() {
			this.initInfo()
			this.isManual = getManualConfig()
		},
		methods: {
			...mapMutations(['setInitData']),
			async initInfo() {
				try {
					let res = await init()
					if (res && res.code === 0) {
						res.result.status = this.isManual ? 1 : 0
						this.setInitData(res.result)
						res.result.status ? this.goHome() : this.goSimpleHome()
					} else {
						throw new Error()
					}
				} catch (e) {
					console.log(e)
					this.info = '启动失败,请稍候重试...'
				}
			},
			goHome() {
				uni.redirectTo({
					url: '../../pages/home_page/home_page',
					animationType: 'pop-in'
				})
			},
			goSimpleHome() {
				uni.redirectTo({
					url: '../../pages/home_page_simple/home_page_simple',
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
