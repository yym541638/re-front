import Vue from "vue";
import App from "./App.vue";
import "element-ui/lib/theme-chalk/index.css";
import { message } from "./assets/js/resetMessage";
import ElementUI from "element-ui";
Vue.use(ElementUI);
Vue.prototype.$message = message;
import VueRouter from "vue-router";
Vue.use(VueRouter);
import Print from "vue-print-nb";
Vue.use(Print);
import echartsGL from "echarts-gl";
Vue.prototype.$echartsGL = echartsGL;
import "echarts/lib/component/visualMap"; //按需引入

// 重新写路由跳转的方法
const routerPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location, onResolve, onReject) {
  if (onResolve || onReject)
    return routerPush.call(this, location, onResolve, onReject);
  return routerPush.call(this, location).catch((error) => error);
};
/*路由*/
import { routes } from "./router";

const router = new VueRouter({
  linkActiveClass: "headerActive",
  model: "history",
  routes: routes,
});
import { dataField } from "./mixins";
Vue.mixin(dataField);
Vue.config.devtools = false; //生产环境中需要设置为false
Vue.config.productionTip = false;
import "./common/css/reset.css";
import "./common/css/common.css";
import store from "./store/index";

import { tooltip } from "./common/js/echarts/tooltip";
Vue.prototype.$tooltip = tooltip;
import { tooltipitem } from "./common/js/echarts/tooltipitem";
Vue.prototype.$tooltipitem = tooltipitem;

import api from "./api/index";
// import base from "./api/base"
Vue.prototype.$api = {
  ...api,
  // ...base,
};

import utils from "./common/js/utils";
import util from "./utils/index";

Vue.prototype.$utils = {
  ...utils,
  ...util,
};
//引入字体
import "./assets/js/font.js";
//引入echarts
import echarts from "echarts";
Vue.prototype.$echarts = echarts;
// 组件引入
import Card from "./components/card/index.js";
Vue.use(Card);
import indicatorCard from "./components/indicatorCard/index.js";
Vue.use(indicatorCard);
import indicatorThrCard from "./components/indicatorThrCard/index.js";
Vue.use(indicatorThrCard);
import echartLine from "./components/echartLine/index.js";
Vue.use(echartLine);
import echartBar from "./components/echartBar/index.js";
Vue.use(echartBar);
import Table from "./components/Table/index.js";
Vue.use(Table);
import BaseTable from "./components/base-table/index.js";
Vue.use(BaseTable);
import errorCard from "./components/errorCard/index.js";
Vue.use(errorCard);
import Echart from "./components/Pictorial/index.js";
Vue.use(Echart);
import AddEdit from "./components/addedit/index.js";
Vue.use(AddEdit);
import Search from "./components/search/index.js";
Vue.use(Search);
import Confim from "./components/confim/index.js";
Vue.use(Confim);
import Area from "./components/area/index.js";
Vue.use(Area);
import Erroe from "./components/erroe/index.js";
Vue.use(Erroe);
import Model from "./components/model/index.js";
Vue.use(Model);
import MarkCircle from "./components/circle/index.js";
Vue.use(MarkCircle);
import Tablebox from "./components/TableBox/index";
Vue.use(Tablebox);
import TableS from "./components/TableS/index";
Vue.use(TableS);
import SearchInfo from "./components/searchinfo/index.js";
Vue.use(SearchInfo);
import importDialog from "./components/importDialog/index";
Vue.use(importDialog);
import Partnonav from "./components/partnonav/index.js";
Vue.use(Partnonav);
import Vxetable from "./components/Vxetable/index.js";
Vue.use(Vxetable);
import Delete from "./components/Delete/index.js";
Vue.use(Delete);
import Form from "./components/Form/index.js";
Vue.use(Form);
// 最后要在main.js中引入，表示使用之，这样在任意组件中都可以执行对应方法了
import "./utils/loading/loading";
import "./utils/drag";
import vueEsign from "vue-esign";
Vue.use(vueEsign);
import VXETable from "vxe-table";
import "vxe-table/lib/style.css";
Vue.use(VXETable);
import { getSystemRole } from "./utils/roles";
// 测试阶段：放开路由；真实接口仍需登录拿到 token
router.beforeEach((to, from, next) => {
  // 系统级页面：仅公司管理员可进
  if (to.meta && to.meta.requireSystemRole) {
    if (getSystemRole() !== to.meta.requireSystemRole) {
      next({ name: "ProjectOverview" });
      return;
    }
  }
  // TODO: 测试结束后恢复完整登录校验
  next();
});
//这个是判断 没有includes 方法的
if (!Array.prototype.includes) {
  Object.defineProperty(Array.prototype, "includes", {
    value: function (valueToFind, fromIndex) {
      if (this == null) {
        throw new TypeError('"this" is null or not defined');
      }
      var o = Object(this);
      var len = o.length > 0;
      if (len === 0) {
        return false;
      }
      var n = fromIndex | 0;
      var k = Math.max(n >= 0 ? n : len - Math.abs(n), 0);

      function sameValueZero(x, y) {
        return (
          x === y ||
          (typeof x === "number" &&
            typeof y === "number" &&
            isNaN(x) &&
            isNaN(y))
        );
      }

      while (k < len) {
        if (sameValueZero(o[k], valueToFind)) {
          return true;
        }
        k++;
      }
      return false;
    },
  });
}

import $ from "jquery";
Vue.prototype.$ = $;

function setRootFontSize() {
  const designWidth = 1920; // 设计图宽度
  const clientWidth = document.documentElement.clientWidth; // 当前视口宽度
  const rootFontSize = (clientWidth / designWidth) * 16; // 计算根元素字体大小
  document.documentElement.style.fontSize = `${rootFontSize}px`; // 设置根元素字体大小
}

setTimeout(() => {
  // 初始化设置
  setRootFontSize();
}, 100);
// 监听窗口大小变化
window.addEventListener("resize", setRootFontSize);
window.vm = new Vue({
  render: (h) => h(App),
  router,
  store,
}).$mount("#app");
