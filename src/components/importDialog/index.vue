<template>
  <!-- 打开弹框的动画 -->
  <transition name="animation">
    <div
      class="dialogBox"
      :class="{ isShowMask: mask == true }"
      v-show="isShowImportDialog"
    >
      <div class="dialogBoxContent" @click.stop>
        <div class="headhead">
          <slot name="header">
            <span>{{ title }}</span>
          </slot>
          <el-button size="small" type="text" @click="downloadExcel"
            >点击下载Excel模板</el-button
          >
        </div>
        <div class="bodybody">
          <div class="words">文件：</div>
          <div class="upLoadBox">
            <div class="upLoadLeft">
              <!-- 请选择一个Excel或CSV文件 -->
              <div class="upLoadInput"></div>
            </div>
            <div class="upLoadRight">
              <el-upload
                ref="upload"
                class="upload-demo"
                :action="url"
                :show-file-list="true"
                accept=".xlsx"
                :auto-upload="false"
                :before-upload="beforeExcelUpload"
                :on-error="upLoadError"
                :on-success="upLoadSuccess"
                :on-change="handleChange"
                :file-list="fileList"
                :headers="headers"
              >
                <el-button type="primary" size="small">选择文件</el-button>
              </el-upload>
            </div>
          </div>
        </div>
        <div class="footfoot">
          <el-button @click="close">关闭</el-button>
          <!-- :disabled="isDisabled" -->
          <el-button type="primary" @click="nowImport">保存</el-button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: "dialogComponent",
  props: {
    // 控制是否展示或隐藏对话框
    isShowImportDialog: {
      type: Boolean,
      default: false,
    },
    // 是否显示关闭小图标
    showCloseIcon: {
      type: Boolean,
      default: true,
    },
    // 是否开启背景遮罩层
    mask: {
      type: Boolean,
      default: true,
    },
    // 是否点击遮罩层mask关闭弹出框
    clickMaskClose: {
      type: Boolean,
      default: false,
      require: true,
    },
  },
  data() {
    return {
      title: "文件导入",
      url: "/baseUrl/api/aidpdatamanage" + "/point/importPointPojo",
      isDisabled: true, // 初始禁用，上传文件了以后，才解除禁用
      headers: {
        userid: JSON.parse(sessionStorage.getItem("userInfo")).userId,
        authorization:JSON.parse(sessionStorage.getItem("userInfo")).token
      },
      fileList: [],
    };
  },
  methods: {
    downloadExcel() {
      var a = document.createElement("a"); //创建一个<a></a>标签
      a.href = "/static/点表模板.xlsx"; // 给a标签的href属性值加上地址，注意，这里是绝对路径，不用加 点.
      a.download = "点表模板.xlsx"; //设置下载文件文件名，这里加上.xlsx指定文件类型，pdf文件就指定.fpd即可
      a.style.display = "none"; // 障眼法藏起来a标签
      document.body.appendChild(a); // 将a标签追加到文档对象中
      a.click(); // 模拟点击了a标签，会触发a标签的href的读取，浏览器就会自动下载了
      a.remove(); // 一次性的，用完就删除a标签
    },
    // 关闭弹出框
    close() {
      this.$emit("update:isShowImportDialog", false);
    },
    // 上传文件之前的验证
    beforeExcelUpload(file) {
      // console.log("看一下是什么文件", file);
      const isExcel =
        file.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
      if (!isExcel) {
        this.$alert(`文件上传失败，原因是：只能上传 .xlsx 格式的表格文件`, "提示", {
          confirmButtonText: "确定",
        });
      }
      this.isDisabled = false;
      return isExcel;
    },
    // 文件上传成功的回调
    upLoadSuccess(res, file) {
      // console.log("文件上传成功的返回值", res.data.duplicateWarnList);
      if (res.code == 0) {
        this.$refs.upload.clearFiles();
        this.$emit("update:isShowImportDialog", false);
        this.$emit("updateTable");
      } else {
        this.$message.error(res.msg);
        this.$refs.upload.clearFiles();
      }
    },
    // 文件上传失败回调
    upLoadError(err) {
      // console.log("返回错误信息",err);
      let errInfo = JSON.parse(err["message"]);
      this.$message.error(`文件上传失败，原因：${errInfo.message}`);
    },
    // 限制单次只能上传一个
    handleChange(file, fileList) {
      // console.log("文件列表", file, fileList);
      if (fileList.length > 1) {
        fileList.shift();
      }
    },
    // 立即导入按钮
    nowImport() {
      this.$refs.upload.submit();
    },
  },
};
</script>

<style lang="less" scoped>
.dialogBox {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 20;
  .dialogBoxContent {
    width: 618px;
    height: 220px;
    background: #ffffff;
    border-radius: 4px;
    .headhead {
      width: 100%;
      height: 52px;
      line-height: 52px;
      border-bottom: 1px solid #e9e9e9;
      box-sizing: border-box;
      padding: 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-family: PingFang SC;
      font-weight: 600;
      font-size: 16px;
      color: #000000;
      i {
        font-size: 20px;
        cursor: pointer;
      }
      i:hover {
        font-weight: 600;
      }
    }
    .bodybody {
      width: 100%;
      box-sizing: border-box;
      padding: 12px 24px 0 24px;
      .upLoadBox {
        margin-top: 12px;
        width: 100%;
        height: 36px;
        display: flex;
        align-items: center;
        position: relative;
        justify-content: space-between;
        .upLoadLeft {
          .upLoadInput {
            width: 470px;
            height: 36px;
            background: #f6f7fb;
            border: 1px solid #e9e9e9;
            box-sizing: border-box;
            border-radius: 4px;
            color: #9e9e9e;
            display: flex;
            align-items: center;
            font-size: 14px;
            font-family: PingFang SC;
            box-sizing: border-box;
            padding-left: 12px;
          }
        }
        .upLoadRight {
          margin-left: 16px;
        }
      }
    }
    .footfoot {
      display: flex;
      justify-content: center;
      width: 100%;
      padding-top: 20px;
    }
  }
}
/deep/ .words {
  font-family: PingFang SC;
  font-weight: 600;
  font-size: 16px;
  color: #000000;
}
.isShowMask {
  background-color: rgba(0, 0, 0, 0.3);
}
/deep/ .upLoadRight {
  .upload-demo {
    .el-upload-list {
      position: absolute;
      top: -4px;
      left: 40px;
      width: 68%;
    }
  }
}

.animation-enter,
.animation-leave-to {
  opacity: 0;
}
.animation-enter-active,
.animation-leave-active {
  transition: opacity 0.5s;
}
</style>
