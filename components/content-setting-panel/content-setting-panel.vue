<template>
	<view class="content-setting" @click="closePanel">
		<view class="add-btn" v-if="!isExistShelf" :class="{'showAddBtn' : show,'hideAddBtn': !show}" @click.stop="handleAddToShelf">
			加入书架
		</view>

		<view class="reload-btn" :class="{'showReloadBtn' : show,'hideReloadBtn': !show}" @click.stop="handleReload">
			<uni-icons color="#e6e6e6" class="" size="20" type="reload" />
			<view class="desc">
				重新加载
			</view>
		</view>
		<view class="setting-item-container" @click.stop="stopPorp" :class="{'showPanel' : show,'hidePanel': !show}">
			<view class="item">
				<view class="label"> 字体： </view>
				<view class="btn-container">
					<view class="btn" @click="handleFontSizeChange(false)"> Aa- </view>
					<view class="btn" @click="handleFontSizeChange(true)"> Aa+ </view>
				</view>
				<view class="value"> {{config.fontSize}} </view>
			</view>

			<view class="item">
				<view class="label"> 行高： </view>
				<view class="lineheight-btn-container">
					<view class="btn" @click="handleLineHigheChange(false)">
						<image height="30" width="30" src="../../static/images/other/line_height_small.svg" mode="scaleToFill"></image>
					</view>
					<view class="btn" @click="handleLineHigheChange(true)">
						<image height="30" width="30" src="../../static/images/other/line_height_big.svg" mode="scaleToFill"></image>
					</view>
				</view>
				<view class="value"> {{config.lineHeight}} </view>
			</view>

			<view class="item">
				<view class="label"> 亮度： </view>
				<view class="slider-container ">
					<slider block-size="18" :value="light" @change="lightSliderChange" step="1" activeColor="#007AFF" min="0" max="100" />
				</view>
				<view class="value">
					{{light}}
				</view>
			</view>

			<view class="item">
				<view class="label"> 颜色： </view>
				<view class="colors-container ">
					<view class="color-item" v-for="item in keys" :key="item" :class="{'current': item === config.theme}" @click="handleThemeClick(item)">
						<view class="inner" :style="{'background': colors[item].bgColor}">

						</view>
					</view>
				</view>
			</view>

			<!-- <view class="item">
				<view class="label"> 阅读模式： </view>
				<view class="btn-container">
					<view :class="{'current' : config.readType === 1}" class="btn" @click="handleReadMode(1)"> 滚动 </view>
					<view :class="{'current' : config.readType === 2}" class="btn" @click="handleReadMode(2)"> 滑动 </view>
				</view>
			</view> -->
			<view class="item">
				<view class="option-btns">
					<view class="btn" @click="handleSwitchAction(1)"> 上一章 </view>
					<view class="btn" @click="handleSwitchAction(2)"> 目录 </view>
					<view class="btn" @click="handleSwitchAction(3)"> 下一章 </view>
					<view class="btn" v-if="book && book.soduUpdatePageUrl" @click="handleSwitchAction(4)"> 更新站点 </view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		colors as constColors,
		getConfig,
		saveConfig
	} from '../../utils/config.js'


	export default {
		props: {
			book: {
				type: Object,
				default: null
			},
			isExistShelf: { //是否已在书架中 默认是在
				type: Boolean,
				default: true
			}
		},
		data() {
			return {
				show: true,
				light: 100,
				colors: constColors,
				config: null
			};
		},
		computed: {
			keys() {
				return Object.keys(constColors)
			}
		},
		watch: {
			config: {
				handler(newValue, oldValue) {
					if (newValue) {
						try {
							saveConfig(newValue, () => {
								setTimeout(() => {
									this.$emit('updateConfig', newValue)
								}, 0)
							})
						} catch (e) {
							console.log(e)
						}

					}
				},
				deep: true
			}
		},
		created() {
			this.initData()
		},
		methods: {
			stopPorp(e) {
				e.stopPropagation()
			},
			// 初始化数据
			initData() {
				let that = this
				uni.getScreenBrightness({
					success: function(res) {
						that.light = (res.value * 100).toFixed(0)
					}
				})
				this.config = getConfig()
			},
			// 关闭面板
			closePanel() {
				this.show = false
				setTimeout(() => {
					this.$emit('close')
				}, 300)
			},
			handleTouchMove(e) {
				this.closePanel()
			},
			// 亮度
			lightSliderChange(value) {
				this.light = value.detail.value
				uni.setScreenBrightness({
					value: value.detail.value / 100
				})
			},
			// 字体大小
			handleFontSizeChange(isAdd) {
				if ((isAdd && this.config.fontSize >= 32) || (!isAdd && this.config.fontSize <= 16)) {
					return
				}
				isAdd ? this.config.fontSize++ : this.config.fontSize--
			},
			// 行高
			handleLineHigheChange(isAdd) {
				if ((isAdd && this.config.lineHeight >= 3) || (!isAdd && this.config.lineHeight <= 1)) {
					return
				}
				let temp = isAdd ? parseFloat(this.config.lineHeight) + 0.1 : parseFloat(this.config.lineHeight) - 0.1
				this.config.lineHeight = temp.toFixed(1)
			},
			// 颜色
			handleThemeClick(key) {
				this.config.theme = key
			},
			// 加入书架
			handleAddToShelf() {
				let book = Object.assign({}, this.book, {
					lastChapterName: this.book.chapterName,
					lastChapterUrl: this.book.sourceUrl
				})
				uni.$emit('addBookToShelf', book)
				this.$emit('addBookToShelf', this.book)
			},
			handleSwitchAction(key) {
				this.$emit('switchAction', key)
			},
			handleReload() {
				this.$emit('reload')
				this.closePanel()
			},
			handleReadMode(type) {
				this.config.readType = type
			}
		}
	}
