<template>
  <div class="model">
    <el-dialog
      :visible.sync="newChoice.model"
      width="55%"
      :close-on-click-modal="false"
      :destroy-on-close="true"
      @close="close"
    >
      <div slot="title" class="header_title">
        <div class="name">
          {{ newChoice.title }}
        </div>
      </div>
      <div class="dialog_content">
        <div class="dialog_content_top">
          <el-input
            style="width: 45%"
            placeholder="请输入关键词"
            prefix-icon="el-icon-search"
            v-model.trim="newChoicetablePage.dropMark"
            clearable
            @keyup.enter.native="searchData"
            @clear="clearData"
          >
          </el-input>
        </div>
        <div class="dialog_content_bottom">
          <Vxetable
            @currentChange="newChoiceCurrentChange"
            @sizeChange="newChoicesizeChange"
            @sortChange="newChoicesortChange"
            @handleCheckboxAll="newChoicehandleCheckboxAll"
            @handleCheckboxChange="newChoicehandleCheckboxChange"
            @radioChangeEvent="radioChangeEvent"
            :tablePage="newChoicetablePage"
            :tableTitles="newChoicetableTitles"
            :tableData="newChoicetableData"
            :selection="newChoice.selection"
            :radio="newChoice.radio"
            :operation="false"
          >
            <template slot="dropType" slot-scope="{ row }">
              {{
                row.dropType == 1
                  ? "采集点"
                  : row.dropType == 2
                  ? "算法输出点"
                  : "中间点"
              }}
            </template>
            <template slot="pointLabels" slot-scope="{ row }">
              <div style="display: flex">
                <el-tooltip
                  v-for="(item1, index1) in row.pointLabels.slice(0, 4)"
                  :key="index1"
                  class="item"
                  effect="dark"
                  :disabled="item1.name.length < 5"
                  :content="item1.name"
                  placement="top-start"
                >
                  <div
                    class="lblHelpMessage1"
                    :style="{
                      background: item1.colour[0].color,
                      color: item1.colour[0].background,
                    }"
                  >
                    {{ item1.name }}
                  </div>
                </el-tooltip>
              </div>
            </template>
            <!-- <template slot="pointLabels" slot-scope="{ row }">
              <div style="display: flex">
                <div
                  v-for="(item1, index1) in row.pointLabels"
                  class="lblHelpMessage"
                  :key="index1"
                  :style="{
                    background: item1.colour[0].color,
                    color: item1.colour[0].background,
                  }"
                >
                  {{ item1.name }}
                </div>
              </div>
            </template> -->
          </Vxetable>
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
          style="background: #536dfe"
          @click="binding()"
          >{{ newChoice.rightBtn ? newChoice.rightBtn : "确认绑定" }}</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      checkIds: [],
      selectRow: null,
    };
  },
  props: {
    newChoice: {
      type: Object,
      default: () => {
        return {
          model: false, //状态
          title: "", //标题
          rightBtn: "",
          selection: true,
          radio: false,
        };
      },
    },
    newChoicetableTitles: {
      type: Array,
      default: () => {
        return [];
      },
    },

    newChoicetablePage: {
      type: Object,
      default: () => {
        return {
          pageIndex: 1,
          pageSize: 20,
          total: 0,
          sortType: "",
          ascDesc: "desc",
          dropMark: "",
        };
      },
    },
    newChoicetableData: {
      type: Array,
      default: () => {
        return [];
      },
    },
  },
  created() {},
  methods: {
    close() {
      this.newChoicetablePage.dropMark = "";
      this.newChoice.model = false;
      //   this.$emit("newLabelclose");
    },
    //确认
    binding() {
      // if (this.checkIds.length == 0) {
      //   this.$message.warning("请勾选列表数据");
      // } else {
      this.$emit("binding", this.selectRow ? this.selectRow : this.checkIds);
      this.newChoicetablePage.dropMark = "";
      // }
    },
    searchData() {
      this.newChoiceCurrentChange(1);
    },
    clearData() {
      this.newChoiceCurrentChange(1);
    },
    newChoiceCurrentChange(page) {
      this.$emit("newChoiceCurrentChange", page);
    },
    newChoicesizeChange(size) {
      console.log(size,'走了吗')
      this.newChoicetablePage.pageSize = size;
      this.newChoiceCurrentChange(1);
      // this.$emit("newChoicesizeChange", size);
    },
    //列表排序
    newChoicesortChange(order, field) {
      this.newChoicetablePage.ascDesc = order;
      this.newChoicetablePage.sortType = field;
      if (order == null) {
        this.newChoicetablePage.ascDesc = "desc";
        this.newChoicetablePage.sortType = "createTime";
      }
      this.newChoiceCurrentChange(1);
      // this.$emit("newChoicesortChange", order, field);
    },
    //列表全选
    newChoicehandleCheckboxAll(list) {
      this.checkIds = list;
      console.log(list, "列表id");
    },
    //列表单选
    newChoicehandleCheckboxChange(list) {
      this.checkIds = list;
      console.log(list, "列表单选id");
    },
    //单选事件
    radioChangeEvent(row) {
      this.selectRow = row;
      this.$emit("radioChangeEvent", row);
    },
    optional() {
      console.log("可选数据");
    },
  },
};
</script>
<style scoped lang="less">
.dialog_content {
  height: 600px;
  display: flex;
  flex-direction: column;
  padding: 20px 24px 0 24px;
  .dialog_content_top {
    width: 100%;
    display: flex;
    margin-bottom: 16px;
  }
  .dialog_content_bottom {
    width: 100%;
    height: calc(100% - 130px);
    .labels {
      width: fit-content;
      padding: 0 6px;
      height: 23px;
      border-radius: 15px;
      background: #fbf2e4;
      color: #fa9805;
    }
  }
}
.name {
  color: #212121;
  font-family: "PingFang SC";
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
  display: flex;
  align-items: center;
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
