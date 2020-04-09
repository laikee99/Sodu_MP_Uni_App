<template>
	<view class="tab-search-container">
		<view class="search-container">
			<uniSearchBar bgColor="#ffffff" radius='6' @confirm="handleSearch" @clear="handleClear" />
		</view>
		<BookItem v-for="(item) in books" :key="item.bookId" :book="item" @itemLongPress="handleItemLongPress" />
		<wLoading v-if="isLoading" class="loading-container" text="加载中..." mask="true" click="false"></wLoading>
	</view>
</template>

<script>
	import uniSearchBar from '@/components/uni-search-bar/uni-search-bar.vue'
	import BookItem from '../../components/BookItem/BookItem.vue'
	import wLoading from '@/components/w-loading/w-loading.vue';
	import {
		search
	} from '../../api/sodu.js'
	export default {
		components: {
			uniSearchBar,
			BookItem,
			wLoading
		},

		data() {
			return {
				key: '',
				books: [],
				showMenu: false,
				selectedBook: null,
				isLoading: false
			};
		},
		methods: {
			async handleSearch(input) {
				try {
					this.isLoading = true
					let res = await search(input.value)
					if (res.code === 0) {
						this.books = []
						setTimeout(() => {
							this.books = res.result
						}, 0)
					} else {
						throw new Error(res.message)
					}
				} catch (e) {
					setTimeout(() => {
						uni.showToast({
							icon: 'none',
							title: e.message || '请求数据失败,请重新尝试',
							duration: 3000
						});
					})
				} finally {
					uni.hideLoading()
					this.isLoading = false
				}
			},
			handleClear() {
				this.books = []
			},
			handleItemLongPress(item) {
				this.selectedBook = item
				this.showMenu = true
			},
			closeMenu() {
				this.showMenu = false
				this.selectedBook = null
			}
		}
	}
</script>

<style lang="less" scoped>
	.tab-search-container {
		position: relative;
		padding: 0upx 0 0 0;
		height: 100%;
		box-sizing: border-box;
	}
</style>
