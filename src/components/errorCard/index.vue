<template>
  <div class="wating_box">
    <img src="../../../public/img/wating.png" alt="" />
    <div class="wating_text">
      {{ watingText }}
    </div>
 <div style="color:#536DFE; fontSize: 18px;  marginTop: 10px;" class="el-icon-loading"></div>
  </div>
</template>
<script>
export default {
  props: {
    watingText: {
      type: String,
      default: "加载错误，请刷新重试!",
    },
  },
};
</script>

<style lang="less" scoped>
.wating_box {
  position: absolute;
  left: 0;
  top: 0;
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
    font-size: 14px;
    color: #000000;
  }
}
</style>