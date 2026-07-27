<template>
  <div class="model">
    <el-dialog
      :visible.sync="newApply.model"
      width="55%"
      :close-on-click-modal="false"
      :destroy-on-close="true"
      @close="close"
    >
      <div slot="title" class="header_title">
        <div class="name">
          {{ newApply.title }}<span>该页面展示标签已绑定的数据</span>
        </div>
      </div>
      <div class="dialog_content">
        <div class="dialog_content_top">
          <el-input
            style="width: 45%"
            placeholder="请输入点标识名称"
            prefix-icon="el-icon-search"
            v-model.trim="deTailtablePage.dropMark"
            clearable
            size="medium"
            @keyup.enter.native="searchData"
            @clear="clearData"
          >
          </el-input>
          <div class="btns">
            <el-button
              @click="optional"
              type="primary"
              size="medium"
              style="
                background: #536dfe;
                border-color: #536dfe;
                margin-right: 5px;
              "
              >可选数据</el-button
            >
            <el-button
              type="primary_one"
              :disabled="checkIds.length == 0"
              size="medium"
              style="
                background: #ffff;
                border: 1px solid #dcdfe6;
                color: #303133;
              "
              @click="relieve"
              >移除绑定</el-button
            >
          </div>
        </div>
        <div class="dialog_content_bottom">
          <Vxetable
            ref="myTable"
            @currentChange="detailCurrentChange"
            @sizeChange="deTailsizeChange"
            @sortChange="deTailsortChange"
            @handleCheckboxAll="deTailhandleCheckboxAll"
            @handleCheckboxChange="deTailhandleCheckboxChange"
            :tablePage="deTailtablePage"
            :tableTitles="tableTitles"
            :tableData="deTailtableData"
            :selection="true"
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
          type="primary"
          size="mini"
          style="background: #536dfe; border-color: #536dfe"
          >关闭</el-button
        >
        <!-- <el-button
          type="primary"
          size="mini"
          style="background: #536dfe"
          @click="ack()"
          >确定</el-button
        > -->
      </div>
    </el-dialog>
    <choice
      v-if="newChoice.model"
      :newChoice="newChoice"
      :newChoicetablePage="newChoicetablePage"
      :newChoicetableTitles="newChoicetableTitles"
      :newChoicetableData="newChoicetableData"
      @newChoiceCurrentChange="newChoiceCurrentChange"
      @binding="binding"
    ></choice>
    <Delete :dehoff="dehoff" @affirm="affirm"></Delete>
  </div>
