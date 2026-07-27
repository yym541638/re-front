<template>
  <div class="echarts">
    <div
      :style="{ width: '100%', height: '100%' }"
      :id="echarts"
      class="echarts"
      ref="echarts"
    ></div>
  </div>
</template>

<script>
// 引入echarts
import echarts from "echarts";
export default {
  props: {
    title: { type: String, default: () => "" },
    series: {
      type: Array,
      default: () => [],
    },
    dataY: { type: Array, default: () => [] },
    dataX: { type: Array, default: () => [] },
    // legend: { type: Object, default: () => {} },
  },
  data() {
    return {
      myChart: null,
      charttitle: {
        text: "",
        left: 20,
        top: 16,
        textStyle: {
          color: " rgba(0, 0, 0, 0.75)",
          fontSize: 18,
          fontWeight: 600,
        },
      },
      tooltip: {
        show: true,
        trigger: "axis",
        showContent: true,
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        axisPointer: {
          type: "none",
          z: 1,
          lineStyle: {
            color: "#000000",
            width: 1,
          },
        },
        itemHeight: 7,
        textStyle: {
          lineHeight: 56,
          fontSize: 10,
        },
        padding: 0,
        formatter: function (format) {
          console.log(format);
          var result = ` <div
                style="
                min-height: 91px;
                width: 224px;
                border-radius:10px;
                background: rgba(255, 255, 255, 0.27);
                "
            >
                <div
                style="
                    width: 100%;
                    height: 30px;
                    padding-left:10px ;
                    background: rgba(0, 0, 0, 0.79);
                    font-family: PingFang SC;
                    font-style: normal;
                    font-weight: 500;
                    font-size: 10px;
                    border-radius: 10px 10px 0 0;
                    line-height: 30px;
                    color: #ffffff;
                "
                >
                横轴数值（单位）
                </div>
                <div
                style="
                    height: 100%;
                    padding-left:10px;
                    width: 100%;
                    border-radius: 3px;
                "
                >
                `;
          format.map((item, index) => {
            result +=
              "<div style='height: 28px;line-height:28px'>" +
              '<span style="display:inline-block;margin-right:5px;border-radius:0px;width:10px;height:10px;background-color:' +
              item.color +
              '"></span>' +
              item.seriesName +
              "：" +
              item.value +
              "% " +
              (item.data.unit ? item.data.unit : "");
            ("</div>");
          });
          // result += "剩余寿命：" + num + "%";
          result += "</div>";
          return result;
        },
      },
      grid: {
        right: 50,
        top: "32.44%",
        bottom: 50,
        left: 80,
      },
      legend: {
        data: [],
        top: "14.14%",
        left: 25,
        itemWidth: 10,
        itemHeight: 10,
        icon: "square",
      },
      xAxis: {
        name: "单位",
        type: "category",
        data: [],
        axisLine: {
          //横轴分割线
          show: false,
        },
        axisTick: {
          //横轴刻度
          show: false,
        },
        splitLine: {
          //横轴分割
          show: false,
        },
      },
      yAxis: {
        name: "单位",
        data: [],
        //纵轴
        type: "value", //类型
        axisLine: {
          //纵轴分割线
          show: false,
        },
        axisTick: {
          //纵轴刻度
          show: false,
        },
        axisLabel: {
          //纵轴label
          show: true,
        },
        splitLine: {
          //纵轴分割
          show: true,
          lineStyle: {
            //线条style
            type: "dotted",
            color: " #BDBDBD",
          },
        },
      },
    };
  },
  computed: {
    echarts() {
      return "echarts" + Math.random() * 100000;
    },
  },
  methods: {
    drawChart() {
      const vm = this;
      // 基于准备好的dom，初始化echarts实例
      this.myChart = echarts.init(document.getElementById(this.echarts));
      // 图表配置项
      if (JSON.stringify(this.series) != undefined) {
        let xAxisData = [];
        this.series.map((item) => {
          this.legend.data.push(item.name);
          if (item.type == "line") {
            this.tooltip.axisPointer.type = "line";
          }
          item.data.map((child) => {
            if (typeof child.name == "string") {
              this.xAxis.type = "category";
              this.xAxis.data.push(child.name);
            }
            this.yAxis.data.push(child.value);
          });
        });
        this.xAxis.data = [...new Set(this.xAxis.data)];
      }
      console.log("this.title", this.title);
      if (this.title != undefined) {
        this.charttitle.text = this.title;
      }

      let option = {
        grid: this.grid,
        title: this.charttitle,
        legend: this.legend,
        tooltip: this.tooltip,
        xAxis: this.xAxis,
        yAxis: this.yAxis,
        series: this.series,
      };
      // 绘制图表
      this.myChart.setOption(option);
    },
  },

  mounted: function () {
    const vm = this;
    vm.$nextTick(() => {
      vm.drawChart();
    });
    // 监听窗口变化 - 多个图表同时刷新
    window.addEventListener("resize", () => {
      vm.myChart.resize();
    });
  },
};
</script>

<style lang="less" scoped>
.echarts {
  width: 100%;
  height: 100%;
  // background: pink;
  overflow: hidden;
}
</style>