<template>
	<view class="book-item-container" @click="handleItemClick" @longpress="handLongPress">
		<view v-if="book && book.isEdit" class="checkbox-container">
			<checkbox :checked="book.isSelected" style="transform:scale(0.75)" /><text></text>
		</view>
		<view class="main-container">
			<view class="top">
				<view class="name-contaienr">
					<text class="name">
						{{book.name}}
					</text>
					<view v-if="book.hasNew" class="new" />
					<view v-if="book.isLoading" class="loading">
						<image src="../../static/images/other/tail-spin.svg" mode="scaleToFill"></image>
					</view>
				</view>
				<text class="time">
					{{book.updateTime}}
				</text>
			</view>
			<view class="bottom">
				{{book.chapterName}}
			</view>

		</view>
	</view>
</template>

<script>
	export default {
		props: {
			book: {
				type: Object,
				default: null
			}
		},
		data() {
			return {

			};
		},
		methods: {
			handleItemClick() {
				if (this.isEdit) {
					this.book.isSelected = !this.book.isSelected
				} else {
					let url = '../../pages/sodu_update_sites/sodu_update_sites'
					uni.navigateTo({
						url: url + `?book=${JSON.stringify(this.book)}`,
						animationType: 'pop-in',
						animationDuration: 200
					})
				}
			},
			handLongPress() {
				this.$emit('itemLongPress', this.book)
			}
		}
	}
</script>

<style lang="less">
	.book-item-container {
		height: 150upx;
		width: 100%;
		overflow: hidden;
		position: relative;
		display: flex;
		padding: 20upx 20upx 0upx 20upx;
		align-items: center;
		box-sizing: border-box;

		.checkbox-container {
			width: 80upx;
		}

		.main-container {
			flex: 1;
			line-height: 40upx;
			font-size: 26upx;
			overflow: hidden;

			.top {
				display: flex;
				align-items: center;

				.time {
					width: 240upx;
					color: #909090;
					font-weight: 300;
					text-align: right;
				}

				.name-contaienr {
					display: flex;
					flex: 1;
					align-items: center;
					overflow: hidden;
				}

				.name {
					font-size: 30upx;
					word-break: keep-all;
					/* 不换行 */
					white-space: nowrap;
					/* 不换行 */
					overflow: hidden;
					/* 内容超出宽度时隐藏超出部分的内容 */
					text-overflow: ellipsis;
					/* 当对象内文本溢出时显示省略标记(...) ；需与overflow:hidden;一起使用。*/
				}

				.new {
					flex-shrink: 0;
					height: 50upx;
					width: 60upx;
					background: url(../../static/images/other/new.png) no-repeat;
					background-size: 100% 100%;
					margin-left: 15upx;
				}

				.loading {
					height: 35upx;
					width: 40upx;
					margin-left: 10upx;

					image {
						height: 35upx;
						width: 35upx;
					}
				}
			}

			.bottom {
				color: #888;
				line-height: 80upx;
				font-weight: 300;
				word-break: keep-all;
				/* 不换行 */
				white-space: nowrap;
				/* 不换行 */
				overflow: hidden;
				/* 内容超出宽度时隐藏超出部分的内容 */
				text-overflow: ellipsis;
				/* 当对象内文本溢出时显示省略标记(...) ；需与overflow:hidden;一起使用。*/
			}
		}

		&:before {
			content: " ";
			position: absolute;
			left: 0;
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
</style>
