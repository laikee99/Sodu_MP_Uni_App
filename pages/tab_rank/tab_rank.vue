<template>
	<view class="tab-rank">
		<view v-if="books && books.length > 0">
			<BookItem v-for="(item) in books" :key="item.bookId" :book="item" />
		</view>
		<view v-else class="empty">
			暂无数据
		</view>
		<wLoading v-if="isLoading" class="loading-container" text="加载中..." mask="true" click="false"></wLoading>
	</view>
</template>

<script>
	import {
		getRanks
	} from '../../api/sodu.js'
	import BookItem from '../../components/BookItem/BookItem.vue'
	import wLoading from '@/components/w-loading/w-loading.vue';
	export default {
		components: {
			BookItem,
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
				page: -1,
				showMenu: false,
				selectedBook: null,
				isLoading: false
			};
		},
		watch: {
			page(newValue, oldValue) {
				if (this.visiable) {
					uni.setNavigationBarTitle({
						title: `排行榜（${this.page}/8）`
					})
				}
			}
		},
		created() {
			// 下拉刷新
			uni.$on('pullDwomRefresh', this.hanleRefresh)
			//  加载更多
			uni.$on('loadMore', this.handleLoadMore)
		},
		mounted() {
			this.initBooks(1)
		},
		methods: {
			hanleRefresh(index) {
				if (!this.visiable) {
					return
				}
				this.initBooks(1)
			},
			handleLoadMore(index) {
				if (!this.visiable) {
					return
				}
				this.initBooks(this.page + 1)
			},
			async initBooks(index = 1, isRefresh = true) {
				if (index > 8) {
					return
				}
				try {
					this.isLoading = true
					let res = await getRanks(index)
					if (res.code === 0) {
						this.books = isRefresh ? res.result : this.books.concat(res.result)
						this.page = index
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
	.tab-rank {
		position: relative;
		min-height: 50vh;
		padding-bottom: 140upx;
		box-sizing: border-box;

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
