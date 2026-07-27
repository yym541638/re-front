<template>
  <!-- 打开弹框的动画 -->
  <transition name="animation">
    <div class="loadindWrap" v-if="showLoading" :style="{ background: backgroundColor }">
      <div class="loadingContent">
        <div class="iBox">
          <transition name="animation">
            <img src="./cal.gif" alt="" />
          </transition>
        </div>
        <transition name="animation">
          <div class="text">{{ text }}</div>
        </transition>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  data() {
    return {
      showLoading: false, // 控制显示与隐藏的标识
      backgroundColor: "rgba(255, 255, 255, 0.85)", // 默认背景色
      text: "加载中...", // 默认文字
    };
  },
};
</script>

<style lang="less" scoped>
.loadindWrap {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 99;
  .loadingContent {
    // color: #409eff;
    color: #222;
    font-weight: 600;
    text-align: center;
    .iBox {
      width: 400px;
      height: 225px;
      margin-bottom: 6px;
      i {
        font-size: 20px;
        color: #409eff !important;
        // background-color: #409eff;
      }
    }
  }
}
// 加一个过渡效果
.animation-enter,
.animation-leave-to {
  opacity: 0;
}
.animation-enter-active,
.animation-leave-active {
  transition: opacity 0.6s;
}
</style>
