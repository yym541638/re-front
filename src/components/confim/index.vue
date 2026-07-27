<template>
  <el-dialog
    :close-on-click-modal="false"
    :title="dialog.title"
    :visible.sync="dialog.model"
    width="30%"
    :modal="false"
    @close="close"
  >
    <div v-if="dialog.tootip" class="dialog_tootip">
      <div v-if="imgShow">
        <span
          v-if="
            dialog.tootip == '确定删除预警信息？' &&
            this.$route.name !== 'maintenanceworkbench'
          "
        >
          <img :src="$utils.requireImg('delect', 'confim')" alt="" />
        </span>
        <span v-else-if="this.$route.name !== 'maintenanceworkbench'">
          <img :src="$utils.requireImg('Vector', 'confim')" alt="" />
        </span>
        <span v-else> </span>
      </div>
      {{ dialog.tootip }}
    </div>
    <span slot="footer" class="dialog-footer" style="text-align: center">
      <el-button size="mini" @click="close()">{{
        dialog.leftBtn ? dialog.leftBtn : "取消"
      }}</el-button>
      <el-button size="mini" type="primary" @click="confim()">{{
        dialog.rightBtn ? dialog.rightBtn : "确 定"
      }}</el-button>
    </span>
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
          title: "", //标题
          icon: "Vector",
          tootip: "", //提示信息
          rightBtn: "", //自定义确认按钮
          leftBtn: "", //自定义取消按钮
        };
      },
    },
    // 是否需要图片
    imgShow: {
      type: Boolean,
      default: () => {
        return true;
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
      this.$emit("cancel");
    },
    // 弹窗确定事件
    confim() {
      this.dialog.model = false;
      this.$emit("confim", true);
    },
  },
};
</script>
<style lang="less" scoped>
@import "~@/common/less/main.less";
/deep/.el-dialog__header {
  border-bottom: 1px solid #E9E9E9 !important;
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
  border-top: unset !important;
  padding-bottom: 12px;
  padding-top: 12px;
  text-align: right !important;
}
/deep/.el-button--primary {
  background-color: @maincolor!important;
  border-color: @maincolor!important;
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
img {
  margin-right: 15px;
}
</style>
