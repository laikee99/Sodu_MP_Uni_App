<template>
	<view>
		<view v-if="books && books.length > 0">
			<BookItem v-for="(item) in books" :key="item.bookId" :book="item" @itemLongPress="handleItemLongPress" />
		</view>
		<view v-else class="empty">
			暂无数据
		</view>
		<Popupmenus v-if="showMenu" :book="selectedBook" @closeMenu="closeMenu" @bookRefresh="bookRefresh"
		 @switchDirectAction="handleSwitchReadAction" isShelf="true" @deleteBook="handleDeleteBook" />
	</view>
</template>

<script>
	import {
		getShelfBooks,
		addToShelf,
		updateBook,
		deleteBook
	} from '../../utils/bookShelf.js'
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
				showMenu: false,
				selectedBook: null
			};
		},
		created() {
			this.initBooks()
		},
		onLoad() {
			uni.$on('addBookToShelf', this.addBook)
			uni.$on('updateBookShelf', this.initBooks)
		},
		onUnload() {
			uni.$off('addBookToShelf')
			uni.$off('updateBookShelf', )
		},
		onPullDownRefresh() {
			this.books.forEach(e => {
				this.bookRefresh(e.bookId)
			})
			uni.stopPullDownRefresh()
		},
		methods: {
			addBook(e) {
				e.shelfTime = +new Date()
				e.isLoading = false
				e.isDirectGoToContent = false
				addToShelf(e, () => {
					this.books.unshift(e)
					uni.showToast({
						title: '添加成功',
						duration: 2000,
						icon: 'success'
					})
				})
			},
			initBooks() {
				getShelfBooks((books) => {
					if (books) {
						let temp = books.map(e => {
							e.isLoading = false
							return e
						})
						temp.sort(function(a, b) {
							return a.shelfTime > b.shelfTime
						})
						this.books = temp
					}
				})
			},
			bookRefresh(id) {
				let index = this.books.findIndex(e => e.bookId === id)
				if (index > -1) {
					this.books[index].isLoading = true
				}
				this.closeMenu()
			},
			handleSwitchReadAction(data) {
				let index = this.books.findIndex(e => e.bookId === data.id)
				if (index > -1) {
					this.books[index].isDirectGoToContent = data.value
					updateBook(this.books[index])
				}
			},
			handleDeleteBook(id) {
				let index = this.books.findIndex(e => e.bookId === id)
				if (index > -1) {
					deleteBook(id, () => {
						this.books.splice(index, 1)
						this.closeMenu()
					})
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
