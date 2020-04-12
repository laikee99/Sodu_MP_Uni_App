import {
	getShelfBooksSync
} from '../utils/bookShelf.js'

import {
	getShelfBooksSync as SimpleSync
} from '../utils/bookShelfSimple.js'


import store from '../store/index.js'

import {
	post
} from '../utils/request.js'

const key = 'WEBDAV_KEY'

export function saveConfig(config) {
	try {
		uni.setStorageSync(key, config)
	} catch (e) {
		console.log(e)
	}
}

export function getConfig() {
	try {
		let value = uni.getStorageSync(key)
		return value
	} catch (e) {
		console.log(e)
		return null
	}
}

export function upload(config) {
	let books = store.state.status ? getShelfBooksSync() : SimpleSync()
	console.log(store)
	if (books && books.length > 0) {
		return post('/sync/upload', {
			config,
			books,
			status: store.state.status
		})
	} else {
		return {
			code: -1,
			message: '没有可上传的数据'
		}
	}
}

export function download(config) {
	return post('/sync/download', {
		config,
		status: store.state.status
	})
}
