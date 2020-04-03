import {
	get
} from '../utils/request.js'

export function getContent(url) {
	return get('/content/text', {
		url
	})
}

export function getBookInfo(url){
	return get('/content/info', {
		url
	})
}
