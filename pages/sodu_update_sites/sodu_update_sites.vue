<template>
	<view class="tab-rank">
		<BookItem v-for="(item,index) in books" :key="index" :book="item" />
		<wLoading v-if="isLoading" class="loading-container" text="加载中..." mask="true" click="false"></wLoading>
	</view>
</template>

<script>
	import {
		getUpdateSites
	} from '../../api/sodu.js'
	import {
		decodeUTF8
	} from '../../utils/encode.js'
	import BookItem from '../../components/UpdateSiteItem/UpdateSiteItem.vue'
	import wLoading from '@/components/w-loading/w-loading.vue';
	export default {
		components: {
			BookItem,
			wLoading
		},
		data() {
			return {
				books: [],
				page: -1,
				book: null,
				totalPage: 1,
				isLoading: false
			};
		},
		watch: {
			page(newValue, oldValue) {
				uni.setNavigationBarTitle({
					title: `${this.book.name}（${this.page}/${this.totalPage}）`
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
			this.initBooks(1, true)
			uni.stopPullDownRefresh()
		},
		onLoad: function(option) {
			this.book = JSON.parse(decodeUTF8(option.book))
			uni.setNavigationBarTitle({
				title: `${this.book.name}`
			})
		},
		methods: {
			async initBooks(page = 1, isRefresh = false) {
				if (page > this.totalPage || this.$store.state.status === 0) {
					return
				}
				try {
					this.isLoading = true
					let res = await getUpdateSites(this.book.soduUpdatePageUrl, this.book.bookId, page)
					if (res.code === 0) {
						this.books = isRefresh ? res.result.books : this.books.concat(res.result.books)
						this.totalPage = res.result.totalPage
						this.page = parseInt(res.result.currentPage)
						this.books.forEach(e => e.name = this.book.name)
					} else {
						uni.showToast({
							title: res.message
						})
					}
				} catch (e) {
					console.log(e)
					//TODO handle the exception
				} finally {
					this.isLoading = false
				}
			}
		}
	}
</script>

<style lang="less">
	.tab-rank {}
</style>
