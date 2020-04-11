import Vue from 'vue'
import App from './App'
import store from './store'
// 在main.js注册全局组件
import MescrollBody from "mescroll-uni/mescroll-body.vue"
import MescrollUni from "mescroll-uni/mescroll-uni.vue"
import Loading from 'components/w-loading/w-loading.vue'

Vue.config.productionTip = false
Vue.prototype.$store = store

Vue.component('mescroll-body', MescrollBody)
Vue.component('mescroll-uni', MescrollUni)
Vue.component('Loading', Loading)


App.mpType = 'app'

const app = new Vue({
	...App
})
app.$mount()
