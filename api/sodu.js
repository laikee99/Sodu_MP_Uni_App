import {
	get
} from '../utils/request.js'

export function getRanks(page) {
	return get({
		url: '/sodu/rank',
		params: {
			page
		}
	})
}


export function getRecentUpdates() {
	return get({
		url: '/sodu/recent'
	})
}

export function search(parm) {
	return get({
		url: '/sodu/search',
		params: {
			parm: parm
		}
	})
}

export function getUpdateSites(url, bookId, page) {
	return get({
		url: '/sodu/updatesite',
		params: {
			url,
			bookId,
			page
		}
	})
}
