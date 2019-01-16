import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const state = {
    userName: ''
}
const mutations = {
    setUserName: (state, userName) => {
        state.userName = userName;
        localStorage.setItem('userName', userName);
    }
}
const actions = {}
const getters = {
    userName: u => localStorage.getItem('userName')
}
export default new Vuex.Store({
    state,
    getters,
    actions,
    mutations
})