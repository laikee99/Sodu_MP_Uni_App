<template>
	<view class="tab-shelf">
		<view v-if="books && books.length > 0">
			<BookItem v-for="(item) in books" :key="item.bookId" :book="item" isShelf="true" @itemLongPress="handleItemLongPress"
			 @bookClick="handleBookClick(item)" />
		</view>
		<view v-else class="empty">
			您的书架空空如也~
		</view>
		<Popupmenus v-if="showMenu" :book="selectedBook" @closeMenu="closeMenu" @bookRefresh="bookRefresh" isShelf="true"
		 @deleteBook="handleDeleteBook" />
	</view>
</template>

<script>
	import {
		getShelfBooks,
		addToShelf,
		updateBook,
		deleteBook
	} from '@/utils/bookShelf.js'
	import {
		getBookInfo
	} from '@/api/content.js'
	import BookItem from '@/components/BookItem/BookItem.vue'
	import Popupmenus from '@/components/PopupMenus/index.vue'
	export default {
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
				selectedBook: null
			};
		},
		created() {
			this.initEventBus()
			this.initBooks()
		},
		destroyed() {
			this.removeEventBus()
		},
		methods: {
			initEventBus() {
				//  添加至书架
				uni.$on('addBookToShelf', this.addBook)
				//  跟新书架所有书
				uni.$on('updateBookShelf', this.initBooks)
				//  更新单本书
				uni.$on('updateShelfBook', this.updateShelfBook)
				//  更新阅读记录
				uni.$on('updateShelfBookMark', this.updateShelfBookMark)
				// 下拉刷新
				uni.$on('pullDwomRefresh', this.handlePullDwonRefresh)
			},
			removeEventBus() {
				uni.$off('addBookToShelf')
				uni.$off('updateBookShelf')
				uni.$off('updateShelfBook')
				uni.$off('updateShelfBookMark')
			},
			handlePullDwonRefresh(index) {
				if (!this.visiable) {
					return
				}
				this.books.forEach(e => {
					this.bookRefresh(e.bookId)
				})
			},
			addBook(e) {
				e.isLoading = false
				addToShelf(e, () => {
					this.books.unshift(e)
					this.handleRefreshBook(e)
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
					this.handleRefreshBook(this.books[index])
				}
				this.closeMenu()
			},
			async handleRefreshBook(book) {
				try {
					if (!book.sourceUrl || book.isLoading) {
						return
					} else {
						book.isLoading = true
						let result = await this.requestBookInfo(book.sourceUrl)
						if (result && result.catalogs) {
							let index = result.catalogs.findIndex(e => e.url === book.sourceUrl)
							if (index > -1 && index < result.catalogs.length - 1) {
								book.hasNew = true
								book.lastChapterName = result.catalogs[result.catalogs.length - 1].name
								book.lastChapterUrl = result.catalogs[result.catalogs.length - 1].url
								if (book.userlastCatalogsUrl !== book.lastChapterUrl) {
									book.hasNew = true
								} else {
									book.hasNew = false
								}
								this.updateShelfBook(book)
							} else {
								book.hasNew = false
							}
						}
					}
				} catch (e) {
					console.log(e)
				} finally {
					book.isLoading = false
					console.log()
				}
			},
			// 加载目录数据
			async requestBookInfo(url, time = 0) {
				try {
					this.isRequestBookInfo = true
					let res = await getBookInfo(url)
					if (res.code === 0) {
						return res.result
					} else {
						throw new Error()
					}
				} catch (e) {
					if (time < 3) {
						this.requestBookInfo(url, ++time)
					} else {
						return null
					}
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
			updateShelfBook(book) {
				updateBook(book)
			},
			//  更新书签
			updateShelfBookMark(item) {
				let index = this.books.findIndex(e => e.bookId === item.id)
				if (index > -1) {
					let book = this.books[index]
					book.chapterName = item.name
					book.sourceUrl = item.url
					if (book.lastChapterUrl === item.url) {
						book.isNew = false
					}
					this.updateShelfBook(this.books[index])
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
			handleBookClick(book) {
				book.isNew = false
				book.userlastCatalogsUrl = book.lastChapterUrl
				this.updateShelfBook(book)
			}
		}
	}
</script>


<style lang="less" scoped>
	.tab-shelf {
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
