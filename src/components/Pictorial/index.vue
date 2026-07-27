<template>
  <Pictorial
    v-if="series.length > 0"
    :title="title"
    :series="series"
    :legend="legend"
    :dataX="dataX"
    :dataY="dataY"
  />
  <errorCard v-else watingText="图形加载错误，请刷新重试!" />
  <!-- :title="title" -->
</template>



<script>
import pictorial from "./pictorial.vue";
export default {
  components: {
    Pictorial: pictorial,
  },
  props: {
    series: {
      type: Array,
      default: () => [],
    },
    title: { type: String, default: () => "" },
    legend: {
      type: Object,
      default: () => {},
    },
    dataY: { type: Array, default: () => [] },
    dataX: { type: Array, default: () => [] },
  },
  created() {
    console.log("this.seriesData", this.seriesData);
  },
};
</script>