</script>

<style lang="less">
	.content-setting {
		position: fixed;
		left: 0;
		right: 0;
		bottom: 0;
		top: 0;
		z-index: 99;
		// pointer-events:none;

		.add-btn {
			background: rgba(25, 25, 25, 0.95);
			height: 80upx;
			width: 160upx;
			position: absolute;
			bottom: 700upx;
			right: 0;
			background: rgba(25, 25, 25, 0.95);
			z-index: 99;
			border-radius: 38upx 0 0 38upx;
			font-size: 28upx;
			color: #e6e6e6;
			line-height: 80upx;
			text-align: center;
			padding-left: 15upx;
			// transform: translate3d(100%, 0, 0);
		}

		.reload-btn {
			background: rgba(25, 25, 25, 0.95);
			height: 80upx;
			width: 160upx;
			position: absolute;
			bottom: 800upx;
			left: 0;
			background: rgba(25, 25, 25, 0.95);
			z-index: 99;
			border-radius: 0 38upx 38upx 0;
			font-size: 28upx;
			color: #e6e6e6;
			line-height: 80upx;
			text-align: center;
			padding-right: 15upx;
			// transform: translate3d(100%, 0, 0);
			display: flex;
			justify-content: space-around;
			align-items: center;

		}

		.setting-item-container {
			position: absolute;
			width: 100vw;
			bottom: 0;
			background: rgba(25, 25, 25, 0.95);
			padding: 20upx 0;

			.item {
				color: #e6e6e6;
				font-size: 30upx;
				padding: 0upx 20upx 0 30upx;
				height: 80upx;
				display: flex;
				align-items: center;
				margin-bottom: 20upx;
				box-sizing: border-box;

				.label {
					width: 120upx;
				}

				.value {
					width: 110upx;
					text-align: center;
				}

				.btn-container {
					flex: 1;
					display: flex;
					align-items: center;
					justify-content: space-around;

					.btn {
						height: 60upx;
						width: 120upx;
						color: #e6e6e6;
						border: 1px solid #e6e6e6;
						border-radius: 10upx;
						display: inline-block;
						text-align: center;
						font-size: 30upx;
						line-height: 60upx;
						flex: 1;
						max-width: 120upx;
						margin-right: 15upx;
						box-sizing: border-box;
					}

					.current {
						border-color: #007AFF;
						color: #007AFF;
					}

				}

				.lineheight-btn-container {
					flex: 1;
					display: flex;
					color: white;
					align-items: center;
					justify-content: space-around;

					.btn {
						height: 60upx;
						width: 120upx;
						color: #e6e6e6;
						border: 1px solid #e6e6e6;
						border-radius: 10upx;
						display: inline-block;
						text-align: center;
						font-size: 30upx;
						line-height: 60upx;
						flex: 1;
						max-width: 120upx;
						margin-right: 15upx;
						display: flex;
						align-items: center;
						justify-content: center;
					}

					image {
						height: 40upx;
						width: 40upx;
						color: #e6e6e6;
					}
				}

				.slider-container {
					flex: 1;
				}

				.colors-container {
					flex: 1;
					display: flex;
					justify-content: space-around;
					align-items: center;

					.color-item {
						border-radius: 50%;
						border: 4px solid transparent;

						.inner {
							height: 50upx;
							width: 50upx;
							border-radius: 50%;
							border: 1px solid #C0C0C0;
						}

						&.current {
							border: 4px solid #007AFF;
						}
					}
				}

				.option-btns {
					flex: 1;
					height: 100%;
					display: flex;
					justify-content: space-around;
					align-items: center;

					.btn {
						font-size: 28upx;
						height: 60upx;
						width: 140upx;
						color: #e6e6e6;
						border: 1px solid #e6e6e6;
						border-radius: 10upx;
						display: inline-block;
						text-align: center;
						line-height: 60upx;
						display: flex;
						align-items: center;
						justify-content: center;
					}
				}
			}
		}
	}

	.showPanel {
		animation: showSetting 300ms forwards;
	}

	.hidePanel {
		animation: hideSetting 300ms forwards;
	}

	@keyframes showSetting {
		from {
			transform: translate3d(0, 100%, 0);
		}

		to {
			transform: translate3d(0, 0, 0);
		}
	}

	@keyframes hideSetting {
		from {
			transform: translate3d(0, 0, 0);
		}

		to {
			transform: translate3d(0, 100%, 0);
		}
	}

	.showAddBtn {
		animation: showAddBtn 300ms forwards;
	}

	.hideAddBtn {
		animation: hideAddBtn 300ms forwards;
	}

	@keyframes showAddBtn {
		from {
			transform: translate3d(100%, 0, 0);
		}

		to {
			transform: translate3d(0, 0, 0);
		}
	}

	@keyframes hideAddBtn {
		from {
			transform: translate3d(0, 0, 0);
		}

		to {
			transform: translate3d(100%, 0, 0);
		}
	}


	.showReloadBtn {
		animation: showReloadBtn 300ms forwards;
	}

	.hideReloadBtn {
		animation: hideReloadBtn 300ms forwards;
	}

	@keyframes showReloadBtn {
		from {
			transform: translate3d(-100%, 0, 0);
		}

		to {
			transform: translate3d(0, 0, 0);
		}
	}

	@keyframes hideReloadBtn {
		from {
			transform: translate3d(0, 0, 0);
		}

		to {
			transform: translate3d(-100%, 0, 0);
		}
	}
</style>
