import echartLineComponents from './index.vue';
const echartLine = {
    install: Vue => {
        Vue.component('echartLine', echartLineComponents)
    }
}
export default echartLine;