<template>
	<view class="mask" :class="mask == 'true' || mask == true ? 'mask-show' : ''" @click="Mclose" @touchmove.stop.prevent="preventTouchMove">
		<view class="loading">
			<image class="img" src="../../static/images/other/tail-spin.svg" mode="scaleToFill"></image>
		</view>
		<view class="title">{{text}}</view>
	</view>
	<!-- 遮罩层-->
</template>

<script scoped="true">
	import loading from '@/components/w-loading/loading5.vue';
	export default {
		name: "w-loading",
		components: {
			loading
		},
		props: {
			text: String,
			mask: Boolean | String,
			click: Boolean | String,
		},
		data() {
			return {};
		},
		methods: {
			preventTouchMove() {
				console.log('stop user scroll it!');
				return;
			},
			Mclose() {
				if (this.click == 'false' || this.click == false) {
					this.show = false
				}
			}
		}
	};
</script>

<style lang="less">
	.mask {
		/* pointer-events: none; */
		position: fixed;
		z-index: 99999;
		top: 40%;
		left: 50%;
		right: 0;
		bottom: 0;
		height: 110px;
		width: 100px;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		flex-wrap: wrap;
		border-radius: 6px;
		transform: translate(-50%, -50%);
		padding-top: 10upx;
	}

	.mask.mask-show {
		background: rgba(7, 17, 27, .8);
	}

	.title {
		color: #fff;
		font-size: 28upx;
		margin-top: 30upx;
		font-weight: 300;
	}

	.loading {
		height: 42px;
		width: 42px;
		.img {
			height: 100%;
			width: 100%;
		}
	}

	.shadow {
		width: 124upx;
		height: 35upx;
		background: rgba(0, 0, 0, 0.2);
		border-radius: 60upx / 22upx;
		display: block;
		margin: 0 auto;
		-webkit-transform: scaleY(0.7) translateY(30upx);
		transform: scaleY(0.7) translateY(30upx);
		-webkit-animation: shad 2s ease-in infinite alternate;
		animation: shad 2s ease-in infinite alternate;
	}

	@-webkit-keyframes shad {
		to {
			-webkit-transform: scaleX(0.9) scaleY(0.7) translateY(30upx);
			transform: scaleX(0.9) scaleY(0.7) translateY(30upx);
		}
	}

	@keyframes shad {
		to {
			-webkit-transform: scaleX(0.9) scaleY(0.7) translateY(30upx);
			transform: scaleX(0.9) scaleY(0.7) translateY(30upx);
		}
	}
</style>
