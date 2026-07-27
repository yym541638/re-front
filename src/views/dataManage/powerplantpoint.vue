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
            type="primary"
            size="medium"
            style="
              background: #ffff;
              border-color: #dcdfe6;
              color: #303133;
              font-weight: 600;
            "
            @click="leading"
            >导入</el-button
          >
          <el-button
            type="primary_one"
            size="medium"
            :disabled="checkIds.length !== 0"
            style="
              background: #ffff;
              border-color: #dcdfe6;
              color: #303133;
              font-weight: 600;
            "
            @click="derive"
            >全部导出</el-button
          >
          <el-button
            type="primary"
            size="medium"
            style="
              background: #ffff;
              border-color: #dcdfe6;
              color: #303133;
              font-weight: 600;
            "
            @click="inspect"
            >测点检查</el-button
          >
          <el-button
            type="primary"
            size="medium"
            style="
              background: #ffff;
              border-color: #dcdfe6;
              color: #303133;
              font-weight: 600;
            "
            @click="refresh"
            >刷新值</el-button
          >
          <!--:disabled="checkIds.length == 0" -->
          <!-- <el-button
            type="primary_one"
            size="medium"
            style="
              background: #ffff;
              border-color: #dcdfe6;
              color: #303133;
              font-weight: 600;
            "
            @click="mark"
            >源标识编辑</el-button
          > -->
          <!--   style="background: #ffff; border-color: #2348f9; color: #2348f9" -->
          <el-button
            type="primary_one"
            size="medium"
            :disabled="checkIds.length > 1 || checkIds.length == 0"
            style="
              background: #ffff;
              border-color: #dcdfe6;
              color: #303133;
              font-weight: 600;
            "
            @click="labelSettings"
            >标签设置</el-button
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
          @headerCellClickEvent="headerCellClickEvent"
          @handleResize="handleResize"
        >
          <template slot="dataSourceName" slot-scope="{ row }">
            {{ row.dataSourceName }}
          </template>
          <template slot="dataSourceType" slot-scope="{ row }">
            {{ row.dataSourceType }}
          </template>
          <template slot="facName" slot-scope="{ row }">
            {{ row.facName }}
          </template>
          <template slot="setName" slot-scope="{ row }">
            {{ row.setName }}
          </template>
          <template slot="pointLabels" slot-scope="{ row }">
            <div class="lblHelpMessagebox">
              <el-tooltip
                v-for="(item1, index1) in visibleLabels(row)"
                :key="index1"
                class="item"
                effect="dark"
                :disabled="item1.name.length < 6"
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
              <el-tooltip
                v-if="row.pointLabels.length > maxVisibleLabels(row)"
                effect="dark"
                :content="remainingLabels(row)"
                placement="top-start"
              >
                <span style="cursor: pointer"
                  >+{{ row.pointLabels.length - maxVisibleLabels(row) }}</span
                >
              </el-tooltip>
            </div>
          </template>
          <template slot="dropType" slot-scope="{ row }">
            {{
              row.dropType == 1
                ? "采集点"
                : row.dropType == 2
                ? "算法输出点"
                : "中间点"
            }}
          </template>
          <div slot="btn_edit" slot-scope="{ row }">
            <el-button
              type="text"
              size="small"
              style="color: #536dfe; font-size: 14px"
              @click="compile(row, '编辑点')"
              >编辑</el-button
            >
            <el-button
              type="text"
              size="small"
              style="color: #536dfe; font-size: 14px"
              @click="compile(row, '查看点')"
              >查看</el-button
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
    <!-- 新增 -->
    <Form
      v-if="Formdialog.model"
      ref="dialogEdit"
      :dialogWidth="dialogWidth"
      :dialog="Formdialog"
      :formObj="formObj"
      :formData="formData"
      @selectChange="selectChange"
      @submit="submit"
      @close="reset"
      @addPoint="addPoint"
      @handleInputBlur="handleInputBlur"
    ></Form>
    <!-- 删除 -->
    <Delete :dehoff="dehoff" @affirm="affirm"></Delete>
    <!-- 源标识编辑 -->
    <!-- <character
      :newMark="newMark"
      v-if="newMark.model"
      :loadStatus="loadStatus"
      @identification="identification"
    ></character> -->
    <!-- 导入 -->
    <bulk
      ref="importFile"
      :newBulk="newBulk"
      v-if="newBulk.model"
      @wellDefined="wellDefined"
    ></bulk>
    <!-- 等待 -->
    <wait :showmodel="showmodel" v-if="showmodel.dialog"></wait>
    <!-- 导入成功 -->
    <prosper
      :succmodel="succmodel"
      v-if="succmodel.dialog"
      @downView="downView"
    ></prosper>
    <choice
      :newChoice="newChoice"
      :newChoicetablePage="tablePage"
      :newChoicetableTitles="newChoicetableTitles"
      :newChoicetableData="newChoicetableData"
      @newChoiceCurrentChange="newChoiceCurrentChange"
      @newChoicesizeChange="newChoicesizeChange"
      @binding="binding"
    ></choice>
  </div>
