import uniFly from 'unifly';
//基础路由
// uniFly.baseUrl = 'https://sodu.ruobin521.com';
uniFly.baseUrl = 'http://192.168.124.3:40002';
uniFly.headers['Content-Type'] = 'application/json';

//全局请求超时时间
uniFly.timeOut = 20000

//自定义请求拦截
uniFly.requestInterceptors.success = function(request) {
	//配置基本信息
	request.headers = uniFly.headers
	return request
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
