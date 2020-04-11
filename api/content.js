import {
	get
} from '../utils/request.js'

export function getContent(url) {
	return get('/content/text', {
		url
	})
}

export function getBookInfo(url, direct = 0) {
	return get('/content/info', {
		url,
		direct
	})
}
