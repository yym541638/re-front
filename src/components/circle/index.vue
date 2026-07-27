<template>
  <div class="circle" :style="'background:' + color"></div>
</template>
<script>
export default {
  props: {
    color: {
      type: String,
      default: () => {
        return "red";
      },
    },
  },
};
</script>
<style lang="less" scoped>
.circle {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: red;
}
</style>
