import uniFly from 'unifly';
//基础路由
// uniFly.baseUrl = 'https://sodu.ruobin521.com';
uniFly.baseUrl = __wxConfig.envVersion === "develop" ? 'http://192.168.1.5:40002' : 'https://sodu.ruobin521.com';
uniFly.headers['Content-Type'] = 'application/json';


//全局请求超时时间
uniFly.timeOut = 120000

//自定义请求拦截
uniFly.requestInterceptors.success = function(request) {
	//配置基本信息
	request.headers = uniFly.headers
	return request
}

uniFly.responseInterceptors.success = function(request) {
	return Promise.resolve(request)
}
uniFly.responseInterceptors.error = function(error) {
	console.log('========', error)
	return Promise.resolve({
		data: {
			code: -1,
			result: null,
			message: error.message
		}
	})
}

export async function get(url, params) {
	let res = await uniFly.get({
		url,
		params
	})
	return res.data
}

export async function post(url, params) {
	let res = await uniFly.post({
		url,
		params
	})
	return res.data
}

// module.exports = uniFly
