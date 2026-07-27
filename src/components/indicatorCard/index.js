import indicatorCardComponents from './index.vue';
const indicatorCard = {
    install: Vue => {
        Vue.component('indicatorCard', indicatorCardComponents)
    }
}
export default indicatorCard;