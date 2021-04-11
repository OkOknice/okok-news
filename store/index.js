import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

let store = new Vuex.Store({
	state:{
		historyLists: uni.getStorageSync("__history") || [],
		userInfo:uni.getStorageSync("userInfo") || {}
	},
	mutations:{
		SET_HISTORYLISTS(state,historyLists){
			state.historyLists = historyLists
		},
		CLEAR_HISTORYLISTS(state,historyLists){
			state.historyLists = []
		},
		SET_USERINFO(state,userInfo){
			state.userInfo = userInfo
		}
	},
	actions:{
		set_historyLists({commit,state},historyLists){
			let list = state.historyLists
			list.unshift(historyLists)
			let obj = {}
			let newList = list.filter(item =>{
				if(obj[item.name]){
					return false
				} else {
					obj[item.name] = true
					return true
				}
			})
			uni.setStorageSync('__history', newList)
			commit("SET_HISTORYLISTS",newList)
		},
		clear_history({commit}){
			uni.removeStorageSync('__history')
			commit('CLEAR_HISTORYLISTS')
		},
		set_userInfo({commit},userInfo){
			uni.setStorageSync('userInfo', userInfo)
			commit('SET_USERINFO',userInfo)
		}
	}
})

export default store