<template>
  <div class="page">
    <div class="page_content">
      <div class="page_top">
        <div class="btns">
          <el-button
            type="primary"
            size="medium"
            @click="adddataSource('新增数据源')"
            style="background: #536dfe; border-color: #536dfe; color: #ffffff"
            >新增数据源</el-button
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
          :selection="false"
          :highlightedColumn="highlightedColumn"
          :sendSearchTitles="sendSearchTitles"
          :searchList="searchList"
          @searchinfoDe="searchinfoDe"
          @empty="empty"
          @handleFilterChange="handleFilterChange"
        >
          <template slot="facName" slot-scope="{ row }">
            {{ row.facName }}
          </template>
          <template slot="dataSourceType" slot-scope="{ row }">
            {{ row.dataSourceType }}
          </template>
          <template slot="storeBase" slot-scope="{ row }">
            {{ row.storeBaseJson.value2 }}
          </template>

          <template slot="status" slot-scope="{ row }">
            <div class="label_all">
              <div
                class="dot"
                :style="
                  row.status == 0
                    ? 'background:#48BF5C'
                    : row.status == 1
                    ? 'background:#FF1616'
                    : ' background:#666666'
                "
              ></div>
              {{
                row.status == 0
                  ? "连接成功"
                  : row.status == 1
                  ? "连接失败"
                  : "未测试连接"
              }}
            </div>
          </template>
          <template slot="isBoot" slot-scope="{ row }">
            {{ row.isBoot == "0" ? "停用" : "启用" }}
          </template>
          <div slot="btn_edit" slot-scope="{ row }">
            <el-button
              type="text"
              size="small"
              :disabled="row.isBoot == '1'"
              @click="adddataSource('编辑数据源', row)"
              style="color: #536dfe; font-size: 14px"
              >编辑</el-button
            >
            <el-button
              type="text"
              size="small"
              :disabled="row.status !== 0"
              @click="stopOpen(row)"
              style="color: #536dfe; font-size: 14px"
              >{{ row.isBoot == "0" ? "启用" : "停用" }}</el-button
            >
            <el-button
              type="text"
              size="small"
              @click="adddataSource('查看数据源', row)"
              style="color: #536dfe; font-size: 14px"
              >查看</el-button
            >
            <el-button
              :disabled="row.isBoot == '1'"
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
    <!--新增编辑  -->
    <transition name="fade-transform">
      <Form
        ref="Formdialog"
        v-if="Formdialog.model"
        :dialogWidth="dialogWidth"
        :dialog="Formdialog"
        :formObj="formObj"
        :formData="formData"
        @selectChange="selectChange"
        @testContinue="testContinue"
        @submit="submit"
        @close="close"
      >
        <template slot="loginOrinPwd" slot-scope="{ item }">
          <el-input
            type="password"
            clearable
            v-model="form[item.fieldName]"
          ></el-input>
        </template>
      </Form>
    </transition>
    <!-- 删除 -->
    <!-- <transition name="fade-transform"> -->
    <Delete v-if="dehoff.model" :dehoff="dehoff" @affirm="affirm"></Delete>
    <!-- </transition> -->
  </div>
