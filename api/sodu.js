import {
	get
} from '../utils/request.js'

export function getRanks(page) {
	return get('/sodu/rank', {
		page
	})
}


export function getRecentUpdates() {
	return get('/sodu/recent')
}

export function search(parm) {
	return get('/sodu/search', {
		parm: parm
	})
}

export function getUpdateSites(url, bookId, page) {
	return get('/sodu/updatesite', {
		url,
		bookId,
		page
	})
}
