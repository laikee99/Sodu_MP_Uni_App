<template>
	<view class="tab-search-container">
		<mescroll-uni :fixed="false" class="scroll" ref="mescrollRef" @init="mescrollInit" :down="downOption" :up="upOption">
			<view class="search-container">
				<uniSearchBar bgColor="#ffffff" radius='6' @confirm="handleSearch" @clear="handleClear" />
			</view>
			<BookItem v-for="(item) in books" :key="item.bookId" :book="item" @itemLongPress="handleItemLongPress" :status="status" />
		</mescroll-uni>
		<wLoading v-if="isLoading" class="loading-container" text="加载中..." mask="true" click="false"></wLoading>
		<Popupmenus v-if="showMenu" :book="selectedBook" @closeMenu="closeMenu" type="search" />
	</view>
</template>

<script>
	import uniSearchBar from '@/components/uni-search-bar/uni-search-bar.vue'
	import BookItem from '../../components/search-book-item/search-book-item.vue'
	import wLoading from '@/components/w-loading/w-loading.vue';
	import Popupmenus from '@/components/PopupMenus/index.vue'
	import {
		search
	} from '../../api/sodu.js'
	import MescrollMixin from "mescroll-uni/mescroll-mixins.js";
	import {
		mapState
	} from 'vuex'
	export default {
		mixins: [MescrollMixin],
		components: {
			uniSearchBar,
			BookItem,
			wLoading,
			Popupmenus
		},
		data() {
			return {
				key: '',
				books: [],
				showMenu: false,
				selectedBook: null,
				isLoading: false,
				// 下拉刷新的常用配置
				downOption: {
					use: false // 是否启用下拉刷新; 默认true
				},
				upOption: {
					use: false,
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
		computed: {
			...mapState(['searchSources', 'status'])
		},
		methods: {
			async handleSearch(input) {
				try {
					this.isLoading = true
					this.books = []
					let resouces = this.searchSources
					if (!resouces || resouces.length === 0) {
						resouces = ['sodu']
					}
					let count = resouces.length
					resouces.forEach(e => {
						search({
							parm: input.value,
							source: e
						}).then(res => {
							if (res.code === 0) {
								this.books = this.books.concat(res.result)
							} else {
								throw new Error()
							}
						}).catch(e => {
							console.log(e)
						}).finally(e => {
							count--
							if (count === 0) {
								this.isLoading = false
							}
						})
					})
				} catch (e) {
					console.log(e)
				}
			},
			handleClear() {
				this.books = []
			},
			handleItemLongPress(item) {
				if (this.status !== 0) {
					return
				}
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
		height: 100%;
		flex: 1;
		padding-bottom: 10upx;
	}
</style>
