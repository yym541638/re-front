// 权限平台
import {
  routes
} from '../../router';
// 接口
// 产品数据库
// import { productroutes } from '../../router/product';
// import { unitMenu } from '../../utils/unitMenu'
import { routeMenu } from '../../utils/routeMenu'
// import { equMenuAll } from '../../utils/equMenu'
const naviBar = {
  state: {
    routers: routes ? routes[0].children : [],
    routeMenu: routeMenu,
    unitMenu: [],
    equMenu: [],
    // routers: productroutes ? productroutes[0].children : [],

  },
  mutations: {
    // 获取普通菜单
    getMenu(state, payload) {
      state.routeMenu = payload
    },
    // 获取机组菜单
    sendUnit(state, payload) {
      state.unitMenu = payload
    },
    // 获取设备菜单
    sendEqu(state, payload) {
      state.equMenu = payload
    },
    getBtns(state, payload) {
      let arr = []
      payload.map(item => {
        arr.push(item.name)
      })
      state.btns = arr
    },
    setRoleId(state, payload) {
      state.roleId = payload
    }

  },
  actions: {
    // 获取普通菜单
    getMenu({
      commit
    }, menus) {
      commit("getMenu", menus)
    },
    // 获取机组菜单
    sendUnit({
      commit
    }, menus) {
      commit("sendUnit", menus)
    },
    // 获取设备菜单
    sendEqu({
      commit
    }, menus) {
      commit("sendEqu", menus)
    },
    getBtns({
      commit
    }, payload) {
      commit("getBtns", payload)

    },
  },
  namespaced: true
}

export default naviBar