</template>

<script>
import formJs from "../../utils/testForm";
import bulk from "./components/bulk.vue";
// import character from "./components/character.vue";
import prosper from "./components/prosper.vue";
import wait from "./components/wait.vue";
import choice from "./components/choice.vue";
import { downloadFile } from "../../utils/utils"; // 引入公共方法
export default {
  data() {
    return {
      sendSearchTitles: [
        {
          titleName: "点标识",
          fieldName: "dropMark",
        },
        {
          titleName: "点描述",
          fieldName: "dropDescribe",
        },
        {
          titleName: "所属电厂",
          fieldName: "facName",
        },
        {
          titleName: "所属机组",
          fieldName: "setName",
        },
        {
          titleName: "数据源名称",
          fieldName: "dataSourceName",
        },
        {
          titleName: "数据源类型",
          fieldName: "dataSourceType",
        },
        {
          titleName: "数据源点表标识",
          fieldName: "dataSourceMark",
        },
        {
          titleName: "点类型",
          fieldName: "dropTypeStr",
        },
        {
          titleName: "创建时间",
          fieldName: "createTime",
        },
        {
          titleName: "点标签",
          fieldName: "labelVal",
        },
      ],
      searchList: {},
      tablePage: {
        pageIndex: 1,
        pageSize: 100,
        total: 0,
        sortType: "createTime",
        ascDesc: "desc",
        dropMark: "",
      },
      tableTitles: [
        {
          fieldName: "dropMark",
          titleName: "点标识",
          fontendType: "stamp",
          sortable: true,
          screenType: "2",
          filtersOptions: [{ data: "" }],
          width: "200",
          columnIsfixed: "left",
        },
        {
          fieldName: "dropDescribe",
          titleName: "点描述",
          fontendType: "stamp",
          sortable: true,
          screenType: "2",
          filtersOptions: [{ data: "" }],
          width: "200",
          columnIsfixed: "left",
        },
        {
          fieldName: "facName",
          titleName: "所属电厂",
          width: "200",
          sortable: true,
          fontendType: "slot",
          filterMultiple: true,
          filtersOptions: [],
        },
        {
          fieldName: "setName",
          titleName: "所属机组",
          width: "200",
          sortable: true,
          fontendType: "slot",
          filterMultiple: true,
          filtersOptions: [],
        },
        {
          fieldName: "dataValue",
          titleName: "实时值",
          fontendType: "text",
          flash: true,
          width: "200",
          // columnIsfixed: "left",
        },
        {
          fieldName: "updateTime",
          titleName: "时间",
          fontendType: "text",
          width: "200",
        },
        {
          fieldName: "pointLabels",
          titleName: "点标签",
          sortable: true,
          fontendType: "slot",
          filterMultiple: true,
          filtersOptions: [],
          width: 280,
        },
        {
          fieldName: "dataSourceName",
          titleName: "数据源名称",
          width: "200",
          sortable: true,
          fontendType: "slot",
          filterMultiple: true,
          filtersOptions: [],
        },
        {
          fieldName: "dataSourceType",
          titleName: "数据源类型",
          width: "200",
          sortable: true,
          fontendType: "slot",
          filterMultiple: true,
          filtersOptions: [
            {
              label: "redis",
              value: "redis",
            },
            {
              label: "sql server",
              value: "sql server",
            },
            {
              label: "REST API",
              value: "REST API",
            },
          ],
        },
        {
          fieldName: "dataSourceMark",
          titleName: "数据源点表标识",
          fontendType: "stamp",
          sortable: true,
          screenType: "2",
          filtersOptions: [{ data: "" }],
          width: "200",
        },
        {
          fieldName: "dropType",
          titleName: "点类型",
          fontendType: "slot",
          sortable: true,
          filterMultiple: true,
          filtersOptions: [
            { label: "采集点", value: "1" },
            { label: "算法输出点", value: "2" },
            { label: "中间点", value: "3" },
          ],
          width: "200",
        },
        {
          fieldName: "unit",
          titleName: "单位",
          fontendType: "text",
          width: "200",
        },
        {
          fieldName: "createTime",
          titleName: "创建时间",
          fontendType: "stamp",
          sortable: true,
          screenType: "1",
          filtersOptions: [{ data: "" }],
          width: "200",
        },
      ],
      tableData: [],
      checkIds: [],
      //高亮列
      highlightedColumn: [],
      dehoff: {
        model: false,
        title: "删除",
        contents: "请确认是否删除该标签信息？",
      },
      //导入
      newBulk: {
        model: false,
        title: "导入",
      },
      //源标识编辑
      // newMark: {
      //   model: false,
      //   title: "源标识编辑",
      // },
      //: false,
      //等待
      showmodel: {
        dialog: false,
      },
      //导入成功
      succmodel: {
        dialog: false,
        title: "检查成功",
      },
      formData: formJs.formDataDot2,
      formObj: formJs.formObj2,
      dialogWidth: "",
      selectRowarr: [],
      Formdialog: {
        model: false,
        title: "新增点",
      },
      newChoice: {
        model: false,
        title: "添加点",
        rightBtn: "确定",
        selection: false,
        radio: true,
      },
      newChoicetableTitles: formJs.newChoicetableTitles,
      newChoicetableData: [],
      listId: "",
      fd: new FormData(),
      //测点检查数据
      inspectObj: {},
      dataSourceData: [],
    };
  },
  components: {
    // character,
    bulk,
    wait,
    prosper,
    choice,
  },
  created() {
    this.VoPageListByDto(1);
    this.getElementType();
    this.getStoreBases();
  },

  methods: {
    //所属电厂 目标库下拉数据
    async getStoreBases() {
      let res = await this.$api.getTitleChoices({});
      if (res.code == 0) {
        const mapping = {
          facName: (data) =>
            data?.map((option) => ({
              label: option,
              value: option,
            })),
          setName: (data) =>
            data?.map((option) => ({
              label: option,
              value: option,
            })),
          pointLabels: (data) =>
            data?.map((option) => ({
              label: option,
              value: option,
            })),
          dataSourceName: (data) =>
            data?.map((option) => ({
              label: option,
              value: option,
            })),
        };
        // 设置 tableTitles 的 filtersOptions
        this.tableTitles[2].filtersOptions = mapping.facName(res.data.facNames);
        this.tableTitles[3].filtersOptions = mapping.setName(res.data.setNames);
        this.tableTitles[6].filtersOptions = mapping.pointLabels(
          res.data.labels
        );
        this.tableTitles[7].filtersOptions = mapping.dataSourceName(
          res.data.datasourceNames
        );
      }
    },
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
      this.VoPageListByDto(this.tablePage.pageIndex);
    },
    async VoPageListByDto(page) {
      this.tablePage.pageIndex = page;
      let res = await this.$api.queryDropDataList({
        pageSize: this.tablePage.pageSize,
        pageNum: this.tablePage.pageIndex,
        sortType: this.tablePage.sortType,
        ascDesc: this.tablePage.ascDesc,
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
        if (curr.values[0].length > 1) {
          if (curr.field == "pointLabels") {
            acc.labelVal = curr.values.toString();
          } else {
            acc[curr.field] = curr.values.toString();
          }
        } else {
          if (curr.field == "dropType") {
            acc.dropTypeStr = curr.values.toString();
          } else if (curr.field == "pointLabels") {
            acc.labelVal = curr.values.toString();
          } else {
            acc[curr.field] = curr.values[0];
          }
        }
        return acc;
      }, {});
      this.VoPageListByDto(1);
      console.log(this.searchList, val.filterList);
    },
    //实时值刷新
    headerCellClickEvent() {
      this.VoPageListByDto(1);
      this.$message.success("实时值刷新成功");
    },
    handleResize(column) {
      console.log("列宽", column);
      this.tableTitles[6].width = column.width;
      column.width = column.resizeWidth || column.width;
    },
    // 计算最大可见标签数
    maxVisibleLabels(row) {
      const baseLabelWidth = 50; // 假设每个标签平均宽度为 50px
      return Math.floor(this.tableTitles[6].width / baseLabelWidth);
    },
    // 获取当前可见的标签
    visibleLabels(row) {
      const maxLabels = this.maxVisibleLabels(row);
      return row.pointLabels.slice(0, maxLabels);
    },
    remainingLabels(row) {
      const maxLabels = this.maxVisibleLabels(row);
      const remaining = row.pointLabels.slice(maxLabels);
      return remaining.map((item) => item.name).join(", ");
    },
    //刷新值
    refresh() {
      this.VoPageListByDto(1);
      this.$message.success("刷新值成功");
    },
    //批量删除
    batDeh() {
      this.dehoff = {
        model: true,
        contents: "请确认是否删除该标签信息？",
        title: "批量删除",
      };
    },
    //删除
    deh(data) {
      this.listId = data.id;
      this.dehoff.model = true;
    },
    //删除确认
    async affirm() {
      let res = await this.$api.deleteDropData({
        ids: this.listId !== "" ? this.listId : this.checkIds.toString(),
      });
      if (res.code == 0) {
        this.dehoff.model = false;
        this.$message.success("删除成功");
        this.checkIds = [];
        this.$refs.invoiceVxeTable.selectIds = [];
        this.$refs.invoiceVxeTable.list = [];
        this.VoPageListByDto(1);
        this.getStoreBases();
      }
    },
    //新增
    async add() {
      this.Formdialog = {
        model: true, //状态
        title: "新增点", //标题
      };
      this.formObj.forEach((item) => {
        item.disabled = item.prop === "setName";
      });
      this.dialogWidth = "50%";
      this.formObj = formJs.formObj2;
    },
    async getElementType() {
      let res = await this.$api.getElementType({
        name: 1,
      });
      if (res.code == 0) {
        this.formObj[6].options = res.data.map((item) => {
          return {
            label: item.name,
            value: item.name,
            id: item.id,
          };
        });
      }
      let res1 = await this.$api.getStoreBases({});
      if (res1.code == 0) {
        this.formObj[4].options = res1.data.dataSources.map((item) => {
          return {
            label: item.datasourceChoice,
            value: item,
          };
        });
      }
      // let res = await this.$api.getEnumeration();
      // if (res.code == 0) {
      //   res.data.forEach((item) => {
      //     this.formObj[12].options.push({
      //       label: item.name,
      //       value: item.name,
      //       id: item.id,
      //     });
      //   });
      // }
      // let res = await this.$api.getModelDataById({});
      // if (res.code == 0) {
      //   this.formObj[13].treeData = res.data.treeStructure;
      // }
      // console.log(res, "sxk");
    },
    async selectChange(value, index, prop) {
      if (prop == "dataSourceName") {
        this.dataSourceData.map((it) => {
          if (it.dataSourceName == this.formData.dataSourceName) {
            this.formData.dataSourceId = it.id;
          }
        });
      }
      if (prop == "dataSource") {
        this.formData.setName = this.formData.dataSource.setName;
      }
      if (prop == "dropType") {
        this.formObj[2].notShow = this.formData.dropType !== 3;
      }
    },
    async submit(form, title) {
      if (title == "新增点") {
        form.formulaDrop = this.selectRowarr.join(", ");
        if (form.pointLabels == "") {
          form.pointLabels = [];
        }
        let res = await this.$api.insertDropData(form);
        if (res.code == 0) {
          this.VoPageListByDto(1);
          this.selectRowarr = [];
          this.$message.success("新增点成功");
          Object.keys(this.formData).forEach((key) => {
            this.formData[key] = "";
          });
          this.Formdialog.model = false;
          this.getStoreBases();
        } else {
          this.$message.warning(res.msg);
        }
      } else if (title == "编辑点") {
        let res = await this.$api.updateDropData(form);
        if (res.code == 0) {
          this.VoPageListByDto(1);
          this.selectRowarr = [];
          this.$message.success("编辑点成功");
          this.Formdialog.model = false;
          this.getStoreBases();
        } else {
          this.$message.warning(res.msg);
        }
      } else if (title == "标签设置") {
        let res = await this.$api.updateDropData({
          id: this.checkIds.toString(),
          pointLabels: this.formData.pointLabels,
        });
        if (res.code == 0) {
          this.VoPageListByDto(1);
          this.$refs.invoiceVxeTable.$refs.xTable.clearAll();
          this.$message.success("标签设置成功");
          this.Formdialog.model = false;
          this.$refs.invoiceVxeTable.selectIds = [];
          this.$refs.invoiceVxeTable.list = [];
          this.checkIds = [];
        } else {
          this.$message.warning(res.msg);
        }
      }
    },
    //编辑
    async compile(row, name) {
      this.formData = {};
      this.Formdialog = {
        model: true,
        title: name,
      };
      this.dialogWidth = "50%";
      this.formObj = formJs.formObj2;
      this.formData = Object.assign({}, row);
      const isViewDialog = this.Formdialog.title === "查看点";
      const disabledLabels = ["点标识", "数据类型", "所属机组"];
      this.formObj.forEach((item) => {
        item.disabled = isViewDialog || disabledLabels.includes(item.label);
      });
      this.formObj[2].notShow = this.formData.dropType !== 3;
    },
    reset() {
      if (this.Formdialog.title !== "标签设置") {
        Object.keys(this.formData).forEach((key) => {
          this.formData[key] = "";
        });
      }
    },
    addPoint() {
      this.newChoice.model = true;
      this.newChoiceCurrentChange(1);
    },
    handleInputBlur(e) {
      this.cursorIndex = e.srcElement.selectionStart;
    },
    //导入
    leading() {
      this.newBulk = {
        model: true,
        title: "导入",
      };
    },
    //全部导出
    async derive() {
      let res = await this.$api.exportData({
        ...this.searchList,
      });
      if (res) {
        setTimeout(() => {
          this.$refs.invoiceVxeTable.$refs.xTable.clearAll();
        }, 1000);
        downloadFile(res, res.headers["content-disposition"]);
        this.$message.success("导出成功");
        this.checkIds = [];
        this.$refs.invoiceVxeTable.selectIds = [];
        this.$refs.invoiceVxeTable.list = [];
      }
    },
    //测点检查
    inspect() {
      this.newBulk = {
        model: true,
        title: "测点检查",
      };
    },
    //导入确认
    async wellDefined(impFile) {
      // for (let i = 0; i < impFile.length; i++) {
      //   if (impFile[i].raw !== undefined) {
      this.fd.append("file", impFile[0].raw);
      //   }
      // }
      if (this.newBulk.title == "导入") {
        let res = await this.$api.addDropDataUpload(
          this.fd,
          "multipart/form-data"
        );
        if (res.code == 0) {
          this.VoPageListByDto(1);
          this.newBulk.model = false;
          this.$message.success("导入成功");
          this.fd = new FormData();
        } else {
          this.newBulk.model = false;
          this.fd = new FormData();
          this.$message.warning(res.msg);
        }
      } else {
        this.showmodel.dialog = true;
        let res = await this.$api.inspectDrop(this.fd, "multipart/form-data");
        if (res.code == 0) {
          console.log(this.$refs.importFile.impFile, "是什么呀");
          this.fd = new FormData();
          // this.$refs.importFile.impFile = [];
          this.showmodel.dialog = false;
          this.succmodel = {
            dialog: true,
            title: "检查成功",
            obj: res.data,
          };
          this.inspectObj = res.data;
        } else {
          this.fd = new FormData();
          this.$message.warning(res.msg);
        }
      }
      console.log(impFile, "导入的文件");
    },
    //导入成功之后，下载查看
    downView() {
      var proview = window.open("_blank");
      let PublicdownloadAd = "/tao/dropData/downloadFile?address=";
      let url = `${PublicdownloadAd}${this.inspectObj.url}`;
      proview.location = url;
      this.succmodel.dialog = false;
      this.newBulk.model = false;
      this.$message.success("下载成功");
    },
    //源标识编辑
    // mark() {
    //   this.newMark.model = true;
    // },
    //源标识编辑确认
    // async identification(data) {
    //   switch (data.resource) {
    //     case 1:
    //       this.loadStatus = true;
    //       let fd = new FormData();
    //       fd.append("file", data.batchFile[0].raw);
    //       let res = await this.$api.spotUpload(fd, "multipart/form-data");
    //       if (res.code == 0) {
    //         this.loadStatus = false;
    //         this.VoPageListByDto(1);
    //         this.newMark.model = false;
    //         this.$message.success("文件上传成功");
    //       } else {
    //         this.loadStatus = false;
    //         this.newMark.model = false;
    //         this.$message.warning(res.msg);
    //       }
    //       break;

    //     case 2:
    //       this.loadStatus = true;
    //       let res1 = await this.$api.updateDropMark({
    //         newDataSourceMark: data.splicing,
    //       });
    //       if (res1.code == 0) {
    //         this.loadStatus = false;
    //         this.VoPageListByDto(1);
    //         this.newMark.model = false;
    //         this.$message.success("操作成功");
    //       }
    //       break;
    //     case 3:
    //       this.loadStatus = true;
    //       let res2 = await this.$api.updateDropMark({
    //         newDataSourceMark: data.replace,
    //         dataSourceMark: data.find,
    //       });
    //       if (res2.code == 0) {
    //         this.loadStatus = false;
    //         this.VoPageListByDto(1);
    //         this.newMark.model = false;
    //         this.$message.success("操作成功");
    //       }
    //       break;

    //     default:
    //       break;
    //   }
    // },
    //添加点
    async newChoiceCurrentChange(page) {
      this.tablePage.pageIndex = page;
      let res = await this.$api.queryDropDataList({
        pageSize: this.tablePage.pageSize,
        pageNum: this.tablePage.pageIndex,
        sortType: this.tablePage.sortType,
        ascDesc: this.tablePage.ascDesc,
        dropMark: this.tablePage.dropMark,
      });
      if (res.code == 0) {
        this.newChoicetableData = res.data.list;
        this.tablePage.total = res.data.total ? res.data.total : 0;
      }
    },
    newChoicesizeChange(size) {
      this.tablePage.pageSize = size;
      this.newChoiceCurrentChange(1);
    },
    binding(row) {
      let s1 = "";
      let s2 = "";
      if (this.formData.formulaContent.length == this.cursorIndex) {
        this.formData.formulaContent =
          this.formData.formulaContent + row.dropMark;
      } else {
        s1 = this.formData.formulaContent.toString();
        s2 = this.formData.formulaContent.toString();
        this.formData.formulaContent =
          s1.substring(0, this.cursorIndex) +
          row.dropMark +
          s2.substring(this.cursorIndex, this.formData.formulaContent.length);
      }
      this.newChoice.model = false;
      this.selectRowarr.push(row.dropMark);
      this.$nextTick(() => {
        this.$refs.dialogEdit.focus();
      });
    },
    //标签设置
    labelSettings() {
      this.Formdialog = {
        model: true,
        title: "标签设置",
      };
      this.dialogWidth = "35%";
      this.formObj = formJs.formObj3;
      this.tableData.map((ele, index) => {
        if (ele.id == this.checkIds[0]) {
          this.formData = ele;
        }
      });
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
    .page_top {
      /deep/.el-button--primary_one.is-disabled {
        background: #f5f7fa !important;
        color: #c0c4cc !important;
        border-color: #e4e7ed !important;
      }
    }
    .page_bottom {
      margin-top: 16px;
      height: calc(100% - 120px);
    }
    .page_bottom_bottom_h {
      margin-top: 0 !important;
      height: calc(100% - 175px);
    }
    .label_all {
      display: flex;
      justify-content: flex-start;
      .label {
        width: fit-content;
        padding: 0 6px;
        height: 23px;
        border-radius: 15px;
        margin-left: 8px;
      }
    }
  }
}
.lblHelpMessagebox {
  display: flex;
}
.lblHelpMessage1 {
  // width: fit-content;
  min-width: 10px !important;
  width: auto !important;
  padding: 0 6px;
  height: 23px;
  border-radius: 15px;
}
</style>
