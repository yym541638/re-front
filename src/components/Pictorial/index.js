import echartComponents from './index.vue';
const Echart = {
    install: Vue => {
        Vue.component('Echart', echartComponents)
    }
}
export default Echart;