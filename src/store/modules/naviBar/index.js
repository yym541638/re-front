// 权限平台
import Vue from "vue";
const naviBar = {
  state: {
    routeMenu: [],

  },
  mutations: {
    getMenu(state, payload) {
      state.routeMenu = payload
    }
  },
  actions: {
    getMenu({ commit }, payload) {
      console.log(payload)
      if (payload.length > 0) {
        commit("getMenu", payload)
      } else {
        console.log(Vue.router, vm)
      }
    },
  },
  namespaced: true
}

export default naviBar
