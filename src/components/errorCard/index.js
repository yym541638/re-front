import errorCardComponents from './index.vue';
const errorCard = {
    install: Vue => {
        Vue.component('errorCard',errorCardComponents)
    }
}
export default errorCard;