<template>
  <div class="alarmRecord-card">
    <div class="table_box">
      <div class="table_title">
        <div class="title_left">
          <span class="unitText"> 所属机组</span>
          <el-input
            style="width: 20%"
            v-model="searchList.unit"
            placeholder="请输入内容"
            disabled
          ></el-input>
          <span class="unitText">报警项</span>
          <el-select v-model="searchList.warnItem" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.value"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </div>
        <div class="title_right">
          <el-button type="primary-add" @click="VoPageListByDto(1)"
            >查询</el-button
          >
          <el-button type="primary-reset" @click="reset()">重置</el-button>
          <el-button
            :disabled="checkIds.length == 0"
            type="primary-reset"
            @click="remove(1)"
            >删除</el-button
          >
        </div>
      </div>
      <div class="table">
        <Vxetable
          ref="invoiceVxeTable"
          @currentChange="VoPageListByDto"
          @sizeChange="sizeChange"
          @handleCheckboxAll="handleCheckboxAll"
          @handleCheckboxChange="handleCheckboxChange"
          :tablePage="tablePage"
          :tableTitles="tableTitles"
          :tableData="tableData"
          :selection="true"
        >
          <div slot="btn_edit" slot-scope="{ row }">
            <el-button
              type="text"
              size="small"
              @click="trend(row)"
              style="color: #0775db; font-size: 14px"
              >趋势</el-button
            >
            <el-button
              type="text"
              size="small"
              @click="remove(0, row)"
              style="color: #e94848; font-size: 14px"
              >删除</el-button
            >
          </div></Vxetable
        >
      </div>
    </div>
    <Delete v-if="dehoff.model" :dehoff="dehoff" @affirm="affirm"></Delete>
    <Td v-if="trends.model" :trend="trends" />
  </div>
</template>
<script>
import Td from "./components/tendency.vue";
export default {
  data() {
    return {
      trends: {
        model: false,
        title: "趋势",
      },
      checkIds: [],
      tablePage: {
        pageIndex: 1,
        pageSize: 20,
        total: 0,
      },
      dehoff: {
        model: false,
        title: "",
        contents: "",
        time: true,
      },
      options: [
        {
          value: "振动",
        },
        {
          value: "间隙",
        },
      ],

      tableTitles: [
        {
          fieldName: "unit",
          titleName: "所属机组",
        },
        {
          fieldName: "warnItem",
          titleName: "报警项",
        },
        {
          fieldName: "warnVal",
          titleName: "报警值",
        },
        {
          fieldName: "startTime",
          titleName: "报警开始时间",
        },
        {
          fieldName: "endTime",
          titleName: "报警结束时间",
        },
      ],
      tableData: [],
      warnId: "",
      fd: new FormData(),
      searchList: {
        unit: "3号机",
        warnItem: "",
      },
    };
  },
  components: {
    Td,
  },
  created() {
    this.VoPageListByDto(1);
  },
  methods: {
    // 重置
    reset() {
      this.searchList = {
        unit: "3号机",
        warnItem: "",
      };
      this.VoPageListByDto(1);
    },
    async VoPageListByDto(page) {
      this.tablePage.pageIndex = page;
      const res = await this.$api.getWarnRecords({
        pageSize: this.tablePage.pageSize,
        pageNum: this.tablePage.pageIndex,
        ...this.searchList,
      });
      if (res.code == 0) {
        this.tableData = res.data.list;
        this.tablePage.total = res.data.total ? res.data.total : 0;
      }
    },
    sizeChange(size) {
      this.tablePage.pageSize = size;
      this.VoPageListByDto(1);
    },
    handleCheckboxAll(list) {
      this.checkIds = list;
    },
    handleCheckboxChange(list) {
      this.checkIds = list;
    },
    //删除
    async affirm() {
      this.fd.append(
        "ids",
        this.warnId == "" ? this.checkIds.toString() : this.warnId
      );
      const res = await this.$api.deleteWarnRecord(
        this.fd,
        "multipart/form-data"
      );
      if (res.code == 0) {
        this.dehoff.model = false;
        this.$message.success("操作成功");
        this.checkIds = [];
        this.clearTableSelection();
        this.VoPageListByDto(1);
        this.fd = new FormData();
      } else {
        this.$message.warning(res.msg);
      }
    },
    //清除表格选中状态
    clearTableSelection() {
      const $table = this.$refs.invoiceVxeTable?.$refs?.xTable;

      if ($table) {
        $table.clearCheckboxRow(); // 清除当前 checkbox 选中行（单选）
        $table.clearCheckboxRow(true); // 清除所有 checkbox 行（多选）
        $table.clearRadioRow(); // 清除 radio 单选行
      }
      // 如果你在组件中维护了这些状态，也一并清空
      const invoiceTable = this.$refs.invoiceVxeTable;
      if (invoiceTable) {
        invoiceTable.selectIds = [];
        invoiceTable.list = [];
      }
    },
    //趋势
    trend(val) {
      this.trends = {
        model: true,
        title: " 趋势",
        type: val,
      };
    },
    //删除
    remove(type, val) {
      type == 1 ? (this.warnId = "") : (this.warnId = val.id);
      this.dehoff = {
        model: true,
        title: "提示",
        contents:
          type == 1
            ? "请确认是否删除所选报警记录？"
            : "请确认是否删除当前报警记录？",
        time: false,
      };
    },
  },
  computed: {},
};
</script>
<style lang="less" scoped>
.alarmRecord-card {
  height: 100%;
  width: 100%;
  padding: 15px;
  background-color: #f7f8fa;
  .table_box {
    width: 100%;
    height: 100%;
    padding: 20px;
    background: #ffffff;
    display: flex;
    flex-direction: column;
    .table_title {
      width: 100%;
      height: 32px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .title_right {
        flex: 1;
        display: flex;
        justify-content: flex-end;
      }
      .title_left {
        width: 50%;
        display: flex;
        align-items: center;
        .unitText {
          margin-right: 12px;
          color: #606266;
          font-family: "Microsoft YaHei";
          font-size: 12px;
          font-style: normal;
          font-weight: 400;
        }
        /deep/.el-input {
          margin-right: 24px !important;
        }
        /deep/.el-input__inner {
          height: 32px !important;
        }
      }
    }
    .table {
      margin-top: 12px;
      height: calc(94% - 44px);
      width: 100%;
    }
  }
}
</style>
