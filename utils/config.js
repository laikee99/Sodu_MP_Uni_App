const key = 'USER_CONFIG_KEY'
export const colors = {
	value1: {
		bgColor: '#aac5aa',
		color: '#183614'
	},
	value2: {
		bgColor: '#CCE1ED',
		color: '#183614'
	},
	value3: {
		bgColor: '#FDE5E0',
		color: '#371410'
	},
	value4: {
		bgColor: '#D4C1A0',
		color: '#183614'
	},
	value5: {
		bgColor: '#0c0c0c',
		color: '#949494'
	}
}


const defaultConfig = {
	fontSize: 20,
	lineHeight: 1.6,
	theme: 'value1',
}

export function getConfig() {
	let value = uni.getStorageSync(key)
	let result = value || defaultConfig
	return result
}

export function saveConfig(config, cb) {
	uni.setStorage({
		key: key,
		data: config,
		success() {
			cb && cb()
		}
	})
}
