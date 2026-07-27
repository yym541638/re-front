<template>
  <chart
    class="c-echart"
    :options="curOptions"
    :init-options="initOptions"
    ref="curChart"
    autoresize
  />
</template>

<script>
import ECharts from "vue-echarts";
import "echarts/lib/chart/bar";
import "echarts/lib/component/tooltip";
import "echarts/theme/dark";

export default {
  name: "VChart",
  props: {
    cType: {
      type: String,
      default: "bar"
    },
    options: {
      type: Object,
      default() {
        return null;
      }
    }
  },
  computed: {
    curOptions() {
      if (this.options) {
        // 从外面传进 options 实现多个图标展示数据不冲突
        return this.options;
      }
      return {};
    }
  },
  data() {
    return {
      initOptions: {
        renderer: "svg"
      }
    };
  },

  methods: {
    refresh() {
      // simulating async data from server
      this.seconds = 3;
      let curChart = this.$refs.curChart;
      curChart.showLoading({
        text: "Loading…",
        color: "#4ea397",
        maskColor: "rgba(255, 255, 255, 0.4)"
      });
      let timer = setInterval(() => {
        this.seconds--;
        if (this.seconds === 0) {
          clearTimeout(timer);
          curChart.hideLoading();
          //   this.curOptions =
        }
      }, 1000);
    }
  },

  components: {
    chart: ECharts
  }
};
</script>
<style lang="less">
.c-echart {
  min-width: 900px;
  height: 100%;
}
</style>
