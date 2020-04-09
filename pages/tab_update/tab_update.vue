<template>
	<view class="tab-update">
		<view v-if="books && books.length > 0">
			<BookItem v-for="(item) in books" :key="item.bookId" :book="item" @itemLongPress="handleItemLongPress" />
		</view>
		<view v-else class="empty">
			暂无数据
		</view>
		<Popupmenus v-if="showMenu" :book="selectedBook" @closeMenu="closeMenu" />
		<wLoading v-if="isLoading" class="loading-container" text="加载中..." mask="true" click="false"></wLoading>
	</view>
</template>

<script>
	import {
		getRecentUpdates
	} from '../../api/sodu.js'
	import BookItem from '../../components/BookItem/BookItem.vue'
	import Popupmenus from '../../components/PopupMenus/index.vue'
	import wLoading from '@/components/w-loading/w-loading.vue';
	export default {
		components: {
			BookItem,
			Popupmenus,
			wLoading
		},
		props: {
			visiable: {
				type: Boolean,
				default: false
			}
		},
		data() {
			return {
				books: [],
				showMenu: false,
				selectedBook: null,
				isLoading: false
			};
		},
		mounted() {
			// 下拉刷新
			uni.$on('pullDwomRefresh', this.initBooks)
			this.initBooks()
		},
		onPullDownRefresh() {
			this.initBooks()
			uni.stopPullDownRefresh()
		},
		methods: {
			async initBooks() {
				try {
					this.isLoading = true
					let res = await getRecentUpdates()
					if (res.code === 0) {
						this.books = res.result
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
					this.isLoading = false
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

<style lang="less" scoped>
	.tab-update {
		position: relative;
		min-height: 100vh;

		.empty {
			position: absolute;
			width: 100vw;
			left: 0;
			top: 40%;
			font-weight: 34upx;
			color: #808080;
			text-align: center;
		}
	}
</style>
