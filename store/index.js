import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
	state: {
		searchSources: null,
		storeBookInfo: null
	},
	mutations: {
		setSearch(state, sources) {
			state.searchSources = sources
		},
		setBookInfo(state, info) {
			state.storeBookInfo = info
		}
	}
})

export default store
