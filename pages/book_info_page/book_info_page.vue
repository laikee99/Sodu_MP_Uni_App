<template>
	<view class="book-info-container" :style="contentStyle">
		<uniNavBar :title="book.name" :backgroundColor="themeValue.bgColor" shadow="false"></uniNavBar>
		<scroll-view scroll-y style="height: 100upx;padding-bottom: 150upx;" class="list-container" :scroll-top="scrollTop"
		 @scroll="handleScroll">
			<view class="book-info">
				<view class="item name">
					{{book ? book.name : '--'}}
				</view>
				<view class="item">
					作者：{{storeBookInfo ? storeBookInfo.author : '--'}}
				</view>
				<view class="item">
					来源网站：{{storeBookInfo ? storeBookInfo.webName : '--'}}
				</view>
				<text class="item">
					简介：{{storeBookInfo ? storeBookInfo.desc : '--'}}
				</text>
			</view>
			<view v-for="(item,index) in currentList" class="chapter-item" :key="item.url" @click="handleItemClick(item)">
				<view class="chapter-name">
					{{item.name}}
				</view>
			</view>
		</scroll-view>
		<view class="btn-contaienr" :style="{'background' : themeValue.bgColor}">
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
		<Loading v-if="isLoading" class="loading-container" text="加载中..." mask="true" click="false"></Loading>
	</view>
</template>

<script>
	import uniNavBar from '@/components/uni-nav-bar/uni-nav-bar.vue';
	import {
		decodeUTF8,
		encodeUTF8
	} from '../../utils/encode.js'
	import {
		getConfig,
		colors
	} from '../../utils/config.js'
	import {
		mapState,
		mapMutations
	} from 'vuex'
	import {
		getBookInfo
	} from '@/api/content.js'

	export default {
		components: {
			uniNavBar
		},
		watch: {
			show(newValue, oldValue) {
				this.className = newValue ? 'show-panel' : 'hide-panel'
			}
		},
		data() {
			return {
				isLoading: false,
				scrollTop: 0,
				navBarHeight: 44 + uni.getSystemInfoSync().statusBarHeight,
				book: null,
				config: null,
				themeValue: null,
				allList: [],
				currentList: [],
				pageIndex: 0
			};
		},
		computed: {
			contentStyle() {
				let themeValue = colors[this.config.theme]
				let style =
					`color: ${themeValue.color};` +
					`background: ${themeValue.bgColor};` +
					`line-height: ${this.config.lineHeight};` +
					`font-size: ${this.config.fontSize}px;`
				return style
			},
			...mapState(['storeBookInfo'])
		},
		onLoad(option) {
			if (!option.book) {
				return
			}
			this.book = JSON.parse(decodeUTF8(option.book))
			if (this.book.fromSearch && this.book.type === 1) {
				this.initBookinfo()
			} else {
				this.splitCatalogs()
			}
		},
		created() {
			this.config = getConfig()
			this.themeValue = colors[this.config.theme]
		},
		methods: {
			...mapMutations(['setBookInfo']),
			async initBookinfo() {
				try {
					this.isLoading = true
					let res = await getBookInfo(this.book.bookInfoUrl, 1)
					if (res.code === 0) {
						this.setBookInfo(res.result)
						this.splitCatalogs()
					}
				} catch (e) {
					//TODO handle the exception
				} finally {
					this.isLoading = false
				}
			},
			splitCatalogs() {
				if (!this.storeBookInfo || !this.storeBookInfo.catalogs || this.storeBookInfo.catalogs.length === 0) {
					return
				}
				let temp = []
				let length = this.storeBookInfo.catalogs.length
				this.storeBookInfo.catalogs.forEach((e, index) => {
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
			handleItemClick(item) {
				if (this.book.fromSearch) {
					let url = '../../pages/content_page/content_page'
					this.book.sourceUrl = item.url
					this.book.chapterName = item.name
					delete this.book.fromSearch
					delete this.book.type
					uni.redirectTo({
						url: url + `?book=${encodeUTF8(JSON.stringify(this.book))}`,
						animationType: 'pop-in',
						animationDuration: 200
					})
				} else {
					uni.$emit('navigateToCatalog', item)
					uni.navigateBack()
				}
			},
			handleScroll(e) {
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
				this.scrollTop = 2000000
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
		background: inherit;
		min-height: 100vh;
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

		.list-container {
			flex: 1;
			background: inherit;


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
			height: 140upx;
			display: flex;
			align-items: center;
			justify-content: space-around;
			z-index: 999;
			padding-bottom: 20upx;
			box-sizing: border-box;

			.btn {
				line-height: 60upx;
				height: 60upx;
				font-size: 28upx;
				border-radius: 5upx;
				border: 1px solid #c4c4c4;
				background-color: rgba(255, 255, 255, 0.8);
				min-width: 100upx;
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
