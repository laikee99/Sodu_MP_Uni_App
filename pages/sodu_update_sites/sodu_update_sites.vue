<template>
	<view class="tab-rank">
		<BookItem v-for="(item,index) in books" :key="index" :book="item" />
	</view>
</template>

<script>
	import {
		getUpdateSites
	} from '../../api/sodu.js'
	import BookItem from '../../components/UpdateSiteItem/UpdateSiteItem.vue'
	export default {
		components: {
			BookItem
		},
		data() {
			return {
				books: [],
				page: -1,
				book: null,
				totalPage: 1
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
			this.initBooks(1, true).then(() => {
				uni.stopPullDownRefresh()
			})
		},
		onLoad: function(option) { //option为object类型，会序列化上个页面传递的参数
			// this.book = JSON.parse(option.book)
			this.book = {
				"bookId": "711501",
				"name": "衣手遮天",
				"chapterName": "第五三一章 大戏",
				"updateTime": "2020/03/28 11:32",
				"sourceUrl": "",
				"soduUpdatePageUrl": "https://www.sodu2020.com/mulu_711501.html"
			}
		},
		methods: {
			async initBooks(page = 1, isRefresh = false) {
				if (page > this.totalPage) {
					return
				}
				try {
					uni.showLoading()
					let res = await getUpdateSites(this.book.soduUpdatePageUrl, this.book.bookId, page)
					if (res.code === 0) {
						this.books = isRefresh ? res.result.books : this.books.concat(res.result.books)
						this.totalPage = res.result.totalPage
						this.page = parseInt(res.result.currentPage)
					} else {
						uni.showToast({
							title: res.message
						})
					}
				} catch (e) {
					console.log(e)
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
