import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
	state: {
		status: 0,
		searchSources: null,
		storeBookInfo: null
	},
	mutations: {
		setInitData(state, data) {
			state.searchSources = data.search
			state.status = data.status
		},
		setBookInfo(state, info) {
			state.storeBookInfo = info
		}
	}
})

export default store
