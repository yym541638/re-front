<template>
  <div class="model">
    <el-dialog
      :visible.sync="newLabel.model"
      width="50%"
      :title="newLabel.title"
      :close-on-click-modal="false"
      :destroy-on-close="true"
      @close="close"
    >
      <div class="dialog_content">
        <!-- 切换设备端 -->
        <div class="content_title">
          <div class="title_tab">
            <div
              v-for="(item, index) in TabArr"
              :key="index"
              :class="['tab_item', { highLight: whichIndex === index }]"
              @click="
                whichIndex = index;
                switchover();
              "
            >
              {{ item.name }}
            </div>
          </div>

          <!-- 切换图表类型 -->
          <el-select
            style="width: 10%"
            v-model="value"
            placeholder="请选择"
            @change="change"
          >
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.value"
              :value="item.value"
            />
          </el-select>
        </div>

        <!-- 饼图区域 -->
        <div v-if="value === '列表'" class="content_echarts">
          <div class="echarts" ref="pieEcharts"></div>
          <div class="table">
            <Vxetable
              ref="invoiceVxeTable"
              :tableTitles="tableTitles1"
              :tableData="tableData1"
              :selection="false"
              :operation="false"
              :tablePageState="false"
              :seq="false"
            >
              <template slot="name" slot-scope="{ row }">
                <div class="bladeBox">
                  <div class="blade"></div>
                  {{ row.name }}
                </div>
              </template>
            </Vxetable>
          </div>
        </div>

        <!-- 柱形图区域 -->
        <div v-else class="content_echarts_Bar">
          <div class="Bar_title">
            <div
              v-for="(item, index) in titleArr"
              :key="index"
              :class="['title_item', { titlehighLight: titleIndex === index }]"
              @click="switchBarChart(index)"
            >
              {{ item.name }}
            </div>
          </div>
          <div class="echartsBar" ref="barEcharts"></div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: "BladeChartDialog",
  props: {
    newLabel: {
      type: Object,
      default: () => ({
        model: false,
        title: "",
      }),
    },
  },
  data() {
    return {
      echartsPie: null,
      echartsBar: null,
      value: "列表", // 默认显示饼图
      whichIndex: 0, // 当前设备端索引
      titleIndex: 0, // 柱状图当前选择项
      tableData1: [],
      TabArr: [{ name: "调阀端" }, { name: "电机端" }],
      titleArr: [{ name: "频率" }, { name: "振幅" }, { name: "间隙" }],
      options: [{ value: "列表" }, { value: "柱形图" }],
      tableTitles1: [
        {
          fieldName: "name",
          titleName: "叶片名称",
          fontendType: "slot",
          width: 120,
        },
        { fieldName: "freq", titleName: "频率（HZ）", width: 107 },
        { fieldName: "amp", titleName: "振幅（mm）", width: 107 },
        { fieldName: "gap", titleName: "间隙（mm）", width: 103 },
      ],
    };
  },
  created() {
    this.switchover(0);
  },
  mounted() {
    this.$nextTick(() => {
      if (this.value === "列表") {
        this.echartsValue();
      }
    });
  },
  beforeDestroy() {
    this.disposeEChartsInstances();
  },
  methods: {
    // 切换设备端或图表类型时触发
    async switchover() {
      switch (this.value) {
        case "列表":
          await this.getVibDel(this.whichIndex);
          break;
        case "柱形图":
          this.switchBarChart(0);
          break;
        default:
          break;
      }
    },

    // 获取饼图数据（表格）
    async getVibDel(index) {
      const res = await this.$api.getVibDel({
        device: index === 0 ? "调阀端" : "电机端",
      });
      if (res.code === 0) {
        this.tableData1 = res.data;
      }
    },

    // 切换柱状图类型
    async switchBarChart(index) {
      this.titleIndex = index;
      const res = await this.$api.getVibHisto({
        device: this.whichIndex === 0 ? "调阀端" : "电机端",
      });
      if (res.code === 0) {
        this.barValue(res.data, index);
      }
    },

    // 初始化饼图
    echartsValue() {
      if (this.echartsPie) return;

      this.echartsPie = this.$echarts.init(this.$refs.pieEcharts);

      const testSeries = Array.from({ length: 61 }, (_, i) => {
        const custValue = i % 2 === 0 ? 103 : 100;
        return {
          value: custValue,
          name: `${i + 1}`,
          itemStyle: {
            normal: {
              color: "#999999",
              borderWidth: 3,
              borderColor: "#ffffff",
              shadowColor: "#ffffff",
              shadowBlur: 30,
            },
          },
          label: {
            normal: {
              show: true,
              position: "outside",
              formatter: "{b}",
              textStyle: {
                fontWeight: "100",
                fontFamily: "Microsoft YaHei",
                color: "#606266",
              },
            },
          },
          labelLine: {
            normal: {
              show: true,
              smooth: false,
              length: 10,
              length2: 10,
            },
            emphasis: { show: false },
          },
        };
      });

      this.echartsPie.setOption({
        title: {
          text: "叶片位置图",
          x: "center",
          y: "91%",
          textStyle: {
            color: "#606266",
            fontSize: 14,
            fontWeight: "normal",
            fontFamily: "Microsoft YaHei",
          },
        },
        calculable: true,
        series: [
          {
            name: "",
            type: "pie",
            startAngle: 0,
            clockwise: false,
            radius: ["30%", "80%"],
            center: ["50%", "45%"],
            roseType: "area",
            avoidLabelOverlap: false,
            labelLine: {
              normal: {
                smooth: false,
                length: 10,
                length2: 10,
              },
              emphasis: { show: true },
            },
            label: {
              show: true,
              position: "inside",
              formatter: "{c}$",
              textStyle: {
                fontWeight: "100",
                fontFamily: "Microsoft YaHei",
                color: "#FAFAFA",
              },
            },
            itemStyle: {
              normal: {
                borderWidth: 3,
                borderColor: "#19181d",
                shadowColor: "#19181d",
                shadowBlur: 30,
              },
            },
            data: testSeries,
          },
          {
            type: "pie",
            radius: ["30%", "30%"],
            data: [100],
            center: ["50%", "50%"],
            itemStyle: { normal: { color: "rgba(0,0,0,0)" } },
            hoverAnimation: false,
            label: { show: false },
          },
          {
            type: "pie",
            radius: ["26.5%", "27%"],
            data: [100],
            center: ["50%", "50%"],
            color: "rgba(0,0,0,0)",
            hoverAnimation: false,
            label: { show: false },
          },
        ],
      });

      this.addResizeListener("pie");
    },

    // 渲染柱状图
    barValue(data, index) {
      if (this.echartsBar) {
        this.echartsBar.clear();
      } else {
        this.echartsBar = this.$echarts.init(this.$refs.barEcharts);
      }

      this.echartsBar.setOption({
        tooltip: { trigger: "axis" },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "10%",
          containLabel: true,
        },
        xAxis: [
          {
            type: "category",
            data: data.axisX,
            name: "叶片",
            nameGap: 25,
            axisLine: {
              show: true,
              lineStyle: {
                type: "dotted",
                color: "rgba(219, 224, 235, 0.2)",
              },
            },
            axisTick: { show: false },
            axisLabel: { textStyle: { color: "#909399" } },
          },
        ],
        yAxis: [
          {
            type: "value",
            name: "频率/Hz",
            axisLabel: { formatter: "{value}", color: "#909399" },
            axisLine: {
              show: false,
              lineStyle: { type: "dotted", color: "#aaaaaa" },
            },
            axisTick: { show: false },
            splitLine: { show: true },
          },
        ],
        series: [
          {
            type: "bar",
            data: index === 0 ? data.freq : index === 1 ? data.amp : data.gap,
            itemStyle: { color: "#0775DB", opacity: 1 },
          },
        ],
      });

      this.addResizeListener("bar");
    },
    // 切换图表类型
    change(val) {
      this.value = val;
      switch (val) {
        case "列表":
          this.getVibDel(this.whichIndex);
          this.disposeChart("bar");
          this.$nextTick(() => {
            if (!this.echartsPie) this.echartsValue();
          });
          break;
        case "柱形图":
          this.disposeChart("pie");
          this.$nextTick(() => {
            if (!this.echartsBar) this.switchBarChart(0);
          });
          break;
        default:
          break;
      }
    },

    // 销毁指定图表实例
    disposeChart(type) {
      if (type === "pie" && this.echartsPie) {
        this.echartsPie.dispose();
        this.echartsPie = null;
      } else if (type === "bar" && this.echartsBar) {
        this.echartsBar.dispose();
        this.echartsBar = null;
      }
    },

    // 销毁所有图表实例
    disposeEChartsInstances() {
      this.disposeChart("pie");
      this.disposeChart("bar");
      window.removeEventListener("resize", this.handleResize);
    },

    // 添加 resize 事件监听
    addResizeListener() {
      window.addEventListener("resize", this.handleResize);
    },

    // 窗口大小变化时重绘图表
    handleResize() {
      if (this.echartsPie) this.echartsPie.resize();
      if (this.echartsBar) this.echartsBar.resize();
    },

    close() {
      this.newLabel.model = false;
    },
  },
};
</script>
<style scoped lang="less">
.dialog_content {
  height: 530px;
  display: flex;
  padding: 19px 24px 0 24px;
  flex-direction: column;
  .content_title {
    width: 100%;
    height: 32px;
    display: flex;
    justify-content: space-between;
    margin-bottom: 35px;
    /deep/.el-input__inner {
      border: none !important;
    }
    .title_tab {
      width: 164px;
      height: 32px;
      border-radius: 4px;
      background: #f0f2f5;
      padding: 4px;
      display: flex;
    }

    .highLight {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #ffffff !important;
      font-family: "Microsoft YaHei";
      font-size: 14px;
      font-style: normal;
      font-weight: 400;
      background: #0775db;
      border-radius: 4px;
      cursor: pointer;
    }
    .tab_item {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #606266;
      font-family: "Microsoft YaHei";
      font-size: 14px;
      font-style: normal;
      font-weight: 400;
      cursor: pointer;
    }
  }
  .content_echarts_Bar {
    width: 100%;
    flex: 1;
    display: flex;
    flex-direction: column;
    .Bar_title {
      height: 36px;
      width: 100%;
      display: flex;
      align-items: center;
      .title_item {
        color: #606266;
        font-family: "Microsoft YaHei";
        font-size: 14px;
        font-style: normal;
        font-weight: 400;
        margin-right: 48px;
        cursor: pointer;
      }
      .titlehighLight {
        color: #0775db;
        border-bottom: 2px solid #0775db;
        cursor: pointer;
      }
    }
    .echartsBar {
      flex: 1;
    }
  }
  .content_echarts {
    width: 100%;
    flex: 1;
    display: flex;

    .echarts {
      flex: 1;
    }
    .table {
      flex: 1;
      border-radius: 4px;
      background: #f0f2f5;
      z-index: 9999 !important;
      padding: 0 10px 10px 10px;
    }
  }
  .circle_all {
    width: 100%;
    display: flex;
    .circle {
      width: 24px;
      height: 24px;
      margin-top: 10px;
      border-radius: 100%;
      margin-right: 15px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
    }
  }
}
/deep/.dialog-footer {
  display: flex;
  justify-content: flex-end;
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
/deep/.el-dialog__footer {
  background: #ffff;
  border-top: 1px solid #e4e7ed;
  padding: 12px 24px 12px 0;
}
/deep/.el-dialog__body {
  padding: 0 !important;
}
/deep/.el-dialog {
  height: auto !important;
}

.bladeBox {
  align-items: center;
  display: flex;
}
.blade {
  width: 16px;
  height: 10px;
  border-radius: 2px;
  background: #909399;
  margin-right: 8px;
}
</style>
