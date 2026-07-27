import echartBarComponents from './index.vue';
const echartBar = {
    install: Vue => {
        Vue.component('echartBar', echartBarComponents)
    }
}
export default echartBar;