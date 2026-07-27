import axios from "axios";

const rootUrl = "/api";
const http = axios.create({
  timeout: 60000,
});

http.interceptors.request.use(
  (config) => {
    const url = config.url || "";
    const isAuthFree =
      url.includes("/auth/login") ||
      url.includes("/auth/register") ||
      url.includes("/auth/company-by-invitation") ||
      url.includes("/invitation-code/validate");

    if (!isAuthFree) {
      let userInfo = null;
      try {
        userInfo = JSON.parse(sessionStorage.getItem("userInfo") || "null");
      } catch (e) {
        userInfo = null;
      }
      const userId =
        (userInfo && (userInfo.id || userInfo.userId || userInfo.user_id)) ||
        "";
      if (userId !== "") {
        config.headers.userid = userId;
      }
      const token = sessionStorage.getItem("token");
      if (token && token !== "test_token") {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } else {
      delete config.headers.Authorization;
      delete config.headers.authorization;
    }

    // FormData 交给浏览器自动带 boundary
    if (typeof FormData !== "undefined" && config.data instanceof FormData) {
      if (config.headers) {
        delete config.headers["Content-Type"];
      }
    }
    return config;
  },
  (err) => Promise.reject(err),
);

http.interceptors.response.use(
  (res) => {
    const payload = res.data;
    if (payload && payload.code === 40000) {
      // 测试阶段暂不强制跳登录
    }
    return payload;
  },
  (error) => {
    const payload = error.response && error.response.data;
    if (payload) return Promise.reject(payload);
    return Promise.reject({
      code: -1,
      message: (error && error.message) || "Network Error",
      data: null,
    });
  },
);

/**
 * 统一请求封装
 * @param {'get'|'post'|'put'|'delete'} method
 * @param {string} url 相对 /api 的路径，如 /project/list
 * @param {any} data get/delete 为 query；post/put 为 body
 * @param {string|false} headers Content-Type，FormData 时传 multipart/form-data 或不传
 * @param {string} responseType
 */
export default function request(
  method,
  url,
  data = null,
  headers = "application/json;charset=UTF-8",
  responseType,
) {
  const m = String(method || "get").toLowerCase();
  const config = {
    method: m,
    url: rootUrl + url,
    responseType,
    headers: {},
  };

  if (headers && headers !== "multipart/form-data") {
    config.headers["Content-Type"] = headers;
  }

  if (m === "get" || m === "delete") {
    config.params = data || undefined;
  } else {
    config.data = data;
  }

  return http(config);
}
