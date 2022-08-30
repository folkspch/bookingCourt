import Vuex from 'vuex'
import Vue from 'vue'


Vue.use(Vuex)

export default () => new Vuex.Store({
  state: () => ({
    userId:'',
    userName:'',
    selectedCourt:'',
    courtDetail:{}
  }),
  mutations: {
    setSelectedCourt(state,value){
      state.selectedCourt=value
    },
    setUserId(state,value){
      state.userId=value
    },
    setUserName(state,value){
      state.userName=value
    },
    setCourtDetail(state,value){
      state.courtDetail=value
    },
  },
  actions: {
    
  },
  modules: {
   
  }
})