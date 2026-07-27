import CardComponents from './index.vue';
const Card = {
    install: Vue => {
        Vue.component('Card', CardComponents)
    }
}
export default Card;