<template>
  <div class="page">
    <div class="page_content">
      <div class="page_top">
        <div class="btns">
          <el-button
            type="primary"
            size="medium"
            style="background: #536dfe; border-color: #536dfe; color: #ffffff"
            @click="add"
            >新增</el-button
          >
          <el-button
            type="primary_one"
            size="medium"
            :disabled="checkIds.length == 0"
            style="
              background: #ffff;
              border-color: #dcdfe6;
              color: #303133;
              font-weight: 600;
            "
            @click="batDeh"
            >批量删除</el-button
          >
        </div>
      </div>
      <div
        class="page_bottom"
        :class="{
          page_bottom_bottom_h: Object.keys(searchList).length > 0,
        }"
      >
        <Vxetable
          ref="invoiceVxeTable"
          operationW="240"
          @currentChange="VoPageListByDto"
          @sizeChange="sizeChange"
          @sortChange="sortChange"
          :tablePage="tablePage"
          :tableTitles="tableTitles"
          :tableData="tableData"
          :selection="true"
          :highlightedColumn="highlightedColumn"
          :sendSearchTitles="sendSearchTitles"
          :searchList="searchList"
          @searchinfoDe="searchinfoDe"
          @empty="empty"
          @handleCheckboxAll="handleCheckboxAll"
          @handleCheckboxChange="handleCheckboxChange"
          @handleFilterChange="handleFilterChange"
        >
          <template slot="name" slot-scope="{ row }">
            <div
              class="label"
              :style="{
                color: row.colour[0].background,
                background: row.colour[0].color,
              }"
            >
              {{ row.name }}
            </div>
          </template>
          <div slot="btn_edit" slot-scope="{ row }">
            <el-button
              type="text"
              size="small"
              style="color: #536dfe; font-size: 14px"
              @click="edit(row)"
              >编辑</el-button
            >
            <el-button
              type="text"
              size="small"
              style="color: #536dfe; font-size: 14px"
              @click="use(row)"
              >应用</el-button
            >
            <el-button
              type="text"
              size="small"
              @click="derive(row)"
              style="color: #536dfe; font-size: 14px"
              >导出</el-button
            >
            <el-button
              type="text"
              size="small"
              style="color: #ff1616; font-size: 14px"
              @click="deh(row)"
              >删除</el-button
            >
          </div>
        </Vxetable>
      </div>
    </div>

    <addlabel
      ref="addLabelForm"
      v-if="newLabel.model"
      :newLabel="newLabel"
      @identification="identification"
    ></addlabel>
    <Delete :dehoff="dehoff" @affirm="affirm"></Delete>
    <apply
      v-if="newApply.model"
      :newApply="newApply"
      :deTailtablePage="deTailtablePage"
      :deTailtableData="deTailtableData"
      @detailCurrentChange="detailCurrentChange"
    ></apply>
  </div>
