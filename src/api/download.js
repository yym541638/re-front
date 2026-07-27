import axios from "axios";
import Qs from "qs";
import Vue from "vue";
const rootUrl = process.env.NODE_ENV == "development" ? '/tao' : '/tao';
const http = axios.create({})
let num = 0;
//请求拦截
http.interceptors.request.use((config) => {
    console.log('请求拦截', config);
    var needToken;
    num++;
    // store.commit('setLoading');
    if (config.url.search('login') === -1) {
        needToken = true
    } else {
        needToken = false

    }
    if (needToken) {
        /*设置token*/
        config.headers.userid = sessionStorage.getItem('userInfo') ? JSON.parse(sessionStorage.getItem('userInfo')).userId : "123";
        const token = sessionStorage.getItem('token');
        if (!!token) {
            config.headers.authorization = token;
            if (config.method == 'post') {
                if (config.headers['Content-Type'] != 'multipart/form-data') {}
                // config.data = Qs.stringify(config.data)
            } else if (config.method == 'put') {
                // config.data = Qs.stringify(config.data)
            }
            return config;
        } else {
            // vm._router.push({ name: 'login' });
        }
    } else {
        delete config.headers.common.authorization;
        delete config.headers.authorization;
        return config;
    }
    return config;
}, (err) => {
    return Promise.reject(err);
})
//响应拦截
http.interceptors.response.use((res) => {
    var code = res.data.code;
    switch (code) {
        case 40000:
            vm._router.push({
                name: 'login'
            });
            break;
        default:
            break;
    }
    let headers = res.headers
    res.data.headers = headers
    console.log(res.data, '自知则知之做')
    return res.data
}, (error) => {
    return Promise.reject(error);
})


export default (method, url, data = null, headers = 'application/json;charset=UTF-8', responseType) => {
    console.log(url, 'aaaa', responseType, data)
    if (method == "post") {
        return http({
            method: 'post',
            url: rootUrl + url,
            // url: url,
            data: data,
            headers: {
                'Content-Type': headers,
            },
            // responseType: responseType
            responseType: 'blob'
        });
    } else if (method == "get") {
        return http({
            method: 'get',
            url: rootUrl + url,
            // url: url,
            params: data,
            headers: {
                'Content-Type': headers
            },
            // responseType: showBlod
            responseType: 'blob'
        });
    } else {
        return;
    }
}