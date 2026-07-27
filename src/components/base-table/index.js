import TableComponents from './index.vue';
const BaseTable = {
    install: Vue => {
        Vue.component('BaseTable', TableComponents)
    }
}
export default BaseTable;