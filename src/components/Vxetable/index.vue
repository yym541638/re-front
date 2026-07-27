<template>
  <div class="page_table_box">
    <div class="search_info">
      <SearchInfo
        v-if="Object.keys(searchList).length > 0"
        :sendSearchTitles="sendSearchTitles"
        :searchList="searchList"
        @colse="searchinfoDe"
        @empty="empty"
      />
    </div>
    <div class="table_vxe">
      <!--row-id="id" -->
      <vxe-table
        resizable
        keep-source
        show-overflow
        show-header-overflow="title"
        ref="xTable"
        :data="tableData"
        height="100%"
        width="100%"
        :show-header="showHeader"
        :tooltip-config="{ zIndex: 9999 }"
        :edit-config="{
          trigger: 'click',
          mode: 'cell',
          showStatus: true,
          icon: 'vxe-icon-edit',
        }"
        header-cell-class-name="head_cell_calss"
        @edit-closed="editClosedEvent"
        @edit-actived="editActivedEvent"
        @checkbox-change="handleCheckboxChange"
        @checkbox-all="handleCheckboxAll"
        @sort-change="sortChange"
        :sortConfig="sortConfig"
        :checkbox-config="{
          trigger: 'cell',
          checkRowKeys: selectRowsId,
          reserve: true,
        }"
        :column-config="getCurrent"
        :radio-config="{
          labelField: '',
          checkMethod: checkRadioMethod,
        }"
        :row-config="{ isCurrent: true, keyField: 'id' }"
        :filter-config="{ remote: true }"
        :cell-class-name="cellClassNames"
        @filter-change="handleFilterChange"
        @filter-visible="handleFilterVisible"
        @cell-click="cellClickEvent"
        @radio-change="radioChangeEvent"
        @resizable-change="handleResize"
      >
        <!-- 多选 -->
        <vxe-column
          v-if="selection && tableTitles.length > 0"
          type="checkbox"
          width="60"
          field="checkbox"
          fixed="left"
        >
        </vxe-column>
        <!-- 单选 -->
        <vxe-column
          type="radio"
          width="60"
          field="radio"
          fixed="left"
          v-if="radio && tableTitles.length > 0"
        >
          <template #header>
            <vxe-button type="text" @click="clearRadioRowEevnt">{{
              radioText
            }}</vxe-button>
          </template>
        </vxe-column>
        <vxe-column
          v-if="tableTitles.length > 0 && seq"
          type="seq"
          title="No"
          width="60"
          fixed="left"
        >
          <template #default="{ row, seq, rowIndex }">
            {{
              (tablePage.pageIndex - 1) * tablePage.pageSize + (rowIndex + 1)
            }}
          </template>
        </vxe-column>
        <!-- 主体单元格 -->
        <template v-for="field in tableTitles">
          <!-- 插槽模式 -->
          <vxe-table-column
            :key="field.fieldName"
            v-if="field.fontendType == 'slot'"
            :min-width="vxetbWidth(field.titleName, field)"
            :field="field.fieldName"
            :title="field.titleName"
            :width="
              field.width
                ? field.width
                : field.slotWidth
                ? tableWidth(field.titleName, field.fieldName)
                : ''
            "
            :sortable="field.sortable ? true : false"
            :filters="field.filtersOptions"
            :filter-multiple="field.filterMultiple"
            :fixed="field.columnIsfixed ? field.columnIsfixed : ''"
          >
            <!-- isAppoint 代表是否引用不规则筛选 -->
            <template
              #filter="{ $panel, column }"
              v-if="!field.filterMultiple && field.isAppoint"
            >
              <template v-for="(option, index) in column.filters">
                <div class="head" v-if="field.screenType == '1'" :key="index">
                  <el-date-picker
                    @change="$panel.changeOption($event, !!option.data, option)"
                    :append-to-body="false"
                    style="width: 100%; height: 100%"
                    clearable
                    :default-value="undefined"
                    v-model="option.data"
                    value-format="yyyy-MM-dd"
                    type="daterange"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    placeholder="选择日期"
                  >
                  </el-date-picker>
                </div>

                <div
                  class="head_two"
                  v-if="field.screenType == '2'"
                  :key="index"
                >
                  <el-input
                    @input="$panel.changeOption($event, !!option.data, option)"
                    v-model="option.data"
                    style="width: 100%"
                    placeholder="请输入内容"
                  ></el-input>
                </div>

                <div
                  class="head_three"
                  :key="index"
                  v-if="field.screenType == '3'"
                >
                  <el-select
                    :popper-append-to-body="false"
                    v-model="option.data"
                    placeholder="请选择"
                    style="width: 100%"
                    @change="$panel.changeOption($event, !!option.data, option)"
                  >
                    <el-option
                      v-for="item in fieldData"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    >
                    </el-option>
                  </el-select>
                </div>
              </template>
            </template>
            <template slot-scope="{ row }">
              <slot :name="field.fieldName" :row="row" />
            </template>
          </vxe-table-column>
          <!-- 渲染函数模式 -->
          <vxe-table-column
            :key="field.fieldName"
            v-else-if="field.editRender"
            :field="field.fieldName"
            :title="field.titleName"
            :edit-render="field.editRender ? {} : null"
            :width="field.width ? field.width : ''"
            :min-width="vxetbWidth(field.titleName, field)"
            :sortable="field.sortable ? true : false"
            :fixed="field.columnIsfixed ? field.columnIsfixed : ''"
          >
            <template #edit="{ row }">
              <input :type="field.type" v-model="row[field.fieldName]" />
            </template>
          </vxe-table-column>
          <vxe-table-column
            :key="field.fieldName"
            v-else-if="field.fontendType == 'stamp'"
            :field="field.fieldName"
            :title="field.titleName"
            :width="field.width ? field.width : ''"
            :min-width="vxetbWidth(field.titleName, field)"
            :sortable="field.sortable ? true : false"
            :filters="field.filtersOptions ? field.filtersOptions : []"
            :fixed="field.columnIsfixed ? field.columnIsfixed : ''"
          >
            <template #filter="{ $panel, column }">
              <template v-for="(option, index) in column.filters">
                <div class="head" v-if="field.screenType == '1'" :key="index">
                  <el-date-picker
                    @change="$panel.changeOption($event, !!option.data, option)"
                    :append-to-body="false"
                    style="width: 100%; height: 100%"
                    clearable
                    :default-value="undefined"
                    v-model="option.data"
                    value-format="yyyy-MM-dd"
                    type="daterange"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    placeholder="选择日期"
                  >
                  </el-date-picker>
                </div>

                <div
                  class="head_two"
                  v-if="field.screenType == '2'"
                  :key="index"
                >
                  <el-input
                    @input="$panel.changeOption($event, !!option.data, option)"
                    v-model="option.data"
                    style="width: 100%"
                    placeholder="请输入内容"
                  ></el-input>
                </div>

                <div
                  class="head_three"
                  :key="index"
                  v-if="field.screenType == '3'"
                >
                  <el-select
                    :popper-append-to-body="false"
                    v-model="option.data"
                    placeholder="请选择"
                    style="width: 100%"
                    @change="$panel.changeOption($event, !!option.data, option)"
                  >
                    <el-option
                      v-for="item in fieldData"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    >
                    </el-option>
                  </el-select>
                </div>
              </template>
            </template>
          </vxe-table-column>

          <!-- 普通单元格模式 -->
          <vxe-table-column
            :key="field.fieldName"
            v-else
            :field="field.fieldName"
            :title="field.titleName"
            :width="field.width ? field.width : ''"
            :min-width="vxetbWidth(field.titleName, field)"
            :sortable="field.sortable ? true : false"
            :filters="field.filtersOptions"
            :filter-multiple="field.filterMultiple ? true : false"
            :fixed="field.columnIsfixed ? field.columnIsfixed : ''"
          >
            <template #header v-if="field.flash">
              <div class="Customheader">
                {{ field.titleName }}
              </div>
            </template>
          </vxe-table-column>
        </template>
        <vxe-column
          title="Operations"
          :width="operationW"
          :min-width="operationW"
          :show-overflow="false"
          class-name="ops-column"
          header-class-name="ops-column"
          :fixed="isfixed ? 'right' : ''"
          v-if="operation && tableTitles.length > 0"
        >
          <template slot-scope="{ row, rowIndex }">
            <div class="ops-cell">
              <slot name="btn_edit" :row="row" :index="rowIndex"> </slot>
            </div>
          </template>
        </vxe-column>
        <template #empty>
          <div class="nulldataArea">暂无数据~</div>
        </template>
      </vxe-table>

      <div class="table_page" v-if="tablePageState && tableTitles.length > 0">
        <div class="table_page_left">
          <el-pagination layout="total" :total="tablePage.total"></el-pagination
          ><span
            >记录， 第 {{ tablePage.pageIndex }}/{{
              Math.ceil(tablePage.total / tablePage.pageSize)
            }}
            页</span
          >
        </div>
        <el-pagination
          background
          @current-change="currentChange"
          @size-change="sizeChange"
          :current-page="tablePage.pageIndex"
          :page-sizes="tableSizes"
          :page-size="tablePage.pageSize"
          layout=" prev, pager, next,sizes,jumper"
          :total="tablePage.total"
        >
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    tablePage: {
      type: Object,
      default: () => {
        return {
          pageIndex: 1,
          pageSize: 20,
          total: 0,
        };
      },
    },
    //控制每页条数数量
    tableSizes: {
      type: Array,
      default: () => {
        return [10, 20, 50, 100, 150, 200, 500];
      },
    },
    //是否有分页
    tablePageState: {
      type: Boolean,
      default: () => {
        return true;
      },
    },
    //是否有操作行
    operation: {
      type: Boolean,
      default: () => {
        return true;
      },
    },
    seq: {
      type: Boolean,
      default: () => {
        return true;
      },
    },
    showHeader: {
      type: Boolean,
      default: () => {
        return true;
      },
    },
    //表头数据
    tableTitles: {
      type: Array,
      default: () => {
        return [];
      },
    },
    operationW: {
      type: [String, Number],
      default: () => {
        return "180";
      },
    },
    //表格数据
    tableData: {
      type: Array,
      default: () => {
        return [];
      },
    },
    selection: {
      //是否开启多选模式
      type: Boolean,
      default: () => {
        return true;
      },
    },
    //操作栏是否固定
    isfixed: {
      type: Boolean,
      default: () => {
        return true;
      },
    },
    radio: {
      //是否开启单选模式
      type: Boolean,
      default: () => {
        return false;
      },
    },
    radioText: {
      type: String,
      default: () => {
        return "";
      },
    },
    highlightedColumn: {
      type: Array,
      default: () => {
        return [];
      },
    },
    sendSearchTitles: {
      type: Array,
      default: () => {
        return [];
      },
    },
    searchList: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  data() {
    return {
      selectIds: [], // 选中的id集合
      selectList: [],
      isAllChecked: false,
      getCurrent: {
        isCurrent: false,
      },
      titleSearchList: {},
      // highlightedColumn: [],
      fieldData: [
        {
          value: "选项1",
          label: "黄金糕",
        },
        {
          value: "选项2",
          label: "双皮奶",
        },
        {
          value: "选项3",
          label: "蚵仔煎",
        },
        {
          value: "选项4",
          label: "龙须面",
        },
        {
          value: "选项5",
          label: "北京烤鸭",
        },
      ],
      tableList: [],
    };
  },
  watch: {},
  computed: {
    selectRowsId() {
      return this.selectList.map((item) => item.id);
    },
    sortConfig() {
      let obj = {
        remote: true, //开启服务端排序
        defaultSort: {
          field: this.sortField,
          order: this.sortBy,
        },
      };
      return obj;
    },
  },
  created() {},
  methods: {
    //全选事件
    handleCheckboxAll() {
      this.isAllChecked = this.$refs.xTable.isAllCheckboxChecked();
      if (this.isAllChecked) {
        let tableDataS = this.tableData;
        tableDataS.map((item, index) => {
          this.selectIds.push(item.id);
          this.tableList.push(item);
        });
        this.selectIds = [...new Set(this.selectIds)];
        this.tableList = [...new Set(this.tableList)];
      } else {
        this.selectIds = [];
      }
      this.$emit("handleCheckboxAll", this.selectIds);
      console.log("全选", this.tableList);
    },
    //单选事件
    handleCheckboxChange({ checked, row }) {
      if (checked) {
        this.selectIds.push(row.id);
        this.tableList.push(row);
      } else {
        this.selectIds = this.selectIds.filter((id) => id !== row.id);
        this.tableList = this.tableList.filter((item) => item !== row);
      }
      this.$emit("handleCheckboxChange", this.selectIds);
      console.log("单选选", this.selectIds);
    },
    //排序事件
    sortChange(sortInfo) {
      this.$emit("sortChange", sortInfo.order, sortInfo.column.field);
    },
    //实时保存
    editActivedEvent({ row, rowIndex }) {},
    //分页
    currentChange(page) {
      console.log("cxbbe", this.selectIds);
      this.$emit("currentChange", page);
    },
    sizeChange(size) {
      this.$emit("sizeChange", size);
    },
    //删除
    removeInsertRow(row, index) {},
    //实时保存
    async editClosedEvent({ row, column }) {
      const xTable = this.$refs.xTable;
      xTable.updateStatus(row);
    },
    handleFilterChange({ column, field, values, datas, filterList, $event }) {
      this.$emit("handleFilterChange", {
        column,
        field,
        values,
        datas,
        filterList,
      });
    },
    cellClassNames({ column, row, rowIndex, columnIndex }) {
      // 根据列字段来决定是否应用高亮样式类
      if (this.highlightedColumn.includes(column.field)) {
        return "highlight_column";
      } else {
      }
      return [];
    },
    handleFilterVisible({ column, field, visible, filterList, $event }) {
      if (visible) {
        // console.log(`筛选面板 ${column.title} 打开`);
      } else {
        column.filters.forEach((item) => {
          if (Array.isArray(item.data) && item.checked == false) {
            // console.log(1);
            item.data = []; // 清空筛选条件
          } else if (item.checked == true) {
            // console.log(2);
            // item.data = "";
          } else {
            item.data = "";
          }
        });
      }
    },
    searchinfoDe(key) {
      this.$emit("searchinfoDe", key);
    },
    //单选禁用
    checkRadioMethod({ row }) {
      return row.dropType == 1;
    },
    clearRadioRowEevnt() {
      this.$emit("clearRadioRowEevnt");
    },
    empty() {
      this.$emit("empty");
    },
    //刷新
    headerCellClickEvent() {
      this.$emit("headerCellClickEvent");
    },
    cellClickEvent() {
      console.log("单元格点击事件");
    },
    handleResize({ column }) {
      this.$emit("handleResize", column);
    },
    radioChangeEvent({ row }) {
      this.$emit("radioChangeEvent", row);
    },

    vxetbWidth(titleName, field) {
      if (field && (field.minWidth || field.width)) {
        return field.minWidth || field.width;
      }
      const text = titleName ? String(titleName) : "";
      // keep header title on one line: ~8.5px per char + cell padding
      return Math.max(110, Math.ceil(text.length * 8.5 + 36));
    },
    tableWidth(titleName, fieldName) {
      return 200;
    },
  },
};
</script>
<style lang="less" scoped>
.page_table_box {
  width: 100%;
  height: 100%;
  border-radius: 4px !important;
  padding: 5px !important;
  /deep/.is--animat .vxe-sort--desc-btn:before {
    font-size: 0.8em !important;
  }
  /deep/.is--animat .vxe-sort--asc-btn:before {
    font-size: 0.8em !important;
  }
  /deep/.vxe-table .vxe-cell--sort-vertical-layout .vxe-sort--asc-btn,
  .vxe-table .vxe-cell--sort-vertical-layout .vxe-sort--desc-btn {
    height: 0.45em;
  }
  /deep/.vxe-table--render-default
    .vxe-cell--radio.is--checked
    .vxe-radio--icon {
    color: #536dfe !important;
  }
  /deep/.vxe-table--render-default
    .vxe-cell--radio:not(.is--disabled):hover
    .vxe-radio--icon {
    color: #536dfe !important;
  }
  .table_vxe {
    width: 100%;
    position: relative;
    height: 100%;
    margin-bottom: 15px;
    /deep/.vxe-table {
      position: absolute;
      width: 100%;
    }
  }
  .table_page {
    width: 100%;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 20px;
    position: absolute;
    bottom: -50px;
    /deep/.el-pagination__total {
      font-family: "PingFang SC";
      font-style: normal;
      font-weight: normal;
      font-size: 12px;
      color: rgba(0, 0, 0, 0.65);
    }
    /deep/.el-pagination.is-background .el-pager li:not(.disabled).active {
      color: #fff;
    }
    .table_page_left {
      display: flex;
      align-items: center;
      font-family: PingFang SC;
      font-style: normal;
      font-weight: normal;
      font-size: 12px;
      color: rgba(0, 0, 0, 0.65);
    }
  }
}
</style>
<style lang="less">
.vxe-table--render-default .is--checked.vxe-cell--checkbox .vxe-checkbox--icon,
.vxe-table--render-default
  .vxe-cell--checkbox:not(.is--disabled):hover
  .vxe-checkbox--icon,
