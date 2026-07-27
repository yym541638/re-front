<template>
  <div class="table">
    <slot name="header" />
    <el-table
      ref="multipleTable"
      size="small"
      :header-cell-style="headerstyle"
      :height="fixedHeight ? fixedHeight : '100%'"
      v-loading="loading"
      :data="tableList"
      :border="border"
      :highlight-current-row="single"
      :span-method="objectSpanMethod"
      tooltip-effect="dark"
      style="width: 100%; height: 100%"
      @selection-change="handleSelectionChange"
      @current-change="handleSingleChange"
    >
      <el-table-column v-if="selection" type="selection" width="55" />
      <template v-for="(item, index) in tableHeader">
        <el-table-column
          :key="index"
          :label="item.label"
          :prop="item.prop"
          :width="item.width"
          :show-overflow-tooltip="item.inline"
        >
        </el-table-column>
      </template>
      <el-table-column v-if="innerBtns.length" label="操作">
        <!-- <slot name="inline" /> -->
        <template slot-scope="scope">
          <el-button
            v-for="(btn, index) in innerBtns"
            :key="index"
            style="margin-right: 10px"
            type="text"
            size="small"
            @click="
              btn.handle && handleClick(btn.handle, scope.row, scope.$index)
            "
          >
            <span v-if="btn.name === 'more'">
              <el-dropdown trigger="click">
                <span class="el-dropdown-link"> ··· </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item
                    v-for="(item, curKey) in btn.moreBtns"
                    :key="curKey"
                    :disabled="item.disabled"
                    :divided="item.divided"
                  >
                    <div
                      @click="handleClick(item.handle, scope.row, scope.$index)"
                    >
                      {{ item.name }}
                    </div></el-dropdown-item
                  >
                </el-dropdown-menu>
              </el-dropdown>
            </span>
            <span v-else>
              <span
                :class="
                  scope.row.status == 2 && btn.type
                    ? 'red_color'
                    : (scope.row.status == 2 && btn.nocheck) ||
                      (scope.row.status == 0 && btn.nocheck)
                    ? 'ed_color'
                    : ''
                "
              >
                {{
                  btn.formatter
                    ? btn.formatter(scope.row, scope.$index)
                    : btn.name
                }}
              </span>
            </span>
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <div v-if="noPage && tableList.length" class="page">
      <el-pagination
        :current-page="pageInfo.currentPage"
        :page-size="pageInfo.pageSize"
        :total="pageInfo.totalSize"
        background
        layout="total, prev, pager, next, jumper"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script>
export default {
  name: "Table",
  props: {
    tableHeader: {
      type: Array,
      default() {
        return [];
      },
    },
    headerstyle: {
      type: Object,
      default() {
        return {
          background: "transparent",
          color: "#4d4d4d",
        };
      },
    },
    tableList: {
      type: Array,
      default() {
        return [];
      },
    },
    noPage: {
      type: Boolean,
      default: false,
    },
    border: {
      type: Boolean,
      default: false,
    },
    innerBtns: {
      type: Array,
      default() {
        return [];
      },
    },
    selection: {
      type: Boolean,
      default: () => {
        return false;
      },
    },
    single: {
      type: Boolean,
      default: false,
    },
    pageInfo: {
      type: Object,
      default() {
        return {
          totalSize: 0,
          pageSize: 10,
          currentPage: 1,
        };
      },
    },
    clearSelect: {
      type: Boolean,
      default: false,
    },
    loading: {
      type: Boolean,
      default: false,
    },
    fixedHeight: {
      type: String,
      default: "",
    },
    tabeltooltip: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  data() {
    return {
      multipleSelection: [],
    };
  },
  watch: {
    clearSelect(val, old) {
      if (val && val !== old) {
        this.toggleSelection();
      }
    },
  },
  methods: {
    // 选中取消
    toggleSelection(rows) {
      if (rows) {
        // 选中元素
        if (this.single) {
          // 单选
          this.$refs.multipleTable.setCurrentRow(rows);
        } else {
          rows.forEach((row) => {
            this.$refs.multipleTable.toggleRowSelection(row);
          });
        }
      } else {
        // 取消选中
        if (this.single) {
          // 单选
          this.$refs.multipleTable.setCurrentRow();
        } else {
          this.$refs.multipleTable.clearSelection();
        }
      }
    },
    // 设置合并表格单元格
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      this.$emit("set-column-row", { row, column, rowIndex, columnIndex });
    },
    // 多选
    handleSelectionChange(val) {
      this.multipleSelection = val;
      this.$emit("selection-handle", val);
    },
    // 翻页
    handleCurrentChange(val) {
      this.$emit("change-page", val);
    },
    // 表格行操作函数
    handleClick(handle, item, index) {
      if (typeof handle === "string") {
        this.$emit("inner-handle", handle, item, index);
      } else {
        handle(item, index);
      }
    },
    // 单选
    handleSingleChange(val) {
      this.$emit("single-handle", val, this.$refs.multipleTable);
    },
  },
};
</script>

<style lang="less" scoped>
.table {
  width: 100%;
  height: 100%;

  .page {
    text-align: center;
    margin-top: 20px;
  }
  .inner-btn {
    display: inline-block;
    width: 100%;
    height: 100%;
  }
}
.red_color {
  color: red;
}
.ed_color {
  color: #888;
  display: none;
}
/deep/.el-table__row {
  font-family: PingFang SC;
  // font-size: 12px;
  font-weight: 400;
  color: #212121;
}
</style>
