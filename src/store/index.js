import Vue from "vue";
import Vuex from "vuex";
import naviBar from "./naviBar";

Vue.use(Vuex);

// 初始化 tagsArr，从 sessionStorage 中读取
const initTags = () => {
  const saved = sessionStorage.getItem("tags");
  if (saved) {
    return JSON.parse(saved);
  }
  return [{
    name: "ProjectOverview",
    RouterName: "ProjectOverview",
    id: "1228549913133977602",
  }, ];
};

export default new Vuex.Store({
  state: {
    healthReportdataone: [],
    healthReportdatatwo: [],
    healthReportdatathree: [],
    failData: {},
    historydate: "",
    historyTabledata: {},
    assure: false,
    facName: "",
    // 修改为动态初始化
    tagsArr: initTags(),
    whichName: "ProjectOverview", // 当前激活的页签名称
  },

  mutations: {
    STORE_HEALTHREPORTONE(state, params) {
      state.healthReportdataone = params;
    },
    STORE_HEALTHREPORTTWO(state, params) {
      state.healthReportdatatwo = params;
    },
    STORE_HEALTHREPORTTHREE(state, params) {
      state.healthReportdatathree = params;
    },
    STORE_TEST(state, params) {
      state.failData = params;
    },
    STORE_HISTORTDATE(state, params) {
      state.historydate = params;
    },
    STORE_HISTORYTABLEDATA(state, params) {
      state.historyTabledata = params;
    },
    STORE_ASSURE(state, params) {
      state.assure = params;
    },

    // 👇 新增 mutation：添加页签
    ADD_TAG(state, tag) {
      const existsIndex = state.tagsArr.findIndex(t => t.RouterName === tag.RouterName);
      if (existsIndex !== -1) {
        // 如果标签已存在，更新其信息
        state.tagsArr[existsIndex] = {
          ...state.tagsArr[existsIndex],
          ...tag,
          // 确保 id 唯一
          id: state.tagsArr[existsIndex].id || Date.now().toString() + Math.random().toString(36).substr(2, 9)
        };
      } else {
        // 如果标签不存在，添加新标签并生成唯一 id
        const newTag = {
          ...tag,
          id: tag.id || Date.now().toString() + Math.random().toString(36).substr(2, 9)
        };
        state.tagsArr.push(newTag);
      }
      // 同步保存到 sessionStorage
      sessionStorage.setItem("tags", JSON.stringify(state.tagsArr));
    },

    // 👇 新增 mutation：设置当前激活的页签名称
    SET_ACTIVE_TAB(state, name) {
      state.whichName = name;
    },

    // 👇 新增 mutation：删除页签
    REMOVE_TAG(state, tag) {
      state.tagsArr = state.tagsArr.filter(t => t.RouterName !== tag.RouterName);
      sessionStorage.setItem("tags", JSON.stringify(state.tagsArr));
    },

    // 👇 新增 mutation：更新整个 tagsArr（可选）
    UPDATE_TAGS(state, tags) {
      state.tagsArr = tags;
      sessionStorage.setItem("tags", JSON.stringify(state.tagsArr));
    }
  },

  actions: {},

  modules: {
    naviBar,
  },
});