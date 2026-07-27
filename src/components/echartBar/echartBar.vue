<template>
  <div
    class="chartbar"
    ref="echartbar"
    :style="{ width: '100%', height: '100%' }"
  ></div>
</template>

<script>
export default {
  name: "echartBar",
  props: {
    seriesData: {
      type: Object,
      default: () => [
        {
          title: "",
          xAxisName: "单位",
          xAxisType: "value",
          xAxisData: [],
          yAxisName: "单位",
          yAxisType: "value",
          yAxisData: [],
          data: [],
        },
      ],
    },
  },
  data() {
    return {
      chartbar: null,
      Option: {
        grid: {
          right: 50,
          top: "32.44%",
          bottom: 50,
          left: 60,
          // width: "88.33%",
          // height: "55.38%",
        },
        title: {
          text: "",
          left: 20,
          top: 16,
          textStyle: {
            color: " rgba(0, 0, 0, 0.75)",
            fontSize: 18,
            fontWeight: 600,
          },
        },
        legend: {
          data: [],
          top: "14.14%",
          left: 20,
          icon: "square",
        },
        tooltip: {
          show: true,
          trigger: "axis",
          showContent: true,
          backgroundColor: "rgba(0, 0, 0, 0.7)",
          axisPointer: {
            type: "none",
          },
          itemHeight: 7,
          textStyle: {
            lineHeight: 56,
            fontSize: 10,
          },
          padding: 0,
          formatter: function (format) {
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
                ":" +
                item.value +
                "%<br>";
              ("</div>");
            });
            // result += "剩余寿命：" + num + "%";
            result += "</div>";
            return result;
          },
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
        series: [
          //数据处理
          {
            type: "bar", //echarts的图标类型
            // id: "1",
            showBackground: true, //背景是否展示
            backgroundStyle: {
              //背景颜色
              color: "rgba(242, 242, 242, 0.8)",
            },
            data: [],
            barWidth: 20,
          },
        ],
      },
    };
  },
  mounted() {
    this.chartbar = this.$echarts.init(this.$refs.echartbar);
    if (!this.chartbar) return;
    console.log("this.seriesData",this.seriesData)
    if (this.seriesData) {
      // let legendData = [];

      // this.seriesData.data.map((item, index) => {
      //   legendData.push(item.name);
      // });
      // this.Option.legend.data = this.seriesData;
      // this.Option.xAxis.type = this.seriesData.xAxisType;
      // this.Option.xAxis.name = this.seriesData.xAxisName;
      // // this.Option.xAxis.data = this.seriesData.xAxisData
      // //   ? this.seriesData.xAxisData
      // //   : this.seriesData.data;
      // // this.Option.yAxis.data = this.seriesData.yAxisData
      // //   ? this.seriesData.yAxisData
      // //   : this.seriesData.data;
      // this.Option.yAxis.type = this.seriesData.yAxisType;
      // this.Option.yAxis.name = this.seriesData.yAxisName;

      // this.Option.title.text = this.seriesData.title;
      // this.Option.legend.data = legendData;
      // // this.Option.series = this.seriesData.data;
      this.chartbar.setOption(this.Option, true);
    }

    // this.updateChartView();
  },
  beforeDestroy() {},
  methods: {
    /**
     * 更新echart视图
     */
    updateChartView() {},
    /**
     * 当窗口缩放时，echart动态调整自身大小
     */
    handleWindowResize() {
      if (!this.chartbar) return;
      this.chartbar.resize();
    },
  },
};
</script>

<style lang="less" scoped>
.wating_box {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  img {
    margin-bottom: 15px;
  }
  .wating_text {
    font-family: PingFang SC;
    font-style: normal;
    font-weight: normal;
    font-size: 12px;
    color: #000000;
  }
}

.chartbar {
  width: 100%;
  height: 100%;
  overflow: hidden;
}
</style>