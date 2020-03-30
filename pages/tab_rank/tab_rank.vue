<template>
	<view class="tab-rank">
		<view v-if="books && books.length > 0">
			<BookItem v-for="(item) in books" :key="item.bookId" :book="item" @itemLongPress="handleItemLongPress" />
		</view>
		<view v-else class="empty">
			暂无数据
		</view>
		<Popupmenus v-if="showMenu" :book="selectedBook" @closeMenu="closeMenu" />
	</view>
</template>

<script>
	import {
		getRanks
	} from '../../api/sodu.js'
	import BookItem from '../../components/BookItem/BookItem.vue'
	import Popupmenus from '../../components/PopupMenus/index.vue'
	export default {
		components: {
			BookItem,
			Popupmenus
		},
		data() {
			return {
				books: [],
				page: -1,
				showMenu: false,
				selectedBook: null
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
					uni.showLoading({
						title: '加载中...'
					})
					let res = await getRanks(page)
					if (res.code === 0) {
						this.books = isRefresh ? res.result : this.books.concat(res.result)
						this.page = page
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
	.empty {
		margin-top: 40%;
		font-weight: 34upx;
		color: #808080;
		text-align: center;
	}
</style>
