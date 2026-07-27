// import SearchComponents from './index.vue';
// const Search = {
//     install: Vue => {
//         Vue.component('Search', SearchComponents)
//     }
// }
// export default Search;
import Components from './index.vue';
const SearchInfo = {
    install: Vue => {
        Vue.component('SearchInfo', Components)
    }
}
export default SearchInfo;