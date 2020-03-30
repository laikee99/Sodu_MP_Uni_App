<template>
	<view class="tab-search-container">
		<view class="search-container">
			<uniSearchBar bgColor="#ffffff" radius='6' @confirm="handleSearch" @clear="handleClear" />
		</view>
		<BookItem v-for="(item) in books" :key="item.bookId" :book="item" @itemLongPress="handleItemLongPress" />
		<Popupmenus v-if="showMenu" :book="selectedBook" @closeMenu="closeMenu" />
	</view>
</template>

<script>
	import uniSearchBar from '@/components/uni-search-bar/uni-search-bar.vue'
	import BookItem from '../../components/BookItem/BookItem.vue'
	import Popupmenus from '../../components/PopupMenus/index.vue'
	import {
		search
	} from '../../api/sodu.js'
	export default {
		components: {
			uniSearchBar,
			BookItem,
			Popupmenus
		},
		data() {
			return {
				key: '',
				books: [],
				showMenu: false,
				selectedBook: null
			};
		},
		methods: {
			async handleSearch(input) {
				try {
					uni.showLoading({
						title: '加载中...'
					})
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

<style lang="less">
	.tab-search-container {
		position: relative;
		padding: 110upx 0 0 0;

		.search-container {
			position: fixed;
			background: white;
			left: 0;
			top: 0;
			width: 100%;
			z-index: 99;
		}
	}
</style>