</template>
<script>
import addlabel from "./components/addlabel.vue";
import apply from "./components/apply.vue";
import { downloadFile } from "../../utils/utils"; // 引入公共方法
export default {
  data() {
    return {
      sendSearchTitles: [
        {
          titleName: "标签值",
          fieldName: "name",
        },
        {
          titleName: "创建时间",
          fieldName: "createTime",
        },
      ],
      searchList: {},
      tablePage: {
        pageIndex: 1,
        pageSize: 20,
        total: 0,
        sortType: "createTime",
        ascDesc: "desc",
      },
      tableTitles: [
        {
          fieldName: "name",
          titleName: "标签值",
          fontendType: "slot",
          sortable: true,
          isAppoint: true,
          screenType: "2",
          filtersOptions: [{ data: "" }],
          // filterMultiple: true,
          // filtersOptions: [
          //   { label: "一般", value: "1" },
          //   { label: "较重", value: "2" },
          //   { label: "严重", value: "3" },
          // ],
        },
        {
          fieldName: "remarks",
          titleName: "备注",
          fontendType: "text",
          sortable: true,
        },
        {
          fieldName: "createTime",
          titleName: "创建时间",
          fontendType: "stamp",
          sortable: true,
          screenType: "1",
          filtersOptions: [{ data: "" }],
        },
      ],
      tableData: [],
      checkIds: [],
      //高亮列
      highlightedColumn: [],
      //新增
      newLabel: {
        model: false,
        title: "新增",
      },
      dehoff: {
        model: false,
        title: "删除",
        contents: "请确认是否删除所选标签信息？",
      },
      newApply: {
        model: false,
        title: "应用",
        id: "",
      },
      editId: "",
      //应用弹框
      useId: "",
      deTailtablePage: {
        pageIndex: 1,
        pageSize: 20,
        total: 0,
        sortType: "",
        ascDesc: "desc",
        dropMark: "",
      },
      deTailtableData: [],
    };
  },
  components: {
    addlabel,
    apply,
  },
  created() {
    this.VoPageListByDto(1);
  },
  methods: {
    searchinfoDe(key) {
      let obj = {};
      for (var k in this.searchList) {
        if (k != key) {
          obj[k] = this.searchList[k];
        }
      }
      this.searchList = obj;
      this.$refs.invoiceVxeTable.$refs.xTable.clearFilter(key);
      this.highlightedColumn.map((item, index) => {
        if (item == key) {
          this.highlightedColumn.splice(index, 1);
        }
      });
      this.VoPageListByDto(1);
    },
    //清空
    empty() {
      this.$refs.invoiceVxeTable.$refs.xTable.clearFilter();
      this.searchList = {};
      this.highlightedColumn = [];
      console.log(this.$refs.invoiceVxeTable.$refs.xTable);
      this.VoPageListByDto(this.tablePage.pageIndex);
    },
    async VoPageListByDto(page) {
      this.tablePage.pageIndex = page;
      let res = await this.$api.queryLabelList({
        pageSize: this.tablePage.pageSize,
        pageNum: this.tablePage.pageIndex,
        sortType: this.tablePage.sortType,
        ascDesc: this.tablePage.ascDesc,
        ...this.searchList,
      });
      if (res.code == 0) {
        this.tableData = res.data.list ? res.data.list : [];
        this.tablePage.total = res.data.total ? res.data.total : 0;
      }
    },
    sizeChange(size) {
      this.tablePage.pageSize = size;
      this.VoPageListByDto(1);
    },
    //列表排序
    sortChange(order, field) {
      this.tablePage.ascDesc = order;
      this.tablePage.sortType = field;
      if (order == null) {
        this.tablePage.ascDesc = "desc";
        this.tablePage.sortType = "createTime";
      }
      this.VoPageListByDto(1);
    },
    //列表全选
    handleCheckboxAll(list) {
      this.checkIds = list;
    },
    //列表单选
    handleCheckboxChange(list) {
      this.checkIds = list;
    },
    handleFilterChange(val) {
      this.highlightedColumn = [];
      if (val.filterList && val.filterList.length > 0) {
        val.filterList.map((item, index) => {
          this.highlightedColumn.push(item.column.field);
        });
      } else {
        this.highlightedColumn = [];
      }
      val.filterList.map((item) => {
        if (item.datas[0] == undefined) {
          item.datas = item.values;
        } else if (item.values[0] == undefined) {
          item.values = item.datas;
        }
        return item;
      });
      this.searchList = val.filterList.reduce((acc, curr) => {
        console.log(acc, curr, "sss142018");
        if (curr.values[0].length > 1) {
          console.log("数据大于1", curr.values.length);
          acc[curr.field] = curr.values.toString();
        } else {
          console.log("圣魔鬼", curr.values.length);
          acc[curr.field] = curr.values[0];
        }
        return acc;
      }, {});
      this.VoPageListByDto(1);
      console.log(this.searchList, val.filterList);
    },
    //新增
    add() {
      this.newLabel = {
        model: true,
        title: "新增",
      };
    },
    //导出
    async derive(val) {
      let res = await this.$api.exportPoints({
        labelVal: val.name,
      });
      if (res) {
        downloadFile(res, res.headers["content-disposition"]);
        this.$message.success("导出成功");
      }
    },
    //确认
    async identification(data) {
      if (this.newLabel.title == "新增") {
        let res = await this.$api.insertLabel({
          name: data.name,
          remarks: data.remarks,
          colourType: data.circleArr,
        });
        if (res.code == 0) {
          this.newLabel.model = false;
          this.$message.success("新增成功");
        } else {
          let limit = this.$refs.addLabelForm.$refs.ruleForm.fields;
          limit[0]["validateMessage"] = res.msg;
          limit[0]["validateState"] = "error";
          // console.log(this.$refs.addLabelForm.$refs.ruleForm.fields);
          // this.$message.warning(res.msg);
        }
      } else {
        let res = await this.$api.updateLabel({
          id: this.editId,
          name: data.name,
          remarks: data.remarks,
          colourType: data.circleArr,
        });
        if (res.code == 0) {
          this.newLabel.model = false;
          this.$message.success("编辑成功");
        } else {
          let limit = this.$refs.addLabelForm.$refs.ruleForm.fields;
          limit[0]["validateMessage"] = res.msg;
          limit[0]["validateState"] = "error";
          // this.$message.warning(res.msg);
        }
      }
      this.VoPageListByDto(1);
    },
    //编辑
    edit(data) {
      this.editId = data.id;
      this.newLabel = {
        model: true,
        title: "编辑",
        obj: data,
      };
    },
    //批量删除
    batDeh() {
      this.dehoff = {
        model: true,
        contents: "请确认是否删除所选标签信息？",
        title: "批量删除",
        type: 2,
      };
    },
    //删除
    deh(data) {
      this.dehId = data.id;
      this.dehoff = {
        model: true,
        title: "删除",
        contents: "请确认是否删除该标签信息？",
        type: 1,
      };
    },
    //删除确认
    async affirm() {
      if (this.dehoff.type == 1) {
        let res = await this.$api.deleteLabel({
          ids: this.dehId,
        });
        if (res.code == 0) {
          this.$message.success("删除成功");
        } else {
          this.$message.warning(res.msg);
        }
      } else {
        let res = await this.$api.deleteLabel({
          ids: this.checkIds.toString(),
        });
        if (res.code == 0) {
          this.$message.success("批量删除成功");
        } else {
          this.$message.warning(res.msg);
        }
      }
      this.dehoff.model = false;
      this.VoPageListByDto(1);
    },
    //应用
    use(data) {
      this.useId = data.id;
      this.newApply = {
        model: true,
        title: "应用",
        id: data.id,
      };
      this.detailCurrentChange(1);
    },
    //查询应用列表
    async detailCurrentChange(page) {
      this.deTailtablePage.pageIndex = page;
      let res = await this.$api.getDropDataListLabel({
        pointLabelsStr: this.useId,
        pageSize: this.deTailtablePage.pageSize,
        pageNum: this.deTailtablePage.pageIndex,
        sortType: this.deTailtablePage.sortType,
        ascDesc: this.deTailtablePage.ascDesc,
        dropMark: this.deTailtablePage.dropMark,
      });
      if (res.code == 0) {
        this.deTailtableData = res.data.list ? res.data.list : [];
        this.deTailtablePage.total = res.data.total ? res.data.total : 0;
      }
      console.log(res, "应用列表数据");
    },
  },
};
</script>
<style scoped lang="less">
.page {
  width: 100%;
  height: calc(100% - 75px);
  padding: 20px 20px 0 20px;
  display: flex;
  flex-direction: column;
  .page_content {
    width: 100%;
    height: calc(100% - 5px);
    background: #ffffff;
    border-radius: 4px;
    padding: 24px 24px 0 24px;

    .page_bottom {
      margin-top: 16px;
      width: 100%;
      height: calc(100% - 120px);
    }
    .page_bottom_bottom_h {
      margin-top: 0 !important;
      height: calc(100% - 175px);
    }
    .label {
      width: fit-content;
      padding: 0 6px;
      height: 23px;
      border-radius: 15px;
    }
  }
}
</style>
