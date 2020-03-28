<template>
	<view class="tab-update">
		<BookItem v-for="(item) in books" :key="item.bookId" :book="item" />
	</view>
</template>

<script>
	import {
		getRecentUpdates
	} from '../../api/sodu.js'
	import BookItem from '../../components/BookItem/BookItem.vue'
	export default {
		components: {
			BookItem
		},
		data() {
			return {
				books: [],
			};
		},
		mounted() {
			this.initBooks()
		},
		onPullDownRefresh() {
			this.initBooks().then(() => {
				uni.stopPullDownRefresh()
			})
		},
		methods: {
			async initBooks() {
				try {
					uni.showLoading()
					let res = await getRecentUpdates()
					if (res.code === 0) {
						this.books = res.result
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
</style>
