<template>
  <div class="model">
    <el-dialog
      :visible.sync="monitor.model"
      width="30%"
      :title="monitor.title"
      :close-on-click-modal="false"
      :destroy-on-close="true"
      @close="close"
    >
      <div class="monitor_content">
        <div class="content_img">
          <img src="../../../assets/home/yepian.png" alt="" />
        </div>
        <div class="content_text">
          <div class="text">叶片数量（片）： <span class="value">61</span></div>
          <div class="text">
            叶片数量（片）： <span class="value">5704.4</span>
          </div>
        </div>
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
    monitor: {
      type: Object,
      default: () => {
        return {
          model: false, //状态
          title: "", //标题
        };
      },
    },
  },
  created() {},
  mounted() {},
  methods: {
    close() {
      this.monitor.model = false;
    },
  },
};
</script>
<style scoped lang="less">
.monitor_content {
  height: 330px;
  display: flex;
  padding: 19px 24px 0 24px;
  .content_img {
    width: 60%;
    img {
      width: 100%;
      height: 100%;
    }
  }
  .content_text {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    .text {
      width: 100%;
      height: 40px;
      border-radius: 4px;
      background: #f5f7fa;
      display: flex;
      align-items: center;
      margin-bottom: 36px;
      padding-left: 16px;
      color: #606266;
      font-family: "Microsoft YaHei";
      font-size: 14px;
      font-style: normal;
      font-weight: 400;
      .value {
        color: #222222;
        font-size: 18px;
        font-weight: 400;
      }
    }
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
