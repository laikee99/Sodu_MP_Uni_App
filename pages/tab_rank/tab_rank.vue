<template>
	<view class="tab-rank">
		<BookItem v-for="(item) in books" :key="item.bookId" :book="item" />
	</view>
</template>

<script>
	import {
		getRanks
	} from '../../api/sodu.js'
	import BookItem from '../../components/BookItem/BookItem.vue'
	export default {
		components: {
			BookItem
		},
		data() {
			return {
				books: [],
				page: -1
			};
		},
		watch: {
			page(newValue, oldValue) {
				uni.setNavigationBarTitle({
					title: `排行榜（${this.page}/8）`
				})
			}
		},
		mounted() {
			this.initBooks(1)
		},
		onReachBottom() {
			this.initBooks(this.page + 1)
		},
		onPullDownRefresh() {
			this.initBooks(1, true).then(() => {
				uni.stopPullDownRefresh()
			})
		},
		methods: {
			async initBooks(page = 1, isRefresh = false) {
				if (page > 8) {
					return
				}
				try {
					uni.showLoading()
					let res = await getRanks(page)
					if (res.code === 0) {
						this.books = isRefresh ? res.result : this.books.concat(res.result)
						this.page = page
					} else {
						uni.showToast({
							title: res.message
						})
					}
				} catch (e) {
					//TODO handle the exception
				} finally {
					uni.hideLoading()
				}
			}
		}
	}
</script>

<style lang="less">
	.tab-rank {}
</style>
