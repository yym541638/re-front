<template>
  <div class="wrapper">
    <!--  -->

    <div class="content" v-if="istree">
      <!-- <el-empty
        description="暂未创建电厂，请点击下方按钮创建~"
        :image="require('../../assets/img/addPowerplant.png')"
        :image-size="200"
      >
        <el-button @click="addPowerplant()" type="establish"
          >创建电厂</el-button
        ></el-empty
      > -->
    </div>

    <div class="content" v-else-if="istTable">
      <div class="content_Left">
        <h1>电厂列表</h1>
        <el-input
          style="margin-top: 20px; height: 36px !important"
          placeholder="请输入搜索内容"
          suffix-icon="el-icon-search"
          v-model="filterText"
        >
        </el-input>
        <div class="content_tree">
          <el-tree
            :data="treeStructure"
            :accordion="true"
            :props="defaultProps"
            :highlight-current="highlightBd"
            :current-node-key="defaultExpandKeys"
            :default-expanded-keys="UnfoldArr"
            :filter-node-method="filterNode"
            node-key="id"
            ref="tree"
            @node-expand="handleNodeClick"
            @node-collapse="handleNodeCollapse"
            @node-click="clickTreeItem"
          >
            <span class="custom-tree-node" slot-scope="{ node, data }">
              {{ node.label }}
              <span class="defeatable" @click.stop="clickMore(node)">
                <el-dropdown trigger="click">
                  <el-button type="text">更多</el-button>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item
                      v-for="(it, index) in dropdownArr"
                      :key="index"
                      :disabled="it.disabled"
                      @click.native="dropdownClick(index, it, node, data)"
                      :icon="it.icon"
                      >{{ it.name }}</el-dropdown-item
                    >
                  </el-dropdown-menu>
                </el-dropdown>
              </span>
            </span>
          </el-tree>
        </div>
      </div>
      <div class="content_Right">
        <h1>点表信息</h1>
        <div class="buttonlist">
          <el-button
            :disabled="tableData.length == 0"
            type="primary_one"
            style="
              background: #ffff;
              border-color: #dcdfe6;
              color: #303133;
              font-weight: 600;
            "
            @click="refreshData()"
            >刷新值</el-button
          >
          <el-button
            type="primary_one"
            :disabled="checkIds.length == 0"
            @click="batch('批量')"
            style="
              background: #ffff;
              border-color: #dcdfe6;
              color: #303133;
              font-weight: 600;
            "
            >批量删除</el-button
          >
        </div>
        <div
          class="VxeTableClass"
          :style="
            Object.keys(searchList).length > 0
              ? 'margin-top: 0;'
              : 'margin-top: 18px;'
          "
        >
          <Vxetable
            ref="invoiceVxeTable"
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
            @handleResize="handleResize"
            operationW="130"
          >
            <template slot="dataSourceName" slot-scope="{ row }">
              {{ row.dataSourceName }}
            </template>
            <template slot="pointLabels" slot-scope="{ row }">
              <div style="display: flex">
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
                @click="Newpoint('查看点', row)"
                style="color: #536dfe; font-size: 14px"
                >查看</el-button
              >
              <el-button
                type="text"
                size="small"
                @click="batch(row)"
                style="color: #ff1616; font-size: 14px"
                >删除</el-button
              >
            </div>
          </Vxetable>
        </div>
      </div>
    </div>

    <transition name="fade-transform">
      <Form
        v-if="Formdialog.model"
        ref="dialogEdit"
        :dialogWidth="dialogWidth"
        :dialog="Formdialog"
        :formObj="formObj"
        :formData="formData"
        @submit="submit"
        @close="reset"
      ></Form>
    </transition>
    <Delete v-if="dehoff.model" :dehoff="dehoff" @affirm="affirm"></Delete>
  </div>
</template>

