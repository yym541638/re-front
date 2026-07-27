<template>
  <el-dialog :visible.sync="dialog.model" width="503px" @close="close">
    <!-- <div v-if="dialog.tootip" class="dialog_tootip">{{ dialog.tootip }}</div>
    <span slot="footer" class="dialog-footer">
      <el-button size="mini" @click="close()">{{
        dialog.leftBtn ? dialog.leftBtn : "取消"
      }}</el-button>
      <el-button size="mini" type="primary" @click="submit()">{{
        dialog.rightBtn ? dialog.rightBtn : "确 定"
      }}</el-button>
    </span> -->
    <div
      class="massageing"
      v-if="dialog.tootip"
      style="
        width: 300px;
        display: flex;
        font-size: 14px;
        color: #000000;
        font-weight: normal;
      "
    >
      <!-- <img src="../../assets/img/Polygon 5.png" alt="" /> -->
      <span> {{ dialog.tootip }}</span>
    </div>
    <div
      class="massageing"
      v-else
      style="
        width: 300px;
        display: flex;
        font-size: 14px;
        color: #000000;
        font-weight: normal;
      "
    >
      <!-- <img src="../../assets/img/Polygon 5.png" alt="" /> -->
      <span> 操作失败！</span>
    </div>
  </el-dialog>
</template>

<script>
export default {
  props: {
    dialog: {
      type: Object,
      default: () => {
        return {
          model: false, //弹窗状态
          tootip: "失败",
        };
      },
    },
    formTitles: {
      type: Array,
      default: () => {
        return [];
      },
    },
    form: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  data() {
    var validateEveryData = (rule, value, callback) => {
      console.log(rule, "/n", value);
      if (rule.reg != "") {
        if (rule.fontendType == "selectTree") {
          if (!this.form[rule.field]) {
            callback(new Error(rule.key + "不能为空"));
          } else if (!rule.reg.test(this.form[rule.field])) {
            callback(new Error(rule.key + "不符合要求"));
          } else {
            callback();
          }
        } else if (!value) {
          callback(new Error(rule.key + "不能为空"));
        } else if (!rule.reg.test(value)) {
          callback(new Error(rule.key + "不符合要求"));
        } else {
          callback();
        }
      } else if (rule.fontendType == "selectTree") {
        if (!this.form[rule.field]) {
          callback(new Error(rule.key + "不能为空"));
        } else {
          callback();
        }
      } else if (rule.fontendType == "switch") {
        if (!this.form[rule.field]) {
          this.form[rule.field] = false;
          callback();
        } else {
          callback();
        }
      } else if (value != "0" && !value) {
        callback(new Error(rule.key + "不能为空"));
      } else {
        callback();
      }
    };
    return { validateEveryData: validateEveryData, selectData: {} };
  },
  methods: {
    // 弹窗关闭事件
    close() {
      this.dialog.model = false;
      this.$emit("Erroe", false);
    },
    // 弹窗确定事件
    // submit() {
    //   this.dialog.model = false;
    //   this.$emit("message", true);
    // },
  },
  mounted() {
    setInterval(() => {
      this.dialog.model = false;
    }, 2000);
  },
};
</script>

<style lang="less" scoped>
/deep/.el-dialog__header {
  border-bottom: 1px solid #e9e9e9;
  font-family: ".PingFang SC";
  font-style: normal;
  font-weight: 600;
  font-size: 16px;
  color: #000000;
  padding-bottom: 16px;
  padding-top: 16px;

  display: flex;
  align-items: center;
  justify-content: space-between;
  /deep/.el-dialog__headerbtn {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  /deep/.el-dialog__close {
    font-size: 18px;
  }
}
/deep/.el-dialog__body {
  padding: 0 67px;
  .dialog_tootip {
    font-family: PingFang SC;
    font-style: normal;
    font-weight: normal;
    font-size: 16px;
    color: #000000;
    text-align: center;
    text-transform: capitalize;
    width: 100%;
    height: 146px;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
  }
}
/deep/.el-dialog__footer {
  border-top: 2px solid #e9e9e9;
  padding-bottom: 12px;
  padding-top: 12px;
}
/deep/.el-form {
  display: flex;
  justify-content: center;
  //   flex-wrap: wrap;
  /deep/.el-select,
  /deep/.el-date-editor {
    width: 100% !important;
  }
  .el-form-item {
    width: 100%;
    margin: 0 3% 2%;
    display: flex;
    align-items: center;
    .el-form-item__content {
      //   width: 80%;
      flex: 1;
    }
  }
}
/deep/.el-dialog__header {
  display: none;
}
/deep/.el-dialog__body {
  padding: 14px 29px !important;
}

img {
  width: 21px;
  height: 21px;
  margin-right: 7px;
  vertical-align: text-bottom;
}
</style>