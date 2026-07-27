<template>
  <div class="model">
    <el-dialog
      :visible.sync="newMark.model"
      width="27%"
      :title="newMark.title"
      :close-on-click-modal="false"
      :destroy-on-close="true"
      @close="close"
    >
      <div class="dialog_content">
        <el-form
          ref="form"
          :model="markData"
          label-width="100px"
          style="width: 100%"
          label-position="left"
        >
          <el-form-item label="编辑方式">
            <el-radio-group v-model="markData.resource" @input="getSingeData">
              <el-radio :label="1">导入</el-radio>
              <el-radio :label="2">拼接</el-radio>
              <el-radio :label="3">替换</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="模板下载" v-if="markData.resource == 1">
            <div class="stencil">
              <img src="./img/up_data.png" alt="" />
              <span @click="undataFile">下载</span>
            </div>
          </el-form-item>
          <el-form-item label="文件上传" v-if="markData.resource == 1">
            <el-upload
              class="servlet_all"
              action="#"
              accept=".xlsx"
              v-model="markData.batchFile"
              :limit="1"
              :auto-upload="false"
              :file-list="markData.batchFile"
              :on-change="getmodel"
              :on-remove="handleRemove"
              :on-exceed="handleExceed"
            >
              <div class="servlet">
                <img src="./img/add.png" alt="" />
                <span>上传文件</span>
              </div>
              <!-- <el-button size="small" type="white"
                ><i class="el-icon-map"></i>上传文件</el-button
              > -->
            </el-upload>
          </el-form-item>
          <el-form-item label="查找值" v-if="markData.resource == 3">
            <el-input v-model="markData.find" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item label="替换值" v-if="markData.resource == 3">
            <el-input
              v-model="markData.replace"
              placeholder="请输入"
            ></el-input>
          </el-form-item>
          <el-form-item label="拼接值" v-if="markData.resource == 2">
            <span slot="label"
              >拼接值
              <el-tooltip class="item" effect="dark" placement="bottom"
                ><div slot="content" class="multiline-content">
                  拼接对象位于源标识前
                </div>
                <i class="el-icon-info"></i>
              </el-tooltip>
            </span>
            <el-input
              v-model="markData.splicing"
              placeholder="请输入"
            ></el-input>
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
          :loading="loadStatus"
          @click="identification()"
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
      markData: {
        resource: 1,
        batchFile: [],
        find: "",
        replace: "",
        splicing: "",
      },
    };
  },
  props: {
    newMark: {
      type: Object,
      default: () => {
        return {
          model: false, //状态
          title: "", //标题
        };
      },
    },
    loadStatus: {
      type: Boolean,
      default: () => {
        return false;
      },
    },
  },
  created() {},
  methods: {
    //点击radio清空数据
    getSingeData() {
      // console.log(this.markData, "表单数据");
    },
    close() {
      this.newMark.model = false;
      //   this.$emit("newLabelclose");
    },
    //确认
    identification() {
      switch (this.markData.resource) {
        case 1:
          // delete this.markData.find;
          // delete this.markData.replace;
          // delete this.markData.splicing;
          if (this.markData.batchFile.length > 0) {
            this.$emit("identification", this.markData);
          } else {
            this.$message.warning("请上传文件");
          }
          break;
        case 2:
          // delete this.markData.batchFile;
          // delete this.markData.find;
          // delete this.markData.replace;
          if (this.markData.splicing !== "") {
            this.$emit("identification", this.markData);
          } else {
            this.$message.warning("请输入拼接值");
          }
          break;
        case 3:
          // delete this.markData.batchFile;
          // delete this.markData.splicing;
          // && this.markData.replace !== ""
          if (this.markData.find !== "") {
            this.$emit("identification", this.markData);
          } else {
            this.$message.warning("请输入查找值");
          }
          break;

        default:
          break;
      }

      // console.log(this.markData.splicing == "", "sxk142018");
      // this.$emit("identification");
    },
    getmodel(file, fileList) {
      //   console.log(fileList, "类型");
      this.markData.batchFile = fileList;
    },
    //移除文件
    handleRemove(file, fileList) {
      this.markData.batchFile = fileList;
      //   console.log(file, "移除文件!!!", fileList);
    },
    handleExceed() {
      this.$message.warning(` 最多只能上传一个文件! `);
    },
    //模板下载
    async undataFile() {
      let res = await this.$api.spotDownload();
      if (res.code == 0) {
        var proview = window.open("_blank");
        let PublicdownloadAd = "/ren/dropData/downloadFile?address=";
        let url = `${PublicdownloadAd}${res.data}`;
        proview.location = url;
        this.$message.success("模板下载成功");
      }
    },
  },
};
</script>
<style scoped lang="less">
.dialog_content {
  height: 240px;
  display: flex;
  padding: 20px 24px 0 24px;
  .stencil {
    width: 100%;
    height: 36px;
    border-radius: 4px;
    padding-left: 12px;
    border: 1px solid #dcdfe6;
    display: flex;
    align-items: center;
    span {
      font-family: PingFang SC;
      font-size: 14px;
      font-weight: 400;
      color: #536dfe;
      cursor: pointer;
      margin-left: 3px;
    }
  }
  .servlet_all {
    display: flex;
    flex-direction: column;
    .servlet {
      width: 100%;
      height: 36px;
      border-radius: 4px;
      padding-left: 12px;
      border: 1px solid #dcdfe6;
      display: flex;
      align-items: center;
      span {
        font-family: PingFang SC;
        font-size: 14px;
        font-weight: 400;
        color: #536dfe;
        cursor: pointer;
        margin-left: 3px;
      }
    }
  }
  /deep/.el-radio__label {
    font-family: PingFang SC;
    font-size: 14px;
    font-weight: 400;
    color: #333333;
  }
  /deep/.el-radio {
    margin-right: 24px !important;
  }
  /deep/.el-radio__input.is-checked .el-radio__inner {
    background: #536dfe !important;
    border-color: #536dfe !important;
  }
  /deep/.el-form-item__label {
    color: #212121;
    font-family: "PingFang SC";
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
  }
  /deep/.el-form-item {
    margin-bottom: 25px !important;
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
  /deep/.el-input__inner {
    height: 36px;
    line-height: 36px;
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
