<template>
  <div class="model">
    <el-dialog
      :visible.sync="newBulk.model"
      width="35%"
      :title="newBulk.title"
      :close-on-click-modal="false"
      :destroy-on-close="true"
      @close="close"
    >
      <div class="dialog_content">
        <div class="dialog_content_top">
          <div class="title">
            {{
              newBulk.title == "导入"
                ? "一、请按照模板格式填写需要导入的数据"
                : "一、请按照模板格式填写需要检查的点标识"
            }}
          </div>
          <div class="down" @click="downFile">点击下载Excle模板</div>
          <div class="tip_msg">
            数据请勿放在合并的单元格中,文件所含数据不超过500条
          </div>
        </div>
        <div class="dialog_content_bottom">
          <div class="title">二、上传文件</div>
          <el-upload
            class="servlet_all"
            action="#"
            accept=".xlsx"
            v-model="impFile"
            drag
            :limit="1"
            :auto-upload="false"
            :file-list="impFile"
            :on-change="getmodel"
            :on-remove="handleRemove"
            :on-exceed="handleExceed"
          >
            <div class="servlet">
              <div>
                <img src="./img/big_add.png" alt="" />
              </div>
              <div class="up_msg">
                <div class="on_up">点击或拖拽文件上传</div>
                <div class="type">支持xls、xlsx格式</div>
              </div>
            </div>
          </el-upload>
        </div>
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
          @click="wellDefined()"
          >导入</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      impFile: [],
    };
  },
  props: {
    newBulk: {
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
  methods: {
    close() {
      this.impFile = [];
      this.newBulk.model = false;
    },
    //下载模板 inspectTemplate
    async downFile() {
      console.log(this.newBulk.title, "看看名称");
      if (this.newBulk.title == "导入") {
        let res = await this.$api.downloadTemplate();
        if (res.code == 0) {
          var proview = window.open("_blank");
          let PublicdownloadAd = "/tao/dropData/downloadFile?address=";
          let url = `${PublicdownloadAd}${res.data}`;
          proview.location = url;
          this.$message.success("模板下载成功");
        }
      } else {
        let res = await this.$api.inspectTemplate();
        if (res.code == 0) {
          var proview = window.open("_blank");
          let PublicdownloadAd = "/tao/dropData/downloadFile?address=";
          let url = `${PublicdownloadAd}${res.data}`;
          proview.location = url;
          this.$message.success("模板下载成功");
        }
      }
      // let res = await this.$api.downloadTemplate();
      // if (res.code == 0) {
      //   var proview = window.open("_blank");
      //   let PublicdownloadAd = "/ren/dropData/downloadFile?address=";
      //   let url = `${PublicdownloadAd}${res.data}`;
      //   proview.location = url;
      //   this.$message.success("模板下载成功");
      // }
    },
    //确认
    wellDefined() {
      if (this.impFile.length > 0) {
        this.$emit("wellDefined", this.impFile);
      } else {
        this.$message({
          message: "请下载表格模板并导入文件",
          type: "warning",
        });
      }
    },
    getmodel(file, fileList) {
      console.log(fileList, "类型");
      this.impFile = fileList;
    },
    //移除文件
    handleRemove(file, fileList) {
      this.impFile = fileList;
      //   console.log(file, "移除文件!!!", fileList);
    },
    handleExceed() {
      this.$message.warning(` 最多只能上传一个文件! `);
    },
  },
};
</script>
<style scoped lang="less">
.dialog_content {
  height: 410px;
  display: flex;
  padding: 24px 24px 0 24px;
  flex-direction: column;
  .dialog_content_top {
    display: flex;
    flex-direction: column;
    margin-bottom: 24px;
    .title {
      font-family: PingFang SC;
      font-size: 14px;
      font-weight: 400;
      color: #333333;
      line-height: 20px;
      margin-bottom: 12px;
    }
    .down {
      cursor: pointer;
      font-family: PingFang SC;
      font-size: 14px;
      font-weight: 400;
      color: #536dfe;
      line-height: 20px;
      margin-bottom: 6px;
    }
    .tip_msg {
      font-family: PingFang SC;
      font-size: 12px;
      font-weight: 400;
      color: #999999;
      line-height: 17px;
    }
  }
  .dialog_content_bottom {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: calc(100% - 140px);
    .title {
      font-family: PingFang SC;
      font-size: 14px;
      font-weight: 400;
      line-height: 20px;
      color: #333333;
    }
    .servlet_all {
      display: flex;
      flex-direction: column;
      margin-top: 12px;
      .servlet {
        width: 100%;
        height: 200px;
        border: 1px dashed #e9e9e9;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        .up_msg {
          .on_up {
            font-family: PingFang SC;
            font-size: 14px;
            font-weight: 400;
            line-height: 24px;
            color: #333333;
          }
          .type {
            font-family: PingFang SC;
            font-size: 12px;
            font-weight: 400;
            line-height: 16.8px;
            color: #999999;
          }
        }
      }
      /deep/.el-upload-list {
        margin-top: 10px !important;
      }
      /deep/.el-upload-list__item-name {
        font-family: PingFang SC;
        font-size: 12px;
        font-weight: 400;
        color: #333333;
      }
      /deep/.el-upload-dragger {
        width: 100%;
        height: 200px;
      }
      /deep/.el-upload:focus .el-upload-dragger {
        width: 100%;
        height: 200px;
      }
    }
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
  height: auto !important;
}
/depe/.el-dialog__headerbtn {
  top: 10px !important;
}
</style>
<style>
.el-upload-dragger:hover {
  border-color: #536dfe !important;
}
</style>