</template>
<script>
import formJs from "../../utils/testForm";
export default {
  data() {
    return {
      dialogWidth: "50%",
      formObj: formJs.dataSourceformObj,
      formData: formJs.dataSourceformData,
      Formdialog: {
        model: false,
        title: "新增数据源",
      },
      sendSearchTitles: [
        {
          titleName: "数据源名称",
          fieldName: "dataSourceName",
        },
        {
          titleName: "数据源编码",
          fieldName: "dataSourceCoding",
        },
        {
          titleName: "数据源类型",
          fieldName: "dataSourceType",
        },
        {
          titleName: "IP地址",
          fieldName: "address",
        },
        {
          titleName: "端口",
          fieldName: "port",
        },
        {
          titleName: "采集周期",
          fieldName: "collectionCycle",
        },
        {
          titleName: "数据源库",
          fieldName: "database",
        },
        {
          titleName: "创建时间",
          fieldName: "createTime",
        },
        {
          titleName: "数据源库连接状态",
          fieldName: "statusStr",
        },
        {
          titleName: "所属电厂",
          fieldName: "facName",
        },
        {
          titleName: "目标库",
          fieldName: "storeBaseStr",
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
          fieldName: "dataSourceName",
          titleName: "数据源名称",
          fontendType: "stamp",
          sortable: true,
          screenType: "2",
          filtersOptions: [{ data: "" }],
          width: "200",
          columnIsfixed: "left",
        },
        {
          fieldName: "dataSourceCoding",
          titleName: "数据源编码",
          fontendType: "stamp",
          sortable: true,
          screenType: "2",
          filtersOptions: [{ data: "" }],
          width: "200",
          columnIsfixed: "left",
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
          fieldName: "address",
          titleName: "IP地址",
          fontendType: "stamp",
          sortable: true,
          screenType: "2",
          filtersOptions: [{ data: "" }],
          width: "200",
        },
        {
          fieldName: "port",
          titleName: "端口",
          fontendType: "stamp",
          sortable: true,
          screenType: "2",
          filtersOptions: [{ data: "" }],
          width: "200",
        },
        {
          fieldName: "collectionCycle",
          titleName: "采集周期",
          fontendType: "stamp",
          sortable: true,
          screenType: "2",
          filtersOptions: [{ data: "" }],
          width: "200",
        },
        {
          fieldName: "database",
          titleName: "数据源库",
          fontendType: "stamp",
          sortable: true,
          screenType: "2",
          filtersOptions: [{ data: "" }],
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
        {
          fieldName: "storeBase",
          titleName: "目标库",
          width: "120",
          sortable: true,
          fontendType: "slot",
          filterMultiple: true,
          filtersOptions: [],
        },

        {
          fieldName: "status",
          titleName: "数据源库连接状态",
          fontendType: "slot",
          sortable: true,
          filterMultiple: true,
          filtersOptions: [
            { label: "连接成功", value: 0 },
            { label: "连接失败", value: 1 },
            { label: "未测试连接", value: 2 },
          ],
          width: "200",
        },
        {
          fieldName: "isBoot",
          titleName: "启停状态",
          fontendType: "slot",
          sortable: true,
          width: "120",
        },
      ],
      dataSourceid: "", //数据源id
      isBoot: "",
      tableData: [],
      formDatacopy: {},
      formCopy: {},
      //高亮列
      highlightedColumn: [],
      dehoff: {
        model: false,
        title: "删除",
        contents: "请确认是否删除该标签信息？",
      },
    };
  },
  components: {},
  created() {
    this.VoPageListByDto(1);
    this.getStoreBases();
  },
  methods: {
    //启用🈲用
    stopOpen(data) {
      this.isBoot = data.isBoot;
      this.dataSourceid = data.id;
      this.dehoff = {
        model: true,
        title: data.isBoot == "0" ? "启用" : "停用",
        contents:
          "请确认是否" + (data.isBoot == "0" ? "启用" : "停用") + "该数据源？",
      };
    },
    //新增数据源
    adddataSource(name, data) {
      this.Formdialog = {
        model: true,
        title: name,
      };
      this.formData = {};
      if (name == "查看数据源") {
        this.formObj.forEach((obj) => (obj.disabled = true));
      } else {
        this.formObj.forEach((obj) => {
          obj.disabled = !!obj.isdisabled;
        });
      }
      switch (name) {
        case "新增数据源":
          this.formData = formJs.dataSourceformData;
          Object.keys(this.formData).forEach((key) => {
            this.formData[key] = "";
          });
          this.formData.parameter = [
            {
              value1: "",
              value2: "",
            },
          ];
          this.formData.dataSourceType = "redis";
          this.selectChange("redis", 1, "dataSourceType");

          break;
        case "编辑数据源":
        case "查看数据源":
          this.formDatacopy = data;
          this.dataSourceid = data.id;
          this.selectChange(data.dataSourceType, 1, "dataSourceType");
          //  this.formData = Object.assign({}, data);
          this.formData = data;
          this.formData.storeBase = data.storeBaseJson;
          break;
      }
    },
    //所属电厂 目标库下拉数据
    async getStoreBases() {
      let res = await this.$api.getStoreBases({});
      if (res.code == 0) {
        const mapping = {
          facName: (data) =>
            data?.map((option) => ({
              label: option.value1,
              value: option.value1,
            })),
          storeBase: (data) =>
            data?.map((option) => ({
              label: option.value2,
              value: option,
            })),
            storeBasestr: (data) =>
            data?.map((option) => ({
              label: option.value2,
              value: option.value2,
            })),
        };
        // 遍历 formObj 设置 options
        this.formObj.forEach((item) => {
          if (mapping[item.prop]) {
            item.options = mapping[item.prop](
              res.data[item.prop === "facName" ? "facVal" : "storeBases"]
            );
          }
        });
        // 设置 tableTitles 的 filtersOptions
        this.tableTitles[3].filtersOptions = mapping.facName(res.data.facVal);
        this.tableTitles[9].filtersOptions = mapping.storeBasestr(
          res.data.storeBases
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
      let res = await this.$api.queryDataSourceList({
        pageSize: this.tablePage.pageSize,
        pageNum: this.tablePage.pageIndex,
        sortType: this.tablePage.sortType,
        ascDesc: this.tablePage.ascDesc,
        ...this.searchList,
      });
      if (res.code == 0 && res.data.list) {
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
          if (curr.field == "storeBase") {
            acc.storeBaseStr = curr.values.toString();
          } else {
            acc[curr.field] = curr.values.toString();
          }
        } else {
          if (curr.field == "status") {
            acc.statusStr = curr.values.toString();
          } else {
            acc[curr.field] = curr.values[0];
          }
        }
        return acc;
      }, {});
      this.VoPageListByDto(1);
      console.log(this.searchList, val.filterList);
    },

    //删除
    deh(data) {
      this.dataSourceid = data.id;
      this.dehoff = {
        model: true,
        contents: "请确认是否删除该数据源？",
        title: "删除",
      };
    },
    //删除/启禁用确认
    async affirm() {
      if (this.dehoff.title == "删除") {
        let res = await this.$api.deleteDataSource({ id: this.dataSourceid });
        if (res.code == 0) {
          this.dehoff.model = false;
          this.VoPageListByDto(1);
          this.$message.success("删除数据源成功");
        } else {
          this.$message.error(res.msg);
        }
      } else {
        let res1 = await this.$api.updateisBoot({
          id: this.dataSourceid,
          isBoot: this.isBoot == "0" ? "1" : "0",
        });
        if (res1.code == 0) {
          this.dehoff.model = false;
          this.VoPageListByDto(1);
          this.$message.success(
            (this.isBoot == "0" ? "启用" : "禁用") + "数据源成功"
          );
        } else {
          this.$message.error(res1.msg);
        }
      }
    },
    //数据源 类型切换
    selectChange(value, index, prop) {
      console.log(this.formData.storeBase);
      if (prop == "storeBase") {
        this.formData.facName = this.formData.storeBase.value1.split("-")[0];
      }
      if (prop !== "dataSourceType") return;
      const visibilityMap = {
        redis: {
          show: [7, 8, 9, 11, 14],
          hide: [5, 6, 10, 12],
        },
        "sql server": {
          show: [7, 8, 9, 10, 11],
          hide: [5, 6, 12, 14],
        },
        "REST API": {
          show: [5, 6, 12],
          hide: [7, 8, 9, 10, 11, 14],
          customAction: () => {
            if (Object.keys(this.formDatacopy).length === 0) {
              this.formData.parameter = [{ value1: "", value2: "" }];
            } else {
              this.formData = this.formDatacopy;
            }
          },
        },
      };

      const config = visibilityMap[value];
      if (!config) return;
      // 执行通用逻辑
      config.hide.forEach((index) => {
        this.formObj[index].notShow = true;
      });
      config.show.forEach((index) => {
        this.formObj[index].notShow = false;
      });

      // 执行特定逻辑（如果有）
      if (config.customAction) {
        config.customAction();
      }
    },
    async submit(form, title) {
      if (title == "新增数据源") {
        form.status =
          this.isObjectEqual(form, this.formCopy) == true ? form.status : 2;
        this.comparison(form);
        let res = await this.$api.addDataSourcePage(form);
        if (res.code == 0) {
          this.VoPageListByDto(1);
          this.Formdialog.model = false;
          this.$message.success("新增数据源成功");
        } else {
          // this.$message.error(res.msg);
          let d = this.$refs.Formdialog.$refs.ruleForm.fields;
          for (var i = 0; i < d.length; i++) {
            if (i == 1) {
              d[i]["validateMessage"] = res.msg;
              d[i]["validateState"] = "error";
              return;
            }
          }
        }
      } else if (title == "编辑数据源") {
        console.log("是否相同", this.isObjectEqual(form, this.formCopy));
        form.status =
          this.isObjectEqual(form, this.formCopy) == true ? form.status : 2;
        form.id = this.dataSourceid;
        this.comparison(form);
        let res = await this.$api.updateDataSourceList(form);
        if (res.code == 0) {
          this.VoPageListByDto(1);
          this.Formdialog.model = false;
          this.$message.success("编辑数据源成功");
        } else {
          let d = this.$refs.Formdialog.$refs.ruleForm.fields;
          for (var i = 0; i < d.length; i++) {
            if (i == 1) {
              d[i]["validateMessage"] = res.msg;
              d[i]["validateState"] = "error";
              return;
            }
          }
          // this.$message.error(res.msg);
        }
      }
    },
    //切换数据源类型 清空字段内容
    comparison(form) {
      const resetMap = {
        redis: {
          fieldsToReset: ["urlData", "requestWay"],
          parameter: [{ value1: "", value2: "" }],
        },
        "sql server": {
          fieldsToReset: ["userPassword"],
        },
        "REST API": {
          fieldsToReset: [
            "address",
            "port",
            "database",
            "userName",
            "userPassword",
          ],
        },
      };

      const config = resetMap[form.dataSourceType];
      if (!config) return;
      // 重置指定字段
      config.fieldsToReset.forEach((field) => {
        form[field] = "";
      });
      // 如果有额外的参数需要设置
      if (config.parameter) {
        form.parameter = config.parameter;
      }
    },
    //比对两个对象 是否一样
    isObjectEqual(obj1, obj2) {
      if (obj1 === obj2) return true;
      if (
        typeof obj1 !== "object" ||
        obj1 === null ||
        typeof obj2 !== "object" ||
        obj2 === null
      ) {
        return false;
      }
      const keys1 = Object.keys(obj1);
      const keys2 = Object.keys(obj2);
      if (keys1.length !== keys2.length) return false;
      for (let key of keys1) {
        const val1 = obj1[key];
        const val2 = obj2[key];
        if (typeof val1 === "object" && val1 !== null) {
          if (!this.isObjectEqual(val1, val2)) return false;
        } else if (val1 !== val2) {
          return false;
        }
      }
      return true;
    },
    //测试连接
    async testContinue(form) {
      form.status = form.status ? form.status : 2;
      let res = await this.$api.testConnection(form);
      if (res.code == 0) {
        this.formData.status = res.data;
        if (res.data == 0) {
          this.$message.success("连接成功");
        } else {
          this.$message.error("连接失败");
        }

        this.formCopy = Object.assign({}, this.formData);
        console.log("formCopy", this.formCopy);
      } else {
        this.$message.error(res.msg);
      }
    },
    close() {
      this.formDatacopy = {};
    },
  },
};
</script>
<style scoped lang="less">
/deep/.el-button.is-disabled.el-button--text {
  color: #999999 !important;
}
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
      // width: 100%;
      height: calc(100% - 120px);
    }
    .page_bottom_bottom_h {
      margin-top: 0 !important;
      height: calc(100% - 175px);
    }
    .label_all {
      display: flex;
      justify-content: flex-start;
      align-items: center;

      .dot {
        width: 6px;
        height: 6px;
        border-radius: 100%;
        margin-right: 10px;
      }
    }
  }
}
</style>
