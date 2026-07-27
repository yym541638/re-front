<template>
  <div class="model">
    <el-dialog
      :visible.sync="trend.model"
      width="40%"
      :title="trend.title"
      :close-on-click-modal="false"
      :destroy-on-close="true"
      @close="close"
    >
      <div class="trend_content">
        <div class="trendTime">
          <span class="demonstration">时间</span>
          <el-date-picker
            v-model="value1"
            type="datetimerange"
            value-format="yyyy-MM-dd HH:mm:ss"
            format="yyyy-MM-dd HH:mm:ss"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            @change="change"
          >
          </el-date-picker>
        </div>
        <div class="mychart" ref="history"></div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      history: null,
      value1: [],
    };
  },
  props: {
    trend: {
      type: Object,
      default: () => {
        return {
          model: false,
          title: "",
        };
      },
    },
  },
  created() {},
  mounted() {
    this.$nextTick(() => {
      this.historyValue({});
    });
  },
  methods: {
    change(val) {
      console.log(val);
      this.getHisTrend(val);
    },
    async getHisTrend(val) {
      const res = await this.$api.getHisTrend({
        start: val[0],
        end: val[1],
      });
      if (res.code == 0) {
        this.$nextTick(() => {
          this.historyValue(res.data);
        });
      }
    },
    historyValue(data) {
      this.history = this.$echarts.init(this.$refs.history);
      this.history.setOption({
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "line",
          },
        },
        grid: {
          right: "15%",
          left: "6%",
          bottom: "9%",
        },
        dataZoom: {
          type: "inside",
        },
        legend: {
          top: 10,
          left: -2,
          itemWidth: 8,
          itemHeight: 8,
          icon: "circle",
          data: ["频率", "振幅", "间隙"],
          textStyle: {
            fontSize: 12,
            fontFamily: "Microsoft YaHei",
            fontWeight: "400",
            color: "#606266",
          },
        },
        xAxis: {
          type: "category",
          axisLabel: {
            textStyle: {
              fontSize: 14,
              color: "#A6ADBD", // 刻度文字颜色
            },
          },
          axisTick: {
            show: false, //去掉X轴刻度
            inside: true,
            lineStyle: {
              color: "#BDBDBD", //刻度线的颜色
            },
          },
          axisLine: {
            lineStyle: {
              type: "solid",
              color: "rgba(219, 224, 235, 0.2)",
            },
          },
          data: data.times,
        },
        yAxis: [
          {
            type: "value",
            name: "Hz",
            min: 0,
            max: 500,
            position: "left",
            axisTick: {
              show: false,
            },
            axisLine: {
              show: false,
              lineStyle: {
                color: "#aaaaaa",
              },
            },
            splitLine: {
              show: true,
            },
          },
          {
            type: "value",
            name: "mm",
            min: -1,
            max: 5,
            position: "right",
            offset: 80,
            axisTick: {
              show: false,
            },
            axisLine: {
              show: false,
              lineStyle: {
                color: "#aaaaaa",
              },
            },
            splitLine: {
              show: true,
            },
          },
          {
            type: "value",
            name: "mm",
            min: -1.5,
            max: 1.5,
            position: "right",
            axisTick: {
              show: false,
            },
            splitLine: {
              show: true,
            },
            axisLine: {
              show: false,
              lineStyle: {
                color: "#aaaaaa",
              },
            },
          },
        ],
        series: [
          {
            name: "频率",
            type: "line",
            color: "#0775DB",
            showSymbol: false,
            data: data.freq,
          },
          {
            name: "振幅",
            type: "line",
            yAxisIndex: 1,
            color: "#8776F0",
            showSymbol: false,
            data: data.amp,
          },
          {
            name: "间隙",
            type: "line",
            yAxisIndex: 2,
            color: "#FFA07A",
            showSymbol: false,
            data: data.gap,
          },
        ],
      });
      window.addEventListener("resize", () => {
        this.history.resize();
      });
    },
    close() {
      this.trend.model = false;
    },
  },
};
</script>
<style scoped lang="less">
.trend_content {
  height: 440px;
  display: flex;
  padding: 19px 24px 0 24px;
  flex-direction: column;
  .trendTime {
    height: 26px;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    .demonstration {
      color: #606266;
      margin-right: 12px;
      font-family: "Microsoft YaHei";
      font-size: 12px;
      font-style: normal;
      font-weight: 400;
    }
    /deep/.el-range-editor.el-input__inner {
      height: 26px;
    }
    /deep/.el-input__icon {
      line-height: 21px;
    }
    /deep/.el-range-separator {
      line-height: 18px;
    }
  }
  .mychart {
    width: 100%;
    height: 100%;
  }
}

/deep/.el-dialog__header {
  display: flex;
  align-items: center;
  border-bottom: 1px solid #e9e9e9;
}
/deep/.el-dialog__title {
  font-family: PingFang SC;
  font-size: 16px;
  font-weight: 400;
  color: #000000;
}

/deep/.el-dialog__body {
  padding: 0 !important;
}
/deep/.el-dialog {
  height: auto !important;
}
</style>
