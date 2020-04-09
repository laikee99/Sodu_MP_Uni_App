<template>
	<!--pages/tab_setting/tab_setting.wxml-->
	<view class='tab_setting'>
		<view class='switch-container'>
			<view class="switch-item" @click="handleToHistory">
				<view class="switch-item-title">历史记录</view>
				<uniIcons type="arrowright"></uniIcons>
			</view>
			<view class="switch-item" @click="handleToSync">
				<view class="switch-item-title">同步个人书架(实验功能)</view>
				<uniIcons type="arrowright"></uniIcons>
			</view>
		</view>
		<view class="navigator-text" @click="handleDisclaimer">免责声明</view>
	</view>
</template>

<script>
	import uniIcons from '../../components/uni-icons/uni-icons.vue'
	export default {
		components: {
			uniIcons
		},
		data() {
			return {

			};
		},
		methods: {
			handleToSync() {
				uni.navigateTo({
					url: '../sync_shelf/sync_shelf',
					animationDuration: 200,
					animationType: 'pop-in'

				})
			},
			handleDisclaimer() {
				uni.navigateTo({
					url: '../disclaimer_page/disclaimer_page',
					animationDuration: 200,
					animationType: 'pop-in'

				})
			},
			handleToHistory() {
				uni.navigateTo({
					url: '../history_page/history_page',
					animationDuration: 200,
					animationType: 'pop-in'

				})
			}
		}
	}
</script>

<style lang="less" scoped>
	.tab_setting {
		min-height: 50vh;
		padding-bottom: 300upx;
		box-sizing: border-box;

		.switch-container {
			border-top: 1upx solid #d9d9d9;
			border-bottom: 1upx solid #d9d9d9;

			.switch-item {
				padding: 15px 15px;
				position: relative;
				display: flex;
				align-items: center;
				font-size: 30upx;
			}

			.switch-item:before {
				content: " ";
				position: absolute;
				top: 0;
				right: 0;
				height: 1px;
				border-top: 1upx solid #d9d9d9;
				left: 15px;
			}

			.switch-item:first-child:before {
				display: none;
			}

			.switch-item-title {
				flex: 1;
			}

			.uni-icons {
				display: inline-block;
				height: 40upx;
				width: 40upx;
				margin-right: 10upx;
			}
		}

		.navigator-text {
			text-align: center;
			margin-top: 60upx;
			color: #0387FE;
			font-size: 28upx;
		}
	}
</style>
