<template>
	<view class="sync-page-container">
		<view class="form-container">
			<view class="form-item">
				<view class="label">
					WebDAV服务器
				</view>
				<input type="text" placeholder="请输入WebDav服务器地址" v-model="config.server" maxlength="100" />
			</view>
			<view class="form-item">
				<view class="label">
					用户名
				</view>
				<input type="text" placeholder="请输入用户名" v-model="config.userName" maxlength="20" />
			</view>
			<view class="form-item">
				<view class="label"> 密码 </view>
				<input type="password" placeholder="请输入密码" v-model="config.passWord" maxlength="20" />
			</view>
		</view>

		<view class="btn-container">
			<view class="btn" @click="handleUpload">
				上传
			</view>
			<view class="btn" @click="handleDownload">
				下载
			</view>
		</view>
		<view class="desc">
			说明：小程序服务器只做数据转发，且只读写用户书架数据。不会读取您的其他信息，亦不会存储您输入的任何信息。该功能是实验性功能，可能会出现同步失败或错误等情况，敬请谅解。
		</view>
		<Loading v-if="isLoading" class="loading-container" :text="loadingText" mask="true" click="false"></Loading>
	</view>
</template>

<script>
	import {
		upload,
		download,
		getConfig,
		saveConfig
	} from '../../api/sync.js'
	import {
		saveBooks
	} from '../../utils/bookShelf.js'
	export default {
		components: {},
		data() {
			return {
				isLoading: false,
				loadingText: '加载中...',
				config: {
					server: '',
					userName: '',
					passWord: ''
				}
			};
		},
		onLoad() {
			let res = getConfig()
			if (res) {
				this.config = Object.assign(this.config, res)
			}
			console.log(res)
		},
		methods: {
			checkConfig() {
				if (!this.config.server || !this.config.userName || !this.config.passWord) {
					uni.showToast({
						title: '请输入相关信息后，再执行同步操作',
						duration: 2000,
						icon: "none"
					})
					return false
				}
				return true
			},
			handleDownload() {
				let that = this
				if (!this.checkConfig()) {
					return
				}
				saveConfig(this.config)
				uni.showModal({
					title: '提示',
					content: '下载云端数据，本地书架数据将被清空，确定下载？',
					success: function(res) {
						if (res.confirm) {
							that.downloadAction()
						} else if (res.cancel) {
							return
						}
					}
				});
			},
			async downloadAction() {

				try {
					this.loadingText = '下载中...'
					this.isLoading = true
					let res = await download(this.config)
					if (res.code === 0) {
						saveBooks(res.result, () => {
							uni.showToast({
								icon: 'success',
								title: '下载成功',
								duration: 2000
							})
							uni.$emit('updateBookShelf')
						})
					} else {
						throw new Error(res.message)
					}
				} catch (e) {
					console.log(e)
					uni.showToast({
						icon: 'none',
						title: e.message,
						duration: 2000
					})
				} finally {
					this.isLoading = false
				}
			},
			async handleUpload() {
				if (!this.checkConfig()) {
					return
				}
				try {
					this.isLoading = true
					saveConfig(this.config)
					let res = await upload(this.config)
					if (res.code === 0) {
						uni.showToast({
							icon: 'success',
							title: '上传成功',
							duration: 2000

						})
					} else {
						throw new Error(res.message)
					}
				} catch (e) {
					uni.showToast({
						icon: 'none',
						title: e.message,
						duration: 2000
					})
				} finally {
					this.isLoading = false
				}

			}
		}
	}
</script>

<style lang="less">
	.sync-page-container {
		background-color: #f0f3f6;
		min-height: 100vh;

		.form-container {
			.form-item {
				display: flex;
				background-color: white;
				height: 88upx;
				align-items: center;
				padding: 0 30upx;
				font-size: 28upx;
				position: relative;

				.label {
					color: #323233;
					width: 210upx;
					line-height: 88upx;
					// text-align: right;
				}

				input {
					flex: 1;
					font-weight: 300;
					font-size: 28upx;
				}

				&:not(:last-child):before {
					content: " ";
					position: absolute;
					left: 30upx;
					bottom: 0;
					right: 0;
					height: 1upx;
					border-bottom: 1upx solid #dbdbdb;
					-webkit-transform-origin: 0 0;
					transform-origin: 0 0;
					-webkit-transform: scaleY(0.5);
					transform: scaleY(0.5);
				}

			}
		}

		.btn-container {
			height: 100upx;
			display: flex;
			justify-content: center;
			align-items: center;
			padding: 30upx;

			.btn {
				height: 68upx;
				width: 150upx;
				display: flex;
				align-items: center;
				justify-content: space-evenly;
				background-color: #0387FE;
				color: white;
				font-size: 28upx;
				border-radius: 8upx;
				margin: 30upx;
			}

		}

		.desc {
			color: #333333;
			font-weight: 300;
			text-indent: 2em;
			padding: 30upx;
			line-height: 60upx;
			font-size: 28upx;
		}
	}
</style>