.vxe-table--render-default
  .is--indeterminate.vxe-cell--checkbox
  .vxe-checkbox--icon {
  color: #536dfe !important;
}

.el-pagination.is-background .el-pager li:not(.disabled):hover {
  color: unset;
}
.vxe-table {
  height: 100%;
}
.vxe-table--render-wrapper {
  background-color: unset;
}
.vxe-header--column .vxe-resizable.is--line:before {
  display: none !important;
}
.vxe-table--render-default
  .is--disabled.vxe-cell--checkbox
  .vxe-checkbox--icon {
  color: #ebeef5 !important;
  background-color: #ebeef5 !important;
  border-radius: 3px;
}
.el-pagination.is-background .el-pager li:not(.disabled).active {
  background-color: #536dfe !important;
}
.vxe-table--render-default .vxe-body--row.row--current {
  background-color: unset !important;
}
.vxe-table--render-default .vxe-cell--checkbox .vxe-checkbox--icon {
  font-weight: 500 !important;
}
.vxe-table--render-default.border--full .vxe-table--header-wrapper,
.vxe-table--header,
.vxe-table--render-default .vxe-table--header .vxe-header--row,
.vxe-table--render-default.vxe-editable .vxe-body--column {
  height: 40px !important;
}
.vxe-table--render-default .vxe-header--column:not(.col--ellipsis) {
  padding: 9px 0 !important;
}
.vxe-table--render-default.border--full .vxe-table--header-wrapper {
  background-color: #f5f7fa !important;
}
.vxe-table--render-default.border--full .vxe-body--column {
  background-image: linear-gradient(#dcdfe6, #dcdfe6),
    linear-gradient(#dcdfe6, #dcdfe6);
}
.vxe-table--render-default {
  font-family: "Microsoft YaHei" !important;
  font-weight: 400 !important;
  font-size: 12px !important;
  color: #606266 !important;
  font-style: normal !important;
  text-transform: none;
}

.el-pagination__jump {
  font-family: PingFang SC, PingFang SC;
  font-weight: 400;
  font-size: 14px;
  color: #606266;
  font-style: normal;
}
.head_cell_calss {
  background: #f0f2f5;
  height: 40px;
  font-family: "Microsoft YaHei";
  font-weight: 600 !important;
  font-size: 12px !important;
  color: #909399;
  white-space: nowrap !important;
}
.vxe-table--render-default .vxe-header--column .vxe-cell--title,
.vxe-table--render-default .vxe-header--column .vxe-cell {
  white-space: nowrap !important;
  overflow: visible !important;
  text-overflow: clip !important;
}
.vxe-table--render-default .vxe-header--column {
  white-space: nowrap !important;
}
.highlight_column {
  background: rgba(83, 109, 254, 0.05) !important;
  border-bottom: 1px solid rgba(228, 231, 237, 1);
  border-right: 1px solid rgba(228, 231, 237, 1);
}
.is--filter-active .vxe-cell--filter .vxe-filter--btn,
.vxe-table .vxe-sort--desc-btn.sort--active {
  color: #536dfe !important;
}
.vxe-table--render-default .vxe-table--header-wrapper.fixed-right--wrapper {
  overflow: visible !important;
}
.vxe-table--render-default .vxe-table--body-wrapper.fixed-right--wrapper {
  overflow-x: visible !important;
}
.ops-cell {
  display: inline-flex;
  align-items: center;
  white-space: nowrap;
  overflow: visible;
}
.vxe-table--render-default .ops-column .vxe-cell {
  overflow: visible !important;
  padding-left: 10px !important;
  padding-right: 10px !important;
}
.vxe-table--filter-option.is--checked,
.vxe-table--filter-option.is--checked .vxe-checkbox--icon,
.vxe-table--filter-option.is--indeterminate,
.vxe-table--filter-option.is--indeterminate .vxe-checkbox--icon,
.vxe-table .vxe-sort--asc-btn.sort--active,
.vxe-table--filter-wrapper .vxe-table--filter-footer button:hover {
  color: #536dfe !important;
}
.vxe-table--filter-option:not(.is--disabled):hover .vxe-checkbox--icon {
  color: #536dfe !important;
}
// .el-picker-panel {
//   left: -210px !important;
// }
</style>
<style scoped lang="less">
.head {
  width: 370px;
  padding: 15px;
  /deep/.el-date-editor .el-range-separator {
    padding: 0 !important;
  }
}
.head_two {
  width: 200px;
  padding: 12px 12px 32px 12px;
}
.head_three {
  width: 220px;
  padding: 15px;
}
.Customheader {
  display: flex;
  align-items: center;
  img {
    margin-left: 8px;
    cursor: pointer;
  }
}
.nulldataArea {
  text-align: center;
  color: #212121;
  font-family: "PingFang SC";
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
}
</style>
