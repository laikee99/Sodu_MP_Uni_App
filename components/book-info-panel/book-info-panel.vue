<template>
	<view class="book-info-container" :class="[className]">
		<view class="nav-bar-container">
			<uniNavBar :title="book.name" :backgroundColor="config.bgColor" shadow="false" :customBack="true" @back="handlBackClick(item)"></uniNavBar>
		</view>
		<scroll-view scroll-y style="height: 100upx;padding-bottom: 100upx;" class="list-container" :scroll-top="scrollTop"
		 @scroll="handleScroll">
			<view class="book-info">
				<view class="item name">
					{{book.name}}
				</view>
				<view class="item">
					作者：{{info.author}}
				</view>
				<view class="item">
					来源网站：{{info.webName}}
				</view>
				<text class="item">
					简介：{{info.desc}}
				</text>
			</view>
			<view v-for="(item,index) in currentList" class="chapter-item" :key="item.url" @click="handleItemClick(item)">
				<view class="chapter-name">
					{{item.name}}
				</view>
			</view>
		</scroll-view>
		<view class="btn-contaienr">
			<view class="btn" @click="goTop">
				到顶部
			</view>
			<view class="btn" @click="handlePrePage">
				上一页
			</view>
			<view class="btn page">
				{{pageIndex + 1}} / {{allList.length}}
			</view>
			<view class="btn" @click="handleNextPage">
				下一页
			</view>
			<view class="btn" @click="goBottom">
				到底部
			</view>
		</view>
	</view>
</template>

<script>
	import uniNavBar from '@/components/uni-nav-bar/uni-nav-bar.vue';
	export default {
		components: {
			uniNavBar
		},
		props: {
			info: {
				type: Object,
				default: null
			},
			book: {
				type: Object,
				default: null
			}
		},
		watch: {
			show(newValue, oldValue) {
				this.className = newValue ? 'show-panel' : 'hide-panel'
			}
		},
		data() {
			return {
				navBarHeight: 44 + uni.getSystemInfoSync().statusBarHeight,
				show: false,
				className: '',
				scrollTop: 0,
				scrollBottom: 0,
				currentList: [],
				allList: [],
				pageIndex: 0
			};
		},
		created() {
			this.splitCatalogs()
		},
		mounted() {
			setTimeout(() => {
				this.show = true
			}, 0)
		},
		methods: {
			splitCatalogs() {
				if (!this.info || !this.info.catalogs || this.info.catalogs.length === 0) {
					return
				}
				let temp = []
				let length = this.info.catalogs.length
				this.info.catalogs.forEach((e, index) => {
					temp.push(e)
					if (temp.length === 100) {
						this.allList.push(temp)
						temp = []
					}
					if (index === length - 1) {
						this.allList.push(temp)
					}
				})

				this.currentList = this.allList[0]
			},
			handlBackClick(item) {
				this.show = false
				setTimeout(() => {
					this.$emit('close', item)
				}, 300)
			},
			handleItemClick(item) {
				this.handlBackClick(item)
			},
			handleScroll(e) {
				console.log(e)
				this.debounceScroll(e)
			},
			debounceScroll(e) {
				clearTimeout(this.timerId)
				this.timerId = setTimeout(() => {
					this.scrollTop = e.detail.scrollTop
				}, 1000)
			},
			goTop() {
				this.scrollTop = 0
			},
			goBottom() {
				this.scrollTop = 20000
			},
			handleNextPage() {
				if (this.pageIndex === this.allList.length - 1) {
					uni.showToast({
						title: '已经是最后一页',
						icon: 'none',
						duration: 2000
					})
					return
				}
				this.pageIndex = this.pageIndex + 1
				this.currentList = this.allList[this.pageIndex]
				setTimeout(() => {
					this.goTop()
				}, 0)
			},
			handlePrePage() {
				if (this.pageIndex === 0) {
					uni.showToast({
						title: '已经是第一页',
						icon: 'none',
						duration: 2000
					})
					return
				}
				this.pageIndex = this.pageIndex - 1
				this.currentList = this.allList[this.pageIndex]
				setTimeout(() => {
					this.goTop()
				}, 0)
			}
		}
	}
</script>

<style lang="less">
	.book-info-container {
		position: fixed;
		top: 0;
		left: 0;
		width: 100vw;
		height: 100vh;
		background-color: red;
		z-index: 1000;
		overflow-x: hidden;
		overflow-y: hidden;
		display: flex;
		flex-direction: column;
		background: inherit;
		transform: translateX(100%);

		.list-container {
			flex: 1;

			.book-info {
				padding: 20upx;
				position: relative;

				.item {
					min-height: 60upx;
					line-height: 60upx;
					font-size: 30upx;
					display: flex;

					&.name {
						height: 80upx;
						font-weight: 600;
						line-height: 80upx;
						font-size: 36upx;
					}

					&.desc {
						text-indent: 2em;
					}
				}

				&:before {
					content: " ";
					position: absolute;
					left: 0;
					bottom: 0;
					right: 0;
					height: 1upx;
					border-bottom: 1upx solid rgba(22, 22, 22, 0.2);
				}
			}

			.chapter-item {
				height: 80upx;
				position: relative;
				display: flex;
				padding-left: 30upx;
				font-size: 30upx;
				align-items: center;
				overflow: hidden;

				.index {
					width: 88upx;
				}

				.chapter-name {
					flex: 1;
					padding-right: 10upx;
					overflow: hidden;
					word-break: keep-all;
					/* 不换行 */
					white-space: nowrap;
					/* 不换行 */
					overflow: hidden;
					/* 内容超出宽度时隐藏超出部分的内容 */
					text-overflow: ellipsis;
					/* 当对象内文本溢出时显示省略标记(...) ；需与overflow:hidden;一起使用。*/
				}

				&:before {
					content: " ";
					position: absolute;
					height: 1upx;
					width: 100%;
					bottom: 0;
					left: 30upx;
					border-bottom: 1upx solid rgba(22, 22, 22, 0.2);
				}
			}
		}

		.btn-contaienr {
			position: fixed;
			width: 100vw;
			bottom: 0;
			left: 0;
			height: 100upx;
			display: flex;
			align-items: center;
			justify-content: space-around;
			z-index: 999;

			.btn {
				line-height: 60upx;
				height: 60upx;
				font-size: 28upx;
				border-radius: 5upx;
				border: 1px solid #c4c4c4;
				background-color: rgba(255, 255, 255, 0.8);
				width: 100upx;
				text-align: center;
				padding: 0 10upx;
				border-radius: 8upx;

			}

			.page {
				background-color: transparent;
				border: 0;
			}
		}
	}

	.show-panel {
		animation: show 300ms forwards;
	}

	.hide-panel {
		animation: hide 300ms forwards;
	}

	@keyframes show {
		from {
			transform: translateX(100%);
		}

		to {
			transform: translateX(0%);
		}
	}

	@keyframes hide {
		from {
			transform: translateX(0%);
		}

		to {
			transform: translateX(100%);
		}
	}
</style>
