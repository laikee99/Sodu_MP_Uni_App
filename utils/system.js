const key = 'SYSTEM_MANUAL_KEY'
 
export function getManualConfig() {
	let value = uni.getStorageSync(key)
	let result = value || false
	return result
}

export function saveManualConfig(value, cb) {
	uni.setStorage({
		key: key,
		data: value,
		success() {
			cb && cb()
		}
	})
}