</template>
<script>
import choice from "./choice.vue";
export default {
  data() {
    return {
      tableTitles: [
        {
          fieldName: "dropMark",
          titleName: "点标识",
          fontendType: "text",
          sortable: true,
          width: "200",
        },
        {
          fieldName: "dropDescribe",
          titleName: "点描述",
          fontendType: "text",
          width: "200",
        },
        {
          fieldName: "dataSourceMark",
          titleName: "数据源点标识",
          fontendType: "text",
          sortable: true,
          width: "200",
        },
        {
          fieldName: "dropType",
          titleName: "点类型",
          // fontendType: "text",
          fontendType: "slot",
          width: "200",
        },
        {
          fieldName: "pointLabels",
          titleName: "点标签",
          fontendType: "slot",
          slotWidth: true,
        },
      ],
      checkIds: [],
      newChoice: {
        model: false,
        title: "可选数据",
      },
      newChoicetablePage: {
        pageIndex: 1,
        pageSize: 20,
        total: 0,
        sortType: "",
        ascDesc: "desc",
        dropMark: "",
      },
      newChoicetableTitles: [
        {
          fieldName: "dropMark",
          titleName: "点标识",
          fontendType: "text",
          sortable: true,
          width: "200",
        },
        {
          fieldName: "dropDescribe",
          titleName: "点描述",
          fontendType: "text",
          width: "200",
        },
        {
          fieldName: "dataSourceMark",
          titleName: "数据源点标识",
          fontendType: "text",
          sortable: true,
          width: "200",
        },
        {
          fieldName: "dropType",
          titleName: "点类型",
          fontendType: "slot",
          // fontendType: "text",
          width: "200",
        },
        {
          fieldName: "pointLabels",
          titleName: "点标签",
          fontendType: "slot",
          slotWidth: true,
        },
      ],
      newChoicetableData: [],
      dehoff: {
        model: false,
        title: "移除",
        contents: "请确认是否移除绑定？",
      },
    };
  },
  components: {
    choice,
  },
  props: {
    newApply: {
      type: Object,
      default: () => {
        return {
          model: false, //状态
          title: "", //标题
          id: "",
        };
      },
    },
    deTailtablePage: {
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
    deTailtableData: {
      type: Array,
      default: () => {
        return [];
      },
    },
  },
  created() {},
  methods: {
    close() {
      this.deTailtablePage.dropMark = "";
      this.newApply.model = false;
      //   this.$emit("newLabelclose");
    },
    //确认
    // ack() {
    //   this.deTailtablePage.dropMark = "";
    //   this.newApply.model = false;
    //   this.$emit("ack");
    // },
    searchData() {
      this.detailCurrentChange(1);
    },
    clearData() {
      this.detailCurrentChange(1);
    },
    detailCurrentChange(page) {
      this.$emit("detailCurrentChange", page);
    },
    deTailsizeChange(size) {
      this.deTailtablePage.pageSize = size;
      this.detailCurrentChange(1);
      // this.$emit("deTailsizeChange", size);
    },
    //列表排序
    deTailsortChange(order, field) {
      this.deTailtablePage.ascDesc = order;
      this.deTailtablePage.sortType = field;
      if (order == null) {
        this.deTailtablePage.ascDesc = "desc";
        this.deTailtablePage.sortType = "createTime";
      }
      this.detailCurrentChange(1);
      // this.$emit("deTailsortChange", order, field);
    },
    //列表全选
    deTailhandleCheckboxAll(list) {
      this.checkIds = list;
      console.log(list, "列表id");
    },
    //列表单选
    deTailhandleCheckboxChange(list) {
      this.checkIds = list;
      console.log(list, "列表单选id");
    },
    optional() {
      this.newChoice.model = true;
      this.newChoiceCurrentChange(1);
      console.log("可选数据");
    },
    //可选数据列表查询
    async newChoiceCurrentChange(page) {
      this.newChoicetablePage.pageIndex = page;
      let res = await this.$api.getDropDataListLabel({
        pointLabelsNot: this.newApply.id,
        pageSize: this.newChoicetablePage.pageSize,
        pageNum: this.newChoicetablePage.pageIndex,
        sortType: this.newChoicetablePage.sortType,
        ascDesc: this.newChoicetablePage.ascDesc,
        dropMark: this.newChoicetablePage.dropMark,
      });
      if (res.code == 0) {
        this.newChoicetableData = res.data.list ? res.data.list : [];
        this.newChoicetablePage.total = res.data.total ? res.data.total : 0;
      }
      // console.log(res, "可选数据列表数据", res.data.list[0].pointLabels);
    },
    //确认绑定
    async binding(ids) {
      if (ids.length > 0) {
        let res = await this.$api.addDropDataLabel({
          ids: ids.toString(),
          id: this.newApply.id,
        });
        if (res.code == 0) {
          this.newChoice.model = false;
          this.detailCurrentChange(1);
          this.$refs.myTable.$refs.xTable.clearAll();
          this.$message.success("数据绑定成功");
        } else {
          this.$message.warning(res.msg);
        }
        console.log(res, "数据绑定");
      } else {
        this.$message.warning("请勾选列表数据");
      }
    },
    async affirm() {
      let res = await this.$api.deleteDropDataLabel({
        ids: this.checkIds.toString(),
        id: this.newApply.id,
      });
      if (res.code == 0) {
        this.$refs.myTable.selectIds = [];
        this.$refs.myTable.list = [];
        this.checkIds = [];
        this.detailCurrentChange(1);
        this.dehoff.model = false;
        this.$message.success("解除绑定成功");
        console.log(this.checkIds, "id还有吗");
      }
    },
    //解除绑定
    async relieve() {
      this.dehoff = {
        model: true,
        title: "移除",
        contents: "请确认是否移除绑定？",
      };
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
    .btns {
      margin-left: 16px;
      /deep/.el-button--primary_one.is-disabled {
        background: #f5f7fa !important;
        color: #e4e7ed !important;
        border-color: #e4e7ed !important;
      }
    }
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
  span {
    color: #666666;
    font-family: "PingFang SC";
    font-size: 12px;
    font-style: normal;
    font-weight: 500;
    margin-left: 8px;
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
