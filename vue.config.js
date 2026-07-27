const path = require("path");
const proxyConfig = {
  baseUrl: "http://127.0.0.1:8089",
  cold: "http://10.12.2.13:8013",
  trend: "http://10.12.2.13:8083",
  ren: "http://10.12.2.13:7531",
  // tao: "http://10.12.2.13:7151",
  tao: "http://127.0.0.1:8089",
  xn: "http://10.9.70.175:8013",
  jiag: "http://10.12.2.13:9113",
  hao: "http://10.9.70.175:7627",
};
const createProxy = (config) => {
  return Object.keys(config).reduce((acc, key) => {
    acc[`/${key}`] = {
      target: config[key],
      changeOrigin: true,
      pathRewrite: { [`^/${key}`]: "" },
    };
    return acc;
  }, {});
};
const UglifyPlugin = require("uglifyjs-webpack-plugin");
// 引入依赖
module.exports = {
  publicPath: "./",
  productionSourceMap: false,
  pluginOptions: {
    "style-resources-loader": {
      preProcessor: "less",
      patterns: [path.resolve("/src/common/less/main.less")],
    },
  },
  configureWebpack: (config) => {
    if (process.env.NODE_ENV == "production") {
      // 隐藏控制台日志
      config.optimization.minimizer[0].options.terserOptions.compress.drop_console = true;
      // 为生产环境修改配置
      config.mode = "production";
      // 将每个依赖包打包成单独的js文件
      let optimization = {
        minimizer: [
          new UglifyPlugin({
            uglifyOptions: {
              warnings: false,
              compress: {
                drop_console: true,
                drop_debugger: false,
                pure_funcs: ["console.log"],
              },
            },
          }),
        ],
      };
      Object.assign(config, {
        //  optimization
      });
    } else {
      // 为开发环境修改配置
      config.mode = "development";
    }
    if (process.env.NODE_ENV !== "production") return;
    return {
      plugins: [
        // ......
      ],
      // 看这里：把chunk-vendors.js进行分包，提升资源加载速度，很有必要
      optimization: {
        /**
         * runtimeChunk可选值有：true或'multiple'或'single'
         * true或'multiple'会有每个入口对应的chunk。不过一般情况下
         * 考虑到要模块初始化，设置为single就够多数情况下使用啦。
         * 详情见官网：https://webpack.docschina.org/configuration/optimization/#optimizationruntimechunk
         * */
        runtimeChunk: "single",
        /**
         * 以前是CommonsChunkPlugin，现在换成optimization.splitChunks。普通项目下方的配置就足够用啦
         * 详情见官网：https://webpack.docschina.org/configuration/optimization/#optimizationsplitchunks
         * */
        splitChunks: {
          chunks: "all", // 可选值：all，async 和 initial。all功能最强大，所以咱们就使用all
          maxInitialRequests: Infinity, // 最大并行请求数，为了以防万一，设置无穷大即可
          minSize: 20000, // 引入的模块大于20kb才做代码分割，官方默认20000，这里不用修改了
          maxSize: 60000, // 若引入的模块大于60kb，则告诉webpack尝试再进行拆分
          cacheGroups: {
            vendors: {
              test: /[\\/]node_modules[\\/]/, // 使用正则匹配node_modules中引入的模块
              priority: -10, // 优先级值越大优先级越高，默认-10，不用修改
              name(module) {
                // 设定分包以后的文件模块名字，按照包名字替换拼接一下
                const packageName = module.context.match(
                  /[\\/]node_modules[\\/](.*?)([\\/]|$)/,
                )[1];
                return `npm.${packageName.replace("@", "")}`;
              },
            },
          },
        },
      },
    };
  },
  outputDir: "dist", //build输出目录
  assetsDir: "static", //静态资源目录（js, css, img）
  lintOnSave: false, //是否开启eslint
  devServer: {
    open: false,
    host: "0.0.0.0",
    port: 18081,
    https: false,
    hotOnly: false,
    proxy: {
      ...createProxy(proxyConfig),
      "/api": {
        target: "http://127.0.0.1:8089",
        changeOrigin: true,
        pathRewrite: { "^/api": "/api" },
      },
    },
  },
};
