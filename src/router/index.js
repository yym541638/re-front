import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)
/*数据管理 */
import dataManageArr from "./dataManage"
import longBladeArr from "./longBlade"
/**
 * 权限模块
 */
// import {
//   defaltRoute
// } from "./defaltRoute"
/**
 * 一级菜单父级菜单
 */
const parents = [
  {
    path: '/longblade',
    name: "longblade",
    meta: {
      name: "RcmFinal",
      id: '1428549913133977601',
      // icon: "cyp",
    },
    redirect: longBladeArr[0].path,
    component: resolve => require(["@/views/parents/router.vue"], resolve),
    children: longBladeArr
  },

  {
    path: '/ProjectOverview',
    name: "ProjectOverview",
    meta: {
      name: "ProjectOverview",
      id: '1228549913133977602'
    },
    component: resolve => require(["@/views/ProjectOverview.vue"], resolve),
  },

  {
    path: '/RequestMaster',
    name: "RequestMaster",
    meta: {
      name: "RequestMaster",
      id: '1428549913133977602'
    },
    component: resolve => require(["@/views/RequestMaster.vue"], resolve),
  },
  {
    path: '/RequestIndividual',
    name: "RequestIndividual",
    meta: {
      name: "RequestIndividual",
      id: '1328549913133977602'
    },
    component: resolve => require(["@/views/RequestIndividual.vue"], resolve),
  },
    {
    path: '/PassingScores',
    name: "PassingScores",
    meta: {
      name: "PassingScores",
      id: '1228549913133977601'
    },
    component: resolve => require(["@/views/PassingScores.vue"], resolve),
  },
     {
    path: '/OperationLog',
    name: "OperationLog",
    meta: {
      name: "OperationLog",
      id: '1128549913133977602'
    },
    component: resolve => require(["@/views/OperationLog.vue"], resolve),
  },


    {
    path: '/ControlTesting',
    name: "ControlTesting",
    meta: {
      name: "ControlTesting",
      id: '1028549913133977602'
    },
    component: resolve => require(["@/views/ControlTesting.vue"], resolve),
  },
      {
    path: '/GapAnalysis',
    name: "GapAnalysis",
    meta: {
      name: "GapAnalysis",
      id: '1038549913133977602'
    },
    component: resolve => require(["@/views/GapAnalysis.vue"], resolve),
  },

        {
    path: '/ProjectSettings',
    name: "ProjectSettings",
    meta: {
      name: "ProjectSettings",
      id: '1048549913133977602'
    },
    component: resolve => require(["@/views/ProjectSettings.vue"], resolve),
  },
  {
    path: '/SystemUsers',
    name: "SystemUsers",
    meta: {
      name: "SystemUsers",
      id: '1528549913133977602',
      requireSystemRole: 'COMP_ADMIN',
    },
    component: resolve => require(["@/views/SystemUsers.vue"], resolve),
  },
  {
    path: '/datamanage',
    name: "datamanage",
    meta: {
      name: "数据管理",
      icon: "shujugl",
    },
    redirect: dataManageArr[0].path,
    component: resolve => require(["@/views/parents/router.vue"], resolve),
    children: dataManageArr
  },
]
let routes = [

  {
    path: '/',
    name: "Index",
    meta: {
      name: "首页"
    },
    component: resolve => require(["@/views/index.vue"], resolve),
  },
  {
    path: '/home',
    name: "Home",
    meta: {
      name: "系统首页"
    },
    redirect: parents[0].path,
    component: resolve => require(["@/views/Home.vue"], resolve),
    children: [...parents],
  },
  {
    path: '/login',
    name: "login",
    meta: {},

    component: resolve => require(["@/views/Login.vue"], resolve),
  },
  {
    path: '/register',
    name: "register",
    meta: {},

    component: resolve => require(["@/views/Register.vue"], resolve),
  },
  {
    path: '/products',
    name: "products",
    meta: {
      name: "产品页面"
    },
    component: resolve => require(["@/views/ProductPage.vue"], resolve),
  },
  {
    path: '/purchase',
    name: "purchase",
    meta: {
      name: "购买页面"
    },
    component: resolve => require(["@/views/PurchasePage.vue"], resolve),
  },
  {
    path: '/ProjectOverview',
    name: "ProjectOverview",
    meta: {
      name: "项目概览页面"
    },
    component: resolve => require(["@/views/ProjectOverview.vue"], resolve),
  },
  {
    path: '/payment',
    name: "payment",
    meta: {
      name: "付款页面"
    },
    component: resolve => require(["@/views/PaymentPage.vue"], resolve),
  },
]

export {
  routes
}