<template>
	<view class="swiper-content" @click="handleClick">
		<swiper class="swiper" :current="current" :duration="duration" @change="handleChange">
			<swiper-item v-for="(page,index) in pages" :item-id="index" :key="index" class="swiper-item" :id="index">
				<view class="swiper-page">
					<view v-for="line in page" :key="line">
						{{line}}
					</view>
				</view>
			</swiper-item>
		</swiper>

		<view class="page-info">
			{{myCurrent +  1}}/{{pages.length}}
		</view>
	</view>
</template>

<script>
	import uniIcons from "../uni-icons/uni-icons.vue";
	export default {
		components: {
			uniIcons
		},
		props: {
			book: {
				type: Object,
				default: null
			},
			content: {
				type: Array,
				default: () => []
			},
			config: {
				type: Object,
				default: null
			}
		},
		data() {
			return {
				indicatorDots: false,
				autoplay: false,
				duration: 300,
				pageWidth: 0,
				pageHeight: 0,
				pages: [
					[]
				],
				current: 0,
				myCurrent: 0,
				loading: false
			};
		},
		watch: {
			content(newValue, oldValue) {
				if (newValue) {
					this.splitPages()
				}
			},
			config(newValue, oldValue) {
				if (newValue.fontSize !== oldValue.fontSize || newValue.lineHeight !== oldValue.lineHeight) {
					this.splitPages()
				}
			}
		},
		mounted() {
			this.$nextTick(function() {
				this.initPageSize(() => {
					this.splitPages()
				})
			})
		},
		methods: {
			initPageSize(cb) {
				uni.createSelectorQuery().in(this).select('.swiper-page').boundingClientRect(result => {
					this.pageWidth = result.width
					this.pageHeight = result.height
					cb()
				}).exec();
			},
			splitPages() {
				this.loading = true
				let pages = []
				let fontsize = this.config.fontSize
				let lineHeight = (this.config.lineHeight * fontsize).toFixed(2)
				let perLine = Math.floor(this.pageWidth / fontsize)
				let lineCount = ((this.pageHeight / lineHeight) % 1) > 0.8 ? Math.ceil(this.pageHeight / lineHeight) : Math.floor(
					this.pageHeight /
					lineHeight)
				let page = []
				let line = ''
				let paragraphNum = this.content.length
				this.content.forEach((e, num) => {
					try {
						let paragraph = e.split('')
						let length = paragraph.length
						paragraph.forEach((word, index) => {
							if (index === 0) {
								line += '　　'
							}
							line += word
							if (index === length - 1 || line.length === perLine) {
								page.push(line)
								line = ''
							}
							if (page.length === lineCount) {
								pages.push(page)
								page = []
							}
						})
						if (num === paragraphNum - 1) {
							pages.push(page)
						}
					} catch (error) {
						console.log(error)
					}

				})

				this.switchToPage(0)
				this.$nextTick(function() {
					this.pages = pages
					this.duration = 300
					this.loading = false
				})
			},
			handleChange(e) {
				this.myCurrent = e.detail.current
			},
			switchToPage(index) {
				this.current = this.myCurrent
				this.$nextTick(function() {
					this.current = index
					this.myCurrent = index
				})
			},
			handleClick(e) {
				if (e.detail.x < this.pageWidth * 1 / 4) {
					this.prePage()
				}
				if (e.detail.x > this.pageWidth * 3 / 4) {
					this.nextPage()
				}
			},
			nextPage() {
				if (this.myCurrent >= this.pages.length - 1) {
					this.nextCatalog()
				} else {
					this.switchToPage(this.myCurrent + 1)
				}
			},
			prePage() {
				if (this.myCurrent <= 0) {
					this.preCatalog()
				} else {
					this.switchToPage(this.myCurrent - 1)
				}
			},
			nextCatalog() {
				if (this.loading) {
					return
				}
				this.duration = 0
				this.$emit('switchAction', 3)
			},
			preCatalog() {
				if (this.loading) {
					return
				}
				this.duration = 0
				this.$emit('switchAction', 1)
			}
		}
	}
</script>

<style lang="less">
	.swiper-content {
		height: 100%;
		position: relative;

		swiper {
			height: 100%;
		}

		.swiper-item {
			height: 100%;
			padding: 10px 10px 20px 15px;
			box-sizing: border-box;

			.swiper-page {
				width: 100%;
				height: 100%;
			}
		}

		.page-info {
			position: fixed;
			bottom: 10px;
			left: 0;
			width: 100%;
			text-align: left;
			padding-left: 30upx;
			z-index: 999999;
			font-size: 12px;
			color: #808080;
		}
	}
</style>
