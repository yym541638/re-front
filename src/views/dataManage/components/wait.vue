<template>
  <div class="model">
    <el-dialog
      :visible.sync="showmodel.dialog"
      width="20%"
      :close-on-click-modal="false"
    >
      <div class="analyse">
        <img src="./img/daoru.png" alt="" />
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {};
  },
  props: {
    showmodel: {
      type: Object,
      default: () => {
        return {
          dialog: false,
        };
      },
    },
  },
  methods: {},
};
</script>
<style scoped lang="less">
.analyse {
  width: 100%;
  height: 220px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}
/deep/.el-dialog__header {
  display: none;
}
/deep/.el-dialog__body {
  padding: 0 !important;
}
</style>
