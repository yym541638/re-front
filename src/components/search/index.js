import SearchComponents from './index.vue';
const Search = {
    install: Vue => {
        Vue.component('Search', SearchComponents)
    }
}
export default Search;