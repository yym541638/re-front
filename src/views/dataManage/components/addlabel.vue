<template>
  <div class="model">
    <el-dialog
      :visible.sync="newLabel.model"
      width="25%"
      :title="newLabel.title"
      :close-on-click-modal="false"
      :destroy-on-close="true"
      @close="close"
    >
      <div class="dialog_content">
        <el-form
          :model="ruleForm"
          :rules="rules"
          ref="ruleForm"
          label-width="100px"
          class="demo-ruleForm"
          style="width: 100%"
          label-position="left"
        >
          <el-form-item label="标签值名称" prop="name">
            <el-input v-model="ruleForm.name"></el-input>
          </el-form-item>
          <el-form-item label="备注">
            <el-input
              type="textarea"
              maxlength="200"
              show-word-limit
              :autosize="{ minRows: 4, maxRows: 6 }"
              v-model="ruleForm.remarks"
            ></el-input>
          </el-form-item>
          <el-form-item label="颜色选择">
            <div class="circle_all">
              <div
                class="circle"
                :style="{ background: item.background }"
                v-for="(item, index) in ruleForm.circleArr"
                :key="index"
                @click="checkCircle(item, index)"
              >
                <img src="./img/check.png" alt="" v-if="item.status == true" />
              </div>
            </div>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button
          @click="close()"
          plain
          size="mini"
          style="color: #666666; border: 1px solid #cccccc"
          >取消</el-button
        >
        <el-button
          type="primary"
          size="mini"
          style="background: #536dfe; border-color: #536dfe"
          @click="identification('ruleForm')"
          >确定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      ruleForm: {
        name: "",
        remarks: "",
        circleArr: [
          {
            background: "#536DFE",
            color: "#E8EBFF",
            status: true,
          },
          {
            background: "#48BF5C",
            color: "#E6F6E9",
            status: false,
          },
          {
            background: "#FA9805",
            color: "#FBF2E4",
            status: false,
          },
          {
            background: "#FF1616",
            color: "#FAECEC",
            status: false,
          },
          {
            background: "#4EBDFC",
            color: "#D3ECFA",
            status: false,
          },
          {
            background: "#6A70B8",
            color: "#E8EBFF",
            status: false,
          },
        ],
      },
      rules: {
        name: [
          { required: true, message: "请输入标签值名称", trigger: "blur" },
          {
            pattern: /^[a-zA-Z0-9_\-\u4e00-\u9fa5]+$/,
            message: "标签值名称不能包含特殊字符",
            trigger: ["blur", "change"],
          },
        ],
      },
    };
  },
  props: {
    newLabel: {
      type: Object,
      default: () => {
        return {
          model: false, //状态
          title: "", //标题
        };
      },
    },
  },
  created() {
    if (this.newLabel.obj !== undefined) {
      this.ruleForm = {
        name: this.newLabel.obj.name,
        remarks: this.newLabel.obj.remarks,
        circleArr: this.newLabel.obj.colourType,
      };
    }
  },
  methods: {
    close() {
      this.newLabel.model = false;
      //   this.$emit("newLabelclose");
    },
    //确认
    identification(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$emit("identification", this.ruleForm);
        } else {
          return false;
        }
      });
      //   console.log(this.ruleForm, "sss1452018");
    },
    //勾选颜色
    checkCircle(item, index) {
      console.log("123456789", item);
      this.ruleForm.circleArr.forEach((circleItem) => {
        circleItem.status = false; // 假设正确的属性名是 status
      });
      this.ruleForm.circleArr[index].status = !item.status;
    },
  },
};
</script>
<style scoped lang="less">
.dialog_content {
  height: 330px;
  display: flex;
  padding: 20px 24px 0 24px;
  .circle_all {
    width: 100%;
    display: flex;
    .circle {
      width: 24px;
      height: 24px;
      margin-top: 10px;
      border-radius: 100%;
      margin-right: 15px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
    }
  }
  /deep/.el-form-item__label {
    color: #212121;
    font-family: "PingFang SC";
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
  }
  /deep/.el-form-item {
    margin-bottom: 35px !important;
  }
}
/deep/.dialog-footer {
  display: flex;
  justify-content: flex-end;
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
/deep/.el-dialog__footer {
  background: #ffff;
  border-top: 1px solid #e4e7ed;
  padding: 12px 24px 12px 0;
}
/deep/.el-dialog__body {
  padding: 0 !important;
}
/deep/.el-dialog {
  //   background: #242a4a;
  height: auto !important;
}
/depe/.el-dialog__headerbtn {
  top: 10px !important;
}
</style>
