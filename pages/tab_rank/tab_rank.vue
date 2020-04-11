<template>
	<view class="tab-rank">
		<mescroll-uni :fixed="false" class="scroll" ref="mescrollRef" @init="mescrollInit" @down="downCallback" :down="downOption"
		 :up="upOption" @up="upCallback">
			<view v-if="books && books.length > 0">
				<BookItem v-for="(item) in books" :key="item.bookId" :book="item" />
			</view>
			<view v-else class="empty">
				暂无数据
			</view>
		</mescroll-uni>
	</view>
</template>

<script>
	import {
		getRanks
	} from '../../api/sodu.js'
	import BookItem from '../../components/BookItem/BookItem.vue'
	import MescrollMixin from "mescroll-uni/mescroll-mixins.js";
	export default {
		mixins: [MescrollMixin],
		components: {
			BookItem
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
				isLoading: false,
				// 下拉刷新的常用配置
				downOption: {
					use: true, // 是否启用下拉刷新; 默认true
					auto: true, // 是否在初始化完毕之后自动执行下拉刷新的回调; 默认true
					// textLoading: '...'
				},
				upOption: {
					use: true,
					auto: false,
					textLoading: '加载更多...',
					toTop: {
						rc: null,
						offset: 1000,
						duration: 300,
						zIndex: 9990,
						right: 20,
						bottom: 160,
						safearea: true,
						width: 72,
						radius: "50%",
						left: null
					}
				}
			};
		},
		watch: {
		},
		mounted() {
		},
		methods: {
			async initBooks(index = 1, showLoading = true) {
				if (index > 8 || this.isLoading) {
					return
				}
				try {
					this.isLoading = showLoading
					let res = await getRanks(index)
					if (res.code === 0) {
						this.books = index === 1 ? res.result : this.books.concat(res.result)
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
			},
			downCallback() {
				this.initBooks(1, false).then(() => {
					this.mescroll.endSuccess()
				})
			},
			upCallback() {
				this.initBooks(this.page + 1, false).then(() => {
					this.mescroll.endSuccess(50, this.page < 8 ? true : false)
				})
			}
		}
	}
</script>

<style lang="less" scoped>
	.tab-rank {
		position: relative;
		min-height: 50vh;
		box-sizing: border-box;
		height: 100%;
		flex: 1;
		padding-bottom: 10upx;

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
