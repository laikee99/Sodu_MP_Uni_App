import {
	getShelfBooksSync
} from '../utils/bookShelf.js'

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
	let books = getShelfBooksSync()
	if (books) {
		return post('/sync/upload', {
			config,
			books
		})
	} else {
		uni.showToast({
			title: '没有可上传的数据',
			icon: 'none',
			duration: 2000
		})
	}
}

export function download(config) {
	return post('/sync/download', {
		config
	})
}
