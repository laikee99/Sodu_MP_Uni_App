<template>
	<view class="tab-update">
		<mescroll-uni :fixed="false" class="scroll" ref="mescrollRef" @init="mescrollInit" @down="downCallback" @up="upCallback"
		 :down="downOption" :up="upOption">
			<view v-if="books && books.length > 0">
				<BookItem v-for="(item) in books" :key="item.bookId" :book="item" @itemLongPress="handleItemLongPress" />
			</view>
			<view v-else class="empty">
				暂无数据
			</view>
		</mescroll-uni>
	</view>
</template>

<script>
	import {
		getRecentUpdates
	} from '../../api/sodu.js'
	import BookItem from '../../components/BookItem/BookItem.vue'
	import Popupmenus from '../../components/PopupMenus/index.vue'
	import MescrollMixin from "mescroll-uni/mescroll-mixins.js";
	export default {
		mixins: [MescrollMixin],
		components: {
			BookItem,
			Popupmenus
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
				isLoading: false,
				// 下拉刷新的常用配置
				downOption: {
					use: true, // 是否启用下拉刷新; 默认true
					auto: true, // 是否在初始化完毕之后自动执行下拉刷新的回调; 默认true
					textLoading: '加载中...'
				},
				upOption: {
					use: false
				}
			};
		},
		mounted() {
			this.initBooks()
		},
		methods: {
			async initBooks() {
				try {
					if (this.isLoading) {
						return
					}
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
			},
			downCallback() {
				this.initBooks().then(() => {
					this.mescroll.endSuccess()
				})
			},
			upCallback() {

			}
		}
	}
</script>

<style lang="less" scoped>
	.tab-update {
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
