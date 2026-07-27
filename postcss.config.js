// postcss.config.js
// module.exports = {
//     plugins: {
//       'postcss-px-to-viewport': {
//         viewportWidth: 1920, // 设计稿的视口宽度
//         viewportHeight: 1080, // 设计稿的视口高度（可选）
//         unitPrecision: 5, // 转换后的小数点位数
//         viewportUnit: 'vw', // 要转换成的视口单位
//         fontViewportUnit: 'vw',
//         selectorBlackList: ['.ignore', '.hairlines'], // 不转换的类名
//         minPixelValue: 1, // 小于或等于 1px 的值不转换
//         mediaQuery: false, // 是否在媒体查询中转换
//         exclude: [/node_modules/], // 排除的文件或文件夹
//         landscapeUnit: 'vw',
//       },
//     },
//   };
module.exports = {
  plugins: {
    "postcss-pxtorem": {
      rootValue: 16, // 1rem = 16px
      propList: ["*"], // 转换所有属性
      unitPrecision: 5, // 保留小数位数
      selectorBlackList: [], // 不需要转换的选择器
      replace: true, // 直接替换 px 值
      mediaQuery: false, // 不转换媒体查询中的 px
      minPixelValue: 1, // 最小转换值
    },
  },
};
