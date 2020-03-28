<template>
	<view class="tab-search-container">
		<view class="search-container">
			<uniSearchBar bgColor="#eeeeee" radius='6' @confirm="handleSearch" @clear="handleClear" />
		</view>
		<BookItem v-for="(item) in books" :key="item.bookId" :book="item" />
	</view>
</template>

<script>
	import uniSearchBar from '@/components/uni-search-bar/uni-search-bar.vue'
	import BookItem from '../../components/BookItem/BookItem.vue'
	import {
		search
	} from '../../api/sodu.js'
	export default {
		components: {
			uniSearchBar,
			BookItem
		},
		data() {
			return {
				key: '',
				books: []
			};
		},
		methods: {
			async handleSearch(input) {
				try {
					uni.showLoading()
					let res = await search(input.value)
					if (res.code === 0) {
						this.books = []
						setTimeout(() => {
							this.books = res.result
						}, 0)
					} else {
						uni.showToast({
							title: res.message
						})
					}
				} catch (e) {
					//TODO handle the exception
				} finally {
					uni.hideLoading()
				}
			},
			handleClear() {
				this.books = []
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
