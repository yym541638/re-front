export default {
  color: ["#3398DB"],
  tooltip: {
    trigger: "axis",
    axisPointer: {
      // 坐标轴指示器，坐标轴触发有效
      type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
    }
  },
  grid: {
    left: "8%",
    containLabel: true
  },
  xAxis: [
    {
      axisLabel: {
        interval: 0
      },
      type: "category",
      data: [], // 横坐标数据
      axisTick: {
        alignWithLabel: true
      },
      name: "地域"
    }
  ],
  yAxis: [
    {
      name: "问题数",
      type: "value"
    }
  ],
  series: [
    {
      name: "问题数",
      type: "bar",
      barWidth: "30%",
      data: [] // 柱状图数据
    }
  ]
};
