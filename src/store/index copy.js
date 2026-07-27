import Vue from "vue";
import Vuex from "vuex";
import naviBar from "./naviBar";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    healthReportdataone: [],
    healthReportdatatwo: [],
    healthReportdatathree: [],
    failData: {},
    historydate: '',
    historyTabledata: {},
    assure: false,
    facName: "",
    tagsArr: [{
      name: "状态监测",
      RouterName: "conditionMonitoring",
      id: "1428579698350493221",
    }, ]
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
    }

  },
  actions: {},
  modules: {
    naviBar,
  }
});