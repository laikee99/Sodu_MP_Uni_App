import {
	get
} from '../utils/request.js'

export function init(page) {
	return get('/system/init')
}
