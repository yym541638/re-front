import importDialogC from './index.vue';
const importDialog = {
    install: Vue => {
        Vue.component('importDialog', importDialogC)
    }
}
export default importDialog;