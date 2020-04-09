<template>
	<view class="book-item-container" @click="handleItemClick">
		<view class="top">
			<view class="name-contaienr">
				<text class="name">
					{{book.chapterName}}
				</text>
			</view>
		</view>

		<view class="bottom">
			<view class="source-name">
				{{book.lyWeb}}
			</view>
			<text class="time">
				{{book.updateTime}}
			</text>
		</view>
	</view>
</template>

<script>
	import {
		encodeUTF8
	} from '../../utils/encode.js'
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
				uni.navigateTo({
					url: '../content_page/content_page?book=' + encodeUTF8(JSON.stringify(this.book)),
					animationDuration: 200,
					animationType: 'slide-in-bottom'
				})
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
		padding: 20upx 20upx 0upx 20upx;
		box-sizing: border-box;
		line-height: 40upx;
		font-size: 26upx;
		overflow: hidden;

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

		.top {
			display: flex;
			align-items: center;


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
		}

		.bottom {
			display: flex;
			color: #888;
			line-height: 80upx;
			font-weight: 300;
			overflow: hidden;

			.source-name {
				flex: 1;
				word-break: keep-all;
				/* 不换行 */
				white-space: nowrap;
				/* 不换行 */
				overflow: hidden;
				/* 内容超出宽度时隐藏超出部分的内容 */
				text-overflow: ellipsis;
				/* 当对象内文本溢出时显示省略标记(...) ；需与overflow:hidden;一起使用。*/
			}

			.time {
				width: 240upx;
				color: #909090;
				font-weight: 300;
				text-align: right;
			}

		}
	}
</style>
