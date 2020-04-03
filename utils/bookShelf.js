// 添加至个人书架
const key = 'BOOK_SHELF_LIST'

export function addToShelf(book, cb) {
	let books = getShelfBooksSync()
	let index = books.findIndex(e => e.bookId === book.bookId)
	if (index > -1) {
		uni.showToast({
			title: '书架中已存在',
			icon: 'none',
			duration: 2000
		})
		return
	}
	books.unshift(book)
	saveBooks(books, cb)
}

export function saveBooks(books, cb) {
	uni.setStorage({
		key: key,
		data: books,
		success: function() {
			cb && cb()
		}
	});
}

export function deleteBook(id, cb) {
	getShelfBooks((books) => {
		if (books) {
			let index = books.findIndex(e => e.bookId === id)
			if (index > -1) {
				books.splice(index, 1)
				saveBooks(books, cb)
			}
		}
	})
}

export function updateBook(book) {
	getShelfBooks((books) => {
		if (books) {
			let index = books.findIndex(e => e.bookId === book.bookId)
			if (index > -1) {
				books[index] = book
				saveBooks(books)
			}
		}
	})
}

// 同步
export function getShelfBooksSync() {
	let result = []
	try {
		const value = uni.getStorageSync(key)
		if (value) {
			result = value
		}
	} catch (e) {
		result = null
	}

	return result
}

// 异步
export function getShelfBooks(cb) {
	uni.getStorage({
		key: key,
		success: function(res) {
			if (res) {
				cb && cb(res.data)
			} else {
				cb()
			}
		}
	});
}