<script>
import formJs from "../../utils/testForm";
export default {
  data() {
    return {
      //高亮列
      highlightedColumn: [],
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
          titleName: "数据源名称",
          fieldName: "dataSourceName",
        },
        {
          titleName: "数据源点表标识",
          fieldName: "dataSourceMark",
        },
        {
          titleName: "点类型",
          // fieldName: "dropType",
          fieldName: "dropTypeStr",
        },
        {
          titleName: "编码方式",
          fieldName: "coding",
        },
        {
          titleName: "压缩算法",
          fieldName: "compress",
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
      istree: null,
      istTable: null,
      checkIds: [],
      defaultExpandKeys: 50,
      UnfoldArr: [],
      clonedArray: [],
      levelForm: {},

      dialogWidth: "50%",
      filterText: "",

      highlightBd: true,
      treeStructure: [],

      formObj: formJs.formObj1,
      formData: formJs.formDataDot,
      tableTitles: formJs.tableTitles,
      tablePage: formJs.tablePage,
      tableData: [],
      Formdialog: {
        model: false,
        title: "新增点",
      },
      currentNode: {},
      dehoff: {
        model: false,
        title: "删除",
        contents: "请确认是否删除该标签信息？",
      },
      defaultProps: {
        children: "children",
        label: "name",
      },
      dropdownArr: [
        {
          name: "新增同级",
          icon: "el-icon-plus",
          disabled: false,
        },
        {
          name: "新增子级",
          icon: "el-icon-plus",
          disabled: false,
        },
        {
          name: "查看",
          icon: "el-icon-s-operation",
          disabled: false,
        },
        {
          name: "删除",
          icon: "el-icon-delete",
          disabled: false,
        },
      ],
      selectRowarr: [],
      dataSourceData: [],
      listId: "",
      setName: "",
    };
  },
  components: {},
  created() {
    this.getModelDataById();
    this.getStoreBases();
  },
  methods: {
    //清空
    empty() {
      this.$refs.invoiceVxeTable.$refs.xTable.clearFilter();
      this.searchList = {};
      this.highlightedColumn = [];
      this.VoPageListByDto(this.tablePage.pageIndex);
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
    //查看点表
    async Newpoint(name, row) {
      this.dialogWidth = "50%";
      this.formObj = formJs.formObj2;
      this.Formdialog = {
        model: true,
        title: name,
      };
      this.formObj = formJs.formObj2;
      this.formData = Object.assign({}, row);
      const isViewDialog = this.Formdialog.title === "查看点";
      const disabledLabels = ["点标识", "数据类型", "所属机组"];
      this.formObj.forEach((item) => {
        item.disabled = isViewDialog || disabledLabels.includes(item.label);
      });
      this.formObj[2].notShow = this.formData.dropType !== 3;
    },

    //删除
    async affirm() {
      if (this.dehoff.type == "tree") {
        if (this.currentNode.level == 1) {
          let res = await this.$api.deleteModelData({
            id: this.currentNode.data.id,
          });
          if (res.code == 0) {
            this.getModelDataById();
            this.dehoff.model = false;
            this.$message.success("删除成功");
          }
        } else {
          let res = await this.$api.deleteModelDetails({
            id: this.currentNode.data.id,
          });
          if (res.code == 0) {
            this.getModelDataById();
            this.dehoff.model = false;
            this.$message.success("删除成功");
          }
        }
      } else if (this.dehoff.type == "table") {
        let res = await this.$api.deleteDropData({
          ids: this.listId !== "" ? this.listId : this.checkIds.toString(),
        });
        if (res.code == 0) {
          this.dehoff.model = false;
          this.$message.success("删除成功");
          this.checkIds = [];
          this.VoPageListByDto(1);
        }
      }
    },
    //新建电厂
    async insertModelData(form, title) {
      let parm = {
        plantMark: form.plantMark,
        plantName: form.plantName,
        plantBlurb: form.plantBlurb,
        country: form.country,
        bloc: form.bloc,
        longitude: form.longitude,
        latitude: form.latitude,
        remarks: form.remarks,
      };

      let res = await this.$api.insertModelData(parm);
      if (res.code == 0) {
        this.Formdialog.model = false;
        this.getModelDataById();
        this.$message.success("创建电厂成功");
        Object.keys(this.formData).forEach((key) => {
          this.formData[key] = "";
        });
      } else {
        this.$message.error(res.msg);
      }
    },
    filterNode(value, data) {
      if (!value) return true; // 如果值为空，则显示所有节点
      return data.name.indexOf(value) !== -1; // 示例：搜索节点标签中包含关键词的节点
    },
    //查询树结构
    async getModelDataById() {
      let res1 = await this.$api.getModelDataById({});
      console.log("currentNode.id", this.currentNode);
      if (res1.code == 0) {
        this.treeStructure = res1.data.treeStructure
          ? res1.data.treeStructure
          : [];
        this.Formdialog.model = false;
        if (this.treeStructure.length > 0) {
          this.istree = false;
          this.istTable = true;
          this.defaultExpandKeys = sessionStorage.getItem("defaultExpandKeys")
            ? sessionStorage.getItem("defaultExpandKeys")
            : this.treeStructure[0].id;
          this.UnfoldArr =
            this.clonedArray.length > 0
              ? this.clonedArray
              : [this.treeStructure[0].id];
          this.$store.state.facName = this.treeStructure[0].name;
          this.VoPageListByDto(1);
        } else {
          this.istree = true;
          this.istTable = false;
        }
      }
    },
    //保存树结构表单
    async insertModelDetailsd(form, title) {
      let parm = {
        name: form.name,
        coding: form.coding,
        unitDescribe: form.unitDescribe,
        remarks: form.remarks,
      };

      if (title == "新增子级") {
        parm.parentId = this.currentNode.data.id;
      } else if (title == "新增同级") {
        parm.parentId = this.currentNode.data.parentId;
      }
      let res = await this.$api.insertModelDetailsd(parm);
      if (res.code == 0) {
        this.$message.success("新增成功");
        this.getModelDataById();
        // this.$nextTick(() => {
        //   this.$refs.dialogEdit.close();
        // });
      } else {
        let d = this.$refs.dialogEdit.$refs.ruleForm.fields;
        for (var i = 0; i < d.length; i++) {
          if (i == 1) {
            d[i]["validateMessage"] = res.msg;
            d[i]["validateState"] = "error";
            return;
          }
        }
      }
    },

    //表单提交按钮
    async submit(form, title) {
      switch (title) {
        case "创建电厂":
        case "创建电厂/新增同级":
          this.insertModelData(form, title);
          break;
        case "新增子级":
        case "新增同级":
          if (this.currentNode.level == 1 && title !== "新增子级") {
            this.insertModelData(form, title);
          } else {
            this.insertModelDetailsd(form, title);
          }

          break;
      }
    },
    reset() {
      Object.keys(this.formData).forEach((key) => {
        this.formData[key] = "";
      });
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
    refreshData() {
      this.VoPageListByDto(1);
      this.$message.success("刷新成功");
    },
    async VoPageListByDto(page) {
      this.tablePage.pageIndex = page;
      let res = await this.$api.queryDropDataList({
        pageSize: this.tablePage.pageSize,
        pageNum: this.tablePage.pageIndex,
        sortType: this.tablePage.sortType,
        ascDesc: this.tablePage.ascDesc,
        ...this.searchList,
        facName: this.$store.state.facName,
        setName: this.setName,
        // deviceId:
        //   Object.keys(this.currentNode).length > 0
        //     ? this.currentNode.data.id
        //     : this.treeStructure[0].id,
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
    sortChange(order, field) {
      this.tablePage.ascDesc = order;
      this.tablePage.sortType = field;
      if (order == null) {
        this.tablePage.ascDesc = "desc";
        this.tablePage.sortType = "createTime";
      }
      this.VoPageListByDto(1);
    },
    async getStoreBases() {
      let res = await this.$api.getTitleChoices({});
      if (res.code == 0) {
        const mapping = {
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

        this.tableTitles[4].filtersOptions = mapping.pointLabels(
          res.data.labels
        );
        this.tableTitles[5].filtersOptions = mapping.dataSourceName(
          res.data.datasourceNames
        );
      }
    },
    handleCheckboxAll(list) {
      this.checkIds = list;
    },
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
    // 点击树节点
    clickTreeItem(data, node) {
      this.defaultExpandKeys = data.id;
      this.setName = "";
      sessionStorage.setItem("defaultExpandKeys", data.id);
      if (node.level == 1) {
        this.$store.state.facName = node.data.name;
      } else {
        this.setName = node.data.name;
        const foundItem = this.treeStructure.find(
          (item) => node.data.parentId === item.id
        );
        if (foundItem) {
          this.$store.state.facName = foundItem.name;
        }
      }

      this.currentNode = node;
      this.VoPageListByDto(1);
      console.log("currentNode", this.currentNode);
    },
    // 展开节点时触发的函数
    handleNodeClick(data, node) {
      let flag = false;
      this.currentNode = node;
      console.log("currentNode", this.currentNode);
      this.UnfoldArr.some((item) => {
        if (item === data.id) {
          // 判断当前节点是否存在， 存在不做处理
          flag = true;
          return true;
        }
      });
      if (!flag) {
        // 不存在则存到数组里
        this.UnfoldArr.push(data.id);
      }
      this.clonedArray = Array.from(this.UnfoldArr);
      console.log("gfng", this.UnfoldArr, node);
    },
    // 关闭节点时触发的函数
    handleNodeCollapse(data) {
      // 删除当前关闭的节点
      console.log("关闭", data);
      this.UnfoldArr.some((item, i) => {
        if (item === data.id) {
          this.UnfoldArr.splice(i, 1);
        }
      });
      this.removeChildrenIds(data);
      // 这里主要针对多级树状结构，当关闭父节点时，递归删除父节点下的所有子节点
      console.log("gfng", this.UnfoldArr);
      this.clonedArray = Array.from(this.UnfoldArr);
    },
    removeChildrenIds(data) {
      const ts = this;
      if (data.children) {
        data.children.forEach(function (item) {
          const index = ts.UnfoldArr.indexOf(item.id);
          if (index > 0) {
            ts.UnfoldArr.splice(index, 1);
          }
          ts.removeChildrenIds(item);
        });
      }
    },

    async clickMore(node) {
      sessionStorage.setItem("defaultExpandKeys", node.data.id);
      this.currentNode = node;
      Object.keys(this.formData).forEach((key) => {
        this.formData[key] = "";
      });
      if (node.level == 1) {
        this.UnfoldArr = [];
        this.dropdownArr[1].disabled = false;
      } else if (node.level == 2) {
        this.UnfoldArr = [];
        this.dropdownArr[1].disabled = true;
      }
    },
    //创建电厂
    addPowerplant() {
      this.formObj = formJs.Plantcreation;
      this.Formdialog = {
        model: true,
        title: "创建电厂/新增同级",
      };
      this.dialogWidth = "50%";
    },
    //树结构 更多
    dropdownClick(index, item, node, data) {
      this.formObj.forEach((obj) => (obj.disabled = false));
      this.dialogWidth = "30%";
      this.currentNode = node;
      // this.formData = {};
      switch (item.name) {
        case "新增同级":
          if (node.level == 1) {
            this.formObj = formJs.Plantcreation;
            this.Formdialog = {
              model: true,
              title: "新增同级",
            };
            //  this.dialogWidth = "50%";
          } else {
            this.formObj = formJs.Peersublevel;
            this.formObj.forEach((obj) => (obj.disabled = false));
            this.Formdialog = {
              model: true,
              title: item.name,
            };
          }
          break;
        case "新增子级":
          this.formObj = formJs.Peersublevel;
          this.formObj.forEach((obj) => (obj.disabled = false));
          this.Formdialog = {
            model: true,
            title: item.name,
          };

          break;
        case "查看":
          this.Formdialog = {
            model: true,
            title: item.name,
          };
          if (node.level == 1) {
            this.formObj = formJs.Plantcreation;
            // this.formData = this.levelForm;
            this.formData = {
              plantMark: data.coding,
              plantName: data.name,
              id: data.id,
              bloc: data.bloc,
              country: data.bloc,
              latitude: data.latitude,
              longitude: data.longitude,
              plantBlurb: data.plantBlurb,
              remarks: data.remarks,
            };
            this.formObj.forEach((obj) => (obj.disabled = true));
          } else {
            this.formObj = formJs.Peersublevel;
            this.formObj.forEach((obj) => (obj.disabled = true));
            this.formData = Object.assign({}, data);
          }
          break;
        case "删除":
          this.deleteModelCheck();

          break;
        default:
          break;
      }
    },
    //删除校验
    async deleteModelCheck() {
      let res = await this.$api.deleteModelCheck({
        id: this.currentNode.data.id,
        type: this.currentNode.level,
      });
      if (res.code == 0) {
        this.dehoff = {
          model: true,
          title: "删除",
          contents: "请确认是否删除该节点及其子节点？",
          type: "tree",
        };
      } else {
        this.$message.error(res.msg);
      }
    },
    batch(row) {
      this.listId = row.id ? row.id : "";
      this.dehoff = {
        model: true,
        title: "删除",
        contents: "请确认是否删除该测点信息？",
        type: "table",
      };
    },
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    },
  },
  beforeDestroy() {
    sessionStorage.removeItem("defaultExpandKeys");
  },
};
</script>
<style scoped lang="less">
.wrapper {
  width: 100%;
  height: calc(100% - 75px);
  padding: 20px 20px 0 20px;
  .content {
    height: 100%;
    width: 100%;
    background: #fff;
    display: flex;
    h1 {
      color: #212121;
      text-align: center;
      font-family: "PingFang SC";
      font-size: 16px;
      font-style: normal;
      font-weight: 500;
      text-align: left;
    }
    .content_Left {
      height: 100%;
      width: 25%;
      border-right: 1px solid #dcdfe6;
      box-sizing: border-box;
      padding: 20px 24px;
      display: flex;
      flex-direction: column;
      /deep/.el-input__inner {
        height: 36px !important;
        line-height: 36px !important;
      }
      .content_tree {
        width: 100%;
        flex: 1;
        margin-top: 18px;
        overflow: auto;
      }
    }
    .content_Right {
      height: 100%;
      width: 75%;
      padding: 20px 24px;
      .VxeTableClass {
        height: calc(100% - 145px);
      }
      .buttonlist {
        display: flex;
        height: 36px;
        margin-top: 18px;
        /deep/.el-button {
          height: 36px !important;
        }
      }
    }
  }
}

/* 笔记本端适配 */
@media screen and (max-width: 1280px) {
  .wrapper {
    padding: 15px 15px 0 15px;
  }
  
  .content {
    .content_Left {
      width: 30%;
      padding: 15px 20px;
    }
    
    .content_Right {
      width: 70%;
      padding: 15px 20px;
    }
  }
}

/* 小屏幕笔记本适配 */
@media screen and (max-width: 1024px) {
  .wrapper {
    padding: 10px 10px 0 10px;
    height: calc(100% - 60px);
  }
  
  .content {
    flex-direction: column;
    
    .content_Left {
      width: 100%;
      height: 30%;
      border-right: none;
      border-bottom: 1px solid #dcdfe6;
      padding: 10px 15px;
    }
    
    .content_Right {
      width: 100%;
      height: 70%;
      padding: 10px 15px;
      
      .VxeTableClass {
        height: calc(100% - 120px);
      }
      
      .buttonlist {
        margin-top: 10px;
      }
    }
  }
  
  .custom-tree-node {
    font-size: 13px !important;
    padding-left: 8px !important;
  }
  
  h1 {
    font-size: 14px !important;
  }
}

/* 平板和小屏幕设备适配 */
@media screen and (max-width: 768px) {
  .wrapper {
    padding: 5px 5px 0 5px;
  }
  
  .content {
    .content_Left {
      height: 25%;
      padding: 8px 10px;
    }
    
    .content_Right {
      height: 75%;
      padding: 8px 10px;
    }
  }
  
  .buttonlist {
    flex-wrap: wrap;
    height: auto !important;
    
    .el-button {
      margin-bottom: 8px !important;
      margin-right: 8px !important;
    }
  }
}
// .custom-input {
//   /deep/.el-input__inner {
//     padding: 0 36px !important;
//     border: 1px solid #dcdfe6 !important;
//     background: #ffffff !important;
//   }
//   /deep/ .el-input__suffix {
//     position: absolute;
//     left: 5px !important;
//     top: -2px !important;
//     text-align: left;
//   }
// }

.custom-tree-node {
  display: inline-block;
  font-family: PingFang SC;
  font-weight: 400;
  font-size: 14px;
  text-align: left;
  font-style: normal;
  text-transform: none;
  padding-left: 12px;
  position: relative;
  color: #212121;
  width: 100%;
  .defeatable {
    display: inline-block;
    position: absolute;
    top: -9px;
    right: 0;
    /deep/.el-button--text,
    .el-button--text:hover {
      color: #536dfe !important;
    }
  }
}
</style>
<style lang="less">
.el-tree-node__content {
  height: 32px !important;
}
.defeatable {
  .el-popper[x-placement^="bottom"] {
    padding: 0 !important;
    background: #ffffff !important;
  }
}
.el-dropdown-menu__item.is-disabled {
  color: #bbb !important;
}
.el-empty {
  width: 100%;
}
.el-empty__description p {
  color: #212121;
  font-family: "PingFang SC";
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
}
.el-button--establish,
.el-button--establish:hover,
.el-button--establish:focus {
  width: 320px !important;
  color: #fff;
  background-color: #536dfe !important;
  border: none !important;
  border-radius: 4px !important;
  text-align: center !important;
  font-family: "PingFang SC" !important;
  padding: 9px 20px !important;
  font-size: 14px;
  font-style: normal !important;
  font-weight: 700 !important;
}
.el-empty__description {
  margin-top: 0 !important;
}
.el-empty__bottom {
  margin-top: 32px !important;
}
.el-tree__empty-block {
  color: #212121 !important;
  font-family: "PingFang SC" !important;
  font-size: 14px !important;
  font-style: normal !important;
  font-weight: 400 !important;
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
