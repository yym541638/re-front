<template>
  <echarline v-if="seriesData.data" :series-data="seriesData" />
  <errorCard v-else watingText="图形加载错误，请刷新重试!" />
</template>



<script>
import echarline from "./echarline.vue";
export default {
  components: {
    echarline,
  },
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
  created(){
    console.log("this.seriesData",this.seriesData)
  }
};
</script>

