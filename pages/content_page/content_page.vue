<template>
	<view>
		<view class="root" :style="contentStyle">
			<view class="nav-bar-container">
				<uniNavBar :title=" book.name" :backgroundColor="config.bgColor" shadow="false"></uniNavBar>
			</view>
			<view class="outer" :style="{'height': `calc(100vh - ${navBarHeight}px - 35px)`}" @click="handleSettingClick">
				<view class="inner">
					<scrollContent :book="book" :content="currentCatalog.content" :height="`calc(100vh - ${navBarHeight}px - 35px)`"
					 @switchAction="handleSwitchAction"></scrollContent>
				</view>
			</view>
			<view class="bottom">
				{{currentCatalog ? currentCatalog.name : ''}}
			</view>
			<Setting v-if="showSettingPanel" :book="book" @close="handleCloseSettingPanel" @updateConfig="handleUpdateConfig"
			 @switchAction="handleSwitchAction" />

		</view>
		<Bookinfo v-if="showBookInfoPanel" :info="bookInfo" :book="book" :style="contentStyle" @close="handleSwitchCatalog" />
	</view>
</template>

<script>
	import uniNavBar from '@/components/uni-nav-bar/uni-nav-bar.vue';
	import scrollContent from '../../components/scroll-content/scroll-content.vue'
	import Setting from '../../components/content-setting-panel/content-setting-panel.vue'
	import Bookinfo from '../../components/book-info-panel/book-info-panel.vue'
	import {
		getContent,
		getBookInfo
	} from '@/api/content.js'
	import {
		getConfig,
		colors
	} from '../../utils/config.js'
	import {
		decodeUTF8,
		encodeUTF8
	} from '../../utils/encode.js'
	export default {
		components: {
			uniNavBar,
			Setting,
			scrollContent,
			Bookinfo
		},
		data() {
			return {
				navBarHeight: 44 + uni.getSystemInfoSync().statusBarHeight,
				clientWidth: uni.getSystemInfoSync().screenWidth,
				clientHeight: uni.getSystemInfoSync().screenHeight,
				showSettingPanel: false,
				isLoading: false,
				isRequestBookInfo: false,
				book: null,
				config: null,
				currentCatalog: null,
				bookInfo: null,
				showBookInfoPanel: false
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
			}
		},
		created() {
			this.config = getConfig()
		},
		onLoad(option) {
			if (option.book) {
				this.book = JSON.parse(decodeUTF8(option.book))
			} else {
				this.book = {
					bookId: "729376",
					chapterName: "第三百二十六章 野心勃勃",
					lyWeb: "乐安宣书网",
					name: "绝对一番",
					soduUpdatePageUrl: "https://www.sodu2020.com/mulu_729376.html",
					sourceUrl: "https://www.sqsxs.com/book/292/292915/92041834.html",
					updateTime: "2020/03/31 06:16"
				}
			}
			this.requestCurrentCatalog({
				name: this.book.chapterName,
				url: this.book.sourceUrl,
				content: ''
			}, true)
			// 请求目录
			this.requestBookInfo(this.book.sourceUrl)
		},
		methods: {
			// 加载当前目录数据
			async requestCurrentCatalog(item, time = 0) {
				if (item.content) {
					this.currentCatalog = item
				} else {
					let res = await this.requestContent(item.url, true)
					if (res) {
						item.content = res
						this.currentCatalog = item
					} else {
						if (time < 3) {
							this.requestCurrentCatalog(item, time++)
						}
					}
				}
				if (this.bookInfo) {
					this.preLoadNextCatalogs()
				}
			},
			async requestContent(url, showLoading = false) {
				try {
					if (showLoading) {
						uni.showLoading({
							title: '加载中...'
						})
						this.isLoading = true
					}
					let res = await getContent(url)
					if (res.code === 0) {
						return res.result
					} else {
						return null
					}
				} catch (e) {
					return null
				} finally {
					if (showLoading) {
						uni.hideLoading()
						this.isLoading = false
					}
				}
			},
			async requestBookInfo(url, time = 0) {
				try {
					this.isRequestBookInfo = true
					let res = await getBookInfo(url)
					if (res.code === 0) {
						this.bookInfo = res.result
						if (this.currentCatalog.content) {
							let index = this.bookInfo.catalogs.findIndex(e => e.url === this.currentCatalog.url)
							if (index > -1) {
								this.bookInfo.catalogs[index].content = this.currentCatalog.content
								this.currentCatalog.index = index
							}
						}
						this.preLoadNextCatalogs()
					} else {
						if (time < 3) {
							this.requestBookInfo(uri, time++)
						}
					}
				} catch (e) {
					this.bookInfo = null
				} finally {
					this.isRequestBookInfo = false
				}
			},
			// 预加载接下来2章内容
			preLoadNextCatalogs() {
				let index = this.bookInfo.catalogs.findIndex(e => e.url === this.currentCatalog.url)
				if (index === -1) {
					return
				}
				if (index < this.bookInfo.catalogs.length - 1) {
					let list = this.bookInfo.catalogs.slice(index + 1, index + 3)
					list.forEach(e => {
						if (!e.content) {
							this.requestContent(e.url).then(res => {
								e.content = res
							})
						}
					})
				}
			},
			handleSettingClick(e) {
				if (e.detail.x < this.clientWidth * 1 / 4 || e.detail.x > this.clientWidth * 3 / 4) {
					return
				}
				if (e.detail.y < this.clientHeight * 1 / 5 || e.detail.y > this.clientHeight * 4 / 5) {
					return
				}
				this.showSettingPanel = true
			},
			handleCloseSettingPanel() {
				this.showSettingPanel = false
			},
			handleUpdateConfig(newValue) {
				this.config = newValue
			},
			//  1：上一章  2： 目录 3：下一章 4：更新章节
			handleSwitchAction(key) {
				this.handleCloseSettingPanel()
				if (this.isLoading) {
					return
				}
				if (key < 4 && !this.bookInfo) {
					uni.showToast({
						title: '暂无章节数据，请稍候',
						icon: 'none',
						duration: 2000
					})
					return
				}
				switch (key) {
					case 1:
						this.handlePreChapter()
						break;
					case 2:
						this.goToBookInfoPage()
						break;
					case 3:
						this.handleNextChapter()
						break;
					case 4:
						this.goToUpdatePage()
						break;
				}
			},
			goToUpdatePage() {
				let url = '../../pages/sodu_update_sites/sodu_update_sites'
				uni.redirectTo({
					url: url + `?book=${encodeUTF8(JSON.stringify(this.book))}`,
					animationType: 'pop-in',
					animationDuration: 200
				})
			},
			// 打开目录
			goToBookInfoPage() {
				this.showBookInfoPanel = true
			},
			// 上一章
			handlePreChapter() {
				let index = this.currentCatalog.index
				if (index === 0) {
					this.goToBookInfoPage()
				} else {
					let item = this.bookInfo.catalogs[index - 1]
					this.handleSwitchCatalog(item)
				}
			},
			// 下一章
			handleNextChapter() {
				let index = this.currentCatalog.index
				if (index === this.bookInfo.catalogs.length - 1) {
					this.goToBookInfoPage()
				} else {
					this.handleSwitchCatalog(this.bookInfo.catalogs[index + 1])
				}
			},
			//关闭目录
			handleSwitchCatalog(item) {
				this.showBookInfoPanel = false
				if (item) {
					let temp = this.bookInfo.catalogs[item.index]
					this.requestCurrentCatalog(temp)
				}
			}
		}
	}
</script>
<style lang="less" scoped>
	.root {
		position: fixed;
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100vh;
		overflow-x: hidden;
		overflow-y: hidden;
		display: flex;
		flex-direction: column;
		z-index: 99;

		.outer {
			flex: 1;

			.inner {
				height: 100%;
			}
		}

		.bottom {
			width: 100vw;
			background: inherit;
			height: 35px;
			font-size: 24upx;
			display: flex;
			align-items: center;
			padding-left: 30upx;
		}
	}
</style>
