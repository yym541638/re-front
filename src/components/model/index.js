import ModelComponents from './index.vue';
const Model = {
    install: Vue => {
        Vue.component('Model', ModelComponents)
    }
}
export default Model;