<template>
  <div class="tab_boxs">
    <div
      class="tab_info"
      :class="{ box_seachQ: index == current }"
      @click="fileClick(index, item)"
      v-for="(item, index) in tabList"
      :key="item.index"
    >
      {{ item.name }}
      <i class="el-icon-arrow-right"></i>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    tabList: {
      type: Array,
      default: () => {
        return [];
      },
    },
    current: {
      type: Number,
      default: () => {
        return 0;
      },
    },
  },
  data() {
    return {
      cnName: "",
      //  current: "0",
    };
  },
  // watch: {
  //   tabIndex(val) {
  //     console.log("3333333333333", val);
  //     this.current = val;
  //   },
  //   deep: true,
  // },
  created() {
    console.log("!!!", this.$route.meta.cnName);
    this.cnName = this.$route.meta.cnName;
  },
  methods: {
    fileClick(index, Value) {
      // this.current = index;
      this.$emit("fileClick", index, Value);
    },
  },
};
</script>

<style lang="less" scoped>
.tab_boxs {
  width: 100%;
  .tab_info {
    width: 100%;
    height: 32px;
    line-height: 32px;
    cursor: pointer;
    padding: 0 7px 0 12px;
    margin-top: 10px;
    color: #666666;
  }
  /deep/ .el-icon-arrow-right {
    float: right;
    margin-top: 7px;
  }
}
.box_seachQ {
  background: rgba(68, 143, 247, 0.05);
  color: #448ff7 !important;
  padding: 0 7px 0 12px;
  cursor: pointer;
}
</style>
