<template>
  <div class="table_box">
    <div class="table_">
      <el-table
        :stripe="stripe"
        :fit="true"
        class="table_1"
        :header-cell-class-name="cellClass"
        :class="{ table_Nopage: !tablePageState }"
        ref="table"
        :data="tableLists"
        v-loading="loading"
        height="100%"
        style="width: 100%"
        :row-key="getRowKey"
        :header-cell-style="{
          height: '48px',
          background: '#F2F2F2',
          color: '#000000',
          fontWeight: 'bold',
          fontSize: '14px',
          fontFamily: '.PingFang SC',
          width: '100%',
          'white-space': 'nowrap',
        }"
        :show-header="showHeader"
        @selection-change="selectionChange"
        @sort-change="sortChange"
        :tree-props="treeProp"
      >
        <el-table-column
          v-if="selection"
          :reserve-selection="true"
          type="selection"
          width="55"
        >
        </el-table-column>
        <template v-for="(key, keyindex) in tableTitles">
          <!-- text -->
          <el-table-column
            :show-overflow-tooltip="true"
            v-if="key.fontendType == 'text'"
            :key="keyindex"
            :fixed="key.fixed ? key.fixed : false"
            :width="tableWidth(key.titleName, key.fieldName)"
            :prop="propToString(key.fieldName)"
            :label="key.titleName"
            :sortable="key.fieldNull"
          >
          </el-table-column>
          <!--  'slot' -->
          <!--  key.fieldLength ? key.fieldLength : -->
          <el-table-column
            :show-overflow-tooltip="true"
            v-if="key.fontendType == 'slot'"
            :key="keyindex"
            :fixed="key.fixed ? key.fixed : false"
            :width="tableWidth(key.titleName, key.fieldName)"
            :prop="key.fieldName"
            :label="key.titleName"
            :sortable="key.fieldNull"
          >
            <template slot-scope="{ row, $index }">
              <slot :name="key.fieldName" :data="row" :index="$index"> </slot>
            </template>
          </el-table-column>
          <!--  'expand' -->
          <!-- <el-table-column
            :show-overflow-tooltip="true"
            v-if="key.fontendType == 'expand'"
            :key="keyindex"
            :fixed="key.fixed ? key.fixed : false"
            :width="tableWidth(key.titleName, key.fieldName)"
            :prop="key.fieldName"
            :label="key.titleName"
            type="expand"
          >
            <template slot-scope="{ row }">
              <slot :name="key.fieldName" :data="row"> </slot>
            </template>
          </el-table-column> -->
        </template>
        <slot name="column"></slot>
        <el-table-column v-if="tableLists.length < 10"> </el-table-column>
        <!-- 操作 -->
        <el-table-column
          fixed="right"
          label="操作"
          v-if="commandType != 'none' && tableLists.length > 0"
          min-width="100px"
          :width="commandList.length > 0 ? commandWidth(commandList) : 'auto'"
        >
          <!-- <template slot="header">
            <img
              style="cursor: pointer"
              src="../../assets/table/selectTitle.png"
              alt=""
            />
          </template> -->
          <template slot-scope="{ row, $index }">
            <div style="diaplay: flex; width: max-content">
              <!-- 按钮以...形式展现 -->
              <el-dropdown
                v-if="commandType == 'shrink'"
                :tabindex="tabindex"
                @command="handleCommand"
              >
                <span class="el-icon-more"></span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item
                    v-for="(com, comIn) in commandList"
                    v-show="opertionShow(com, row)"
                    :key="comIn"
                    :command="{
                      ...com,
                      comIndex: comIn,
                      $index: $index,
                      row: row,
                    }"
                    :style="
                      tabindex == comIn
                        ? 'background:rgba(95, 149, 247, 0.05)'
                        : ''
                    "
                  >
                    <!-- <img
                      class="table_img"
                      :src="
                        $utils.requireImg(
                          tabindex == comIn ? com.icon + '_active' : com.icon,
                          'table'
                        )
                      "
                      alt=""
                    /> -->
                    <span :style="tabindex == comIn ? 'color:#3166F2' : ''">{{
                      com.name
                    }}</span>
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
              <!-- 按钮直接显示 -->
              <div v-if="commandType == 'stretch'" style="diaplay: flex">
                <template v-for="(com, comIn) in commandList">
                  <el-button
                    :key="comIn"
                    v-if="opertionShow(com, row)"
                    @click="
                      handleCommand({
                        ...com,
                        comIndex: comIn,
                        $index: $index,
                        row: row,
                      })
                    "
                    :command="{ ...com, index: comIn, row: row }"
                    :class="com.name == '删除' ? 'btnS' : 'btnY'"
                    :style="
                      tabindex == comIn
                        ? 'background:rgba(95, 149, 247, 0.05)'
                        : ''
                    "
                    type="text"
                    >{{ com.name }}</el-button
                  >
                </template>
                <!-- 插槽使用 -->
                <slot name="btn" :data="row"> </slot>
              </div>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="table_page" v-if="tablePageState">
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
</template>

<script>
import { mapState } from "vuex";

export default {
  props: {
    stripe: {
      //stripe 斑马纹
      type: Boolean,
      default: () => {
        return false;
      },
    },
    selection: {
      //是否开启多选模式
      type: Boolean,
      default: () => {
        return false;
      },
    },
    showHeader: {
      // 是否显示表头
      type: Boolean,
      default: () => {
        return true;
      },
    },
    // 动态表头数据
    tableTitles: {
      type: Array,
      default: () => {
        return [];
      },
    },
    // 动态表体数据
    tableLists: {
      type: Array,
      default: () => {
        return [];
      },
    },
    // 是否加载等待
    loading: {
      type: Boolean,
      default: false,
    },
    //控制每页条数数量
    tableSizes: {
      type: Array,
      default: () => {
        return [10, 20, 50, 100];
      },
    },
    // 分页参数
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
    // 是否需要分页
    tablePageState: {
      type: Boolean,
      default: () => {
        return true;
      },
    },
    tableHandler: {
      type: Object,
      default: () => {},
    },
    /**
     * 操作展现形式
     * none 无需操作列
     * stretch 伸展
     * shrink 收缩
     */
    commandType: {
      type: String,
      default: () => {
        return "stretch";
      },
    },
    /**操作绑定的列表数据
     * path:跳转路由的path
     * name:跳转路由的name
     * icon：图标名称
     */
    commandList: {
      type: Array,
      default: () => {
        return [];
      },
    },
    /** 树结构table
     * children 子集字段
     * hasChildren 拥有子集的字段
     */
    treeProp: {
      type: Object,
      default: () => {},
    },
  },
  computed: {
    ...mapState("naviBar", ["roleId"]),
  },
  created() {
    console.log("44444444444444", this.tableLists);
  },
  data() {
    return {
      tablePageIndex: 1,
      pageSizes: [20, 50, 100], //每页显示的总条数
      checkList: [], //当前页面多选的组
      sendCheckList: { 1: [], 2: [] }, //多选选中的数据id
      pageCheck: {}, //当前页面的多选状态
      tabindex: -1, //列表操作当前选中
      selectIds: [],
    };
  },
  watch: {
    deep: true,
  },
  beforeMount() {},
  mounted() {
    console.log();
    this.$refs.table.doLayout();
  },
  /**自定义事件
   * command 操作指令事件
   * deletes 列表删除事件
   * edit 列表编辑事件
   * currentChange 分页改变事件
   * sizeChange 分页每页总条数改变事件
   * check 多选事件的ids对象数组
   * selectionChange 多选事件两个参数 参数1 ids数组 参数2 所选对象数组
   */
  methods: {
    cellClass(row) {
      // if (row.columnIndex === 0) {
      //   return "disabledCheck";
      // }
    },
    sortChange(row, data) {
      let params = {
        sortWord: row.prop,
        sortOrder:
          row.order == "descending"
            ? "desc"
            : row.order == null
            ? "desc"
            : "asc",
      };
      this.$emit("sortChange", params);
    },
    renderHeader() {
      return <i class="el-icon-setting"></i>;
    },
    /**
     *没列数据绑定排除小数点.
     */
    propToString(fieldName) {
      return fieldName.replace(/\./g, "");
    },
    /**
     * 根据需求动态修改列表唯一属性
     */
    getRowKey(row) {
      return row.id;
    },
    /**
     * 多选事件
     */
    selectionChange(list) {
      // console.log(list);
      this.selectIds = [];
      let ids = this.selectionChangeFilterId(list);
      // console.log(ids);
      this.$emit("check", ids);
      this.$emit("selectionChange", ids, list);
    },
    //递归多选id
    selectionChangeFilterId(arr) {
      if (!arr) return;
      arr.map((item) => {
        if (item.children) {
          this.selectionChangeFilterId(item.children);
        }
        this.selectIds.push(item.id ? item.id : item.ids);
      });
      return [...new Set(this.selectIds)];
    },
    /**
     * 操作按钮动态显示
     * 根据每个项目的权限自行编辑或者直接使用插槽按钮在子组件内部进行使用
     */
    opertionShow(com, row) {
      //  console.log("***********************", com, row);
      // return true;
      if (
        this.$route.name == "materialneedplan" ||
        this.$route.name == "planprodbomdetails"
      ) {
        if (com.GList) {
          let a = this.tableLists.map((item) => {
            if (com.GList.indexOf(row.state) != -1) {
              return true;
            } else {
              return false;
            }
          });
          if (a.indexOf(true) != -1) {
            return true;
          } else {
            return false;
          }
        } else {
          return false;
        }
      } else {
        return true;
      }
    },
    /**
     * 操作点击事件
     * 编辑||删除为默认事件，触发无需command
     */
    handleCommand(com) {
      // console.log("com", com);
      this.tabindex = com.index;
      if (com.name == "编辑") {
        this.$emit("edit", com.row); //
        return;
      } else if (com.name == "删除") {
        this.$emit("deletes", com.row);
        return;
      }
      this.$emit("command", com);
    },
    // 分页事件
    currentChange(page) {
      this.$emit("currentChange", page);
    },
    // 页数控制事件
    sizeChange(size) {
      this.$emit("sizeChange", size);
    },
    tableWidth(titleName, fieldName) {
      console.log(titleName, fieldName);
      var num = titleName.length;
      if (
        this.$route.name == "datasourcegroup" ||
        this.$route.name == "powerplantpoint"
      ) {
        if (titleName !== "序号") {
          if (num > 0 && num <= 2) {
            return 90;
          } else if (num >= 3) {
            return 150;
          } else {
            return "auto";
          }
        } else {
          return 60;
        }
      } else {
        if (num >= 3) {
          return 150;
        } else {
          return "auto";
        }
      }
      // }
      // else if (this.$route.name == "reportpage") {
      //   if (num > 0 && num <= 3) {
      //     return 220;
      //   } else if (num > 3) {
      //     return 260;
      //   }
      // } else if (this.$route.name == "indexpage") {
      //   if (titleName == "序号") {
      //     return 50;
      //   } else {
      //     return "auto";
      //   }
      // }
    },
    commandWidth(arr) {
      // console.log(arr, arr.length * 30);
      if (!arr) return "auto";
      return arr.length * 60;
    },
    // 清除勾选方法
    clearSelectionFn() {
      this.$refs.table.clearSelection();
    },
  },
};
</script>

<style lang="less" scoped>
/deep/.el-form {
  display: flex;
  flex-wrap: wrap;
  /deep/.el-select,
  /deep/.el-date-editor {
    width: 100% !important;
  }
  .el-form-item {
    width: 44%;
    margin: 0 3%;
  }
}
.table_box {
  width: 100%;
  height: 100%;
  position: relative;
  padding: 0 20px;
  .table_ {
    width: 100%;
    height: calc(100% - 50px);
    position: absolute;
    top: 0px;
    left: 0;
    border: 1px solid #c4c4c4;
    .table_1 {
      height: 100% !important;
      font-family: ".PingFang SC" !important;
      color: #333 !important;
      font-weight: normal !important;
      font-size: 14px !important;
    }
    .el-icon-more {
      cursor: pointer;
    }
    /deep/.el-table__virtual-wrapper {
      height: 100% !important;
    }
    /deep/.cell {
      width: 100% !important;
    }
    /deep/ .el-table th.gutter {
      display: table-cell !important;
    }
    /deep/.el-checkbox__label {
      display: none;
    }
    /deep/.el-table__empty-block {
      width: 100% !important;
      overflow: hidden !important;
      z-index: 12;
    }
    /deep/.el-table__header-wrapper {
      // position: absolute !important;
      // top: 0 !important;
      // left: 0 !important;
      height: 48px !important;
      background: #fafafa !important;
    }
    /deep/ .el-table__header {
      height: 100% !important;
      background: #fafafa !important;
    }
  }

  .table_Nopage {
    height: 100%;
  }
  .table_page {
    position: absolute;
    bottom: 0px;
    left: 0;
    width: 100%;
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    /deep/.el-pagination__total {
      font-family: "PingFang SC";
      font-style: normal;
      font-weight: normal;
      font-size: 12px;
      color: rgba(0, 0, 0, 0.65);
    }
    /deep/.el-pagination.is-background .el-pager li:not(.disabled).active {
      //background-color: @bg;
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
[class*=" el-icon-"],
[class^="el-icon-"] {
  font-family: element-icons !important;
  speak: none;
  font-style: normal;
  font-weight: 400;
  font-variant: normal;
  text-transform: none;
  line-height: 1;
  vertical-align: baseline;
  display: inline-block;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-size: 20px;
  color: #448ff7;
}
/deep/.el-table .warning-row {
  background: oldlace;
}

/deep/.el-table .success-row {
  background: #f0f9eb;
}
/deep/.el-table__fixed {
  // height: auto;
  // bottom: 17px !important; // 改为自动高度后，设置与父容器的底部距离，则高度会动态改变
  // overflow-x: hidden !important ;
}
/deep/.el-table__fixed-right {
}
// /deep/.el-form {
//   display: flex;
//   flex-wrap: wrap;
//   /deep/.el-select,
//   /deep/.el-date-editor {
//     width: 100% !important;
//   }
//   .el-form-item {
//     width: 44%;
//     margin: 0 3%;
//   }
// }
// .table_box {
//   width: 100%;
//   height: 100%;
//   position: relative;

//   .table_ {
//     width: 100%;
//     height: calc(100% - 50px);
//     // height: auto;
//     position: absolute;
//     top: 0px;
//     left: 0;
//     border: 1px solid #c4c4c4;
//     .table_1 {
//       height: 97% !important;
//       font-family: ".PingFang SC" !important;
//       color: #000000 !important;
//       font-weight: normal !important;
//       font-size: 14px !important;
//     }
//     .el-icon-more {
//       cursor: pointer;
//     }
//     /deep/.cell {
//       width: 100% !important;
//     }
//     /deep/ .el-table th.gutter {
//       display: table-cell !important;
//     }
//     /deep/.el-checkbox__label {
//       display: none;
//     }
//     /deep/.el-table__empty-block {
//       width: 100% !important;
//       overflow: hidden !important;
//       z-index: 12;
//     }
//     /deep/.el-table__header-wrapper {
//       // position: absolute !important;
//       // top: 0 !important;
//       // left: 0 !important;
//       // height: 48px !important;
//       //  background: #fafafa !important;
//     }
//     /deep/ .el-table__header {
//       height: 100% !important;
//       background: #fafafa !important;
//     }
//     /deep/.el-table__body-wrapper {
//       height: calc(100% - 81px) !important;
//       //  z-index: 2;
//       // position: absolute !important;
//       // top: 48px !important;
//       // bottom: 110px !important;
//     }
//     // /deep/ .el-table__fixed,
//     // .el-table__fixed-right {
//     //   height: calc(100% - 60px) !important;
//     //    // height: auto !important;
//     //   bottom: 0px !important;
//     // }
//     /deep/.el-table--scrollable-x .el-table__fixed,
//     /deep/.el-table--scrollable-x .el-table__fixed-right {
//       //overflow-x: auto;
//       //height: auto !important;
//       //   z-index: 8;
//     }
//   }

//   .table_Nopage {
//     height: 100%;
//   }
//   .table_page {
//     position: absolute;
//     bottom: 0px;
//     left: 0;
//     width: 100%;
//     height: 50px;
//     display: flex;
//     align-items: center;
//     justify-content: space-between;
//     /deep/.el-pagination__total {
//       font-family: "PingFang SC";
//       font-style: normal;
//       font-weight: normal;
//       font-size: 12px;
//       color: rgba(0, 0, 0, 0.65);
//     }
//     /deep/.el-pagination.is-background .el-pager li:not(.disabled).active {
//       //background-color: @bg;
//       color: #fff;
//     }
//     .table_page_left {
//       display: flex;
//       align-items: center;
//       font-family: PingFang SC;
//       font-style: normal;
//       font-weight: normal;
//       font-size: 12px;
//       color: rgba(0, 0, 0, 0.65);
//     }
//   }
// }
// [class*=" el-icon-"],
// [class^="el-icon-"] {
//   font-family: element-icons !important;
//   speak: none;
//   font-style: normal;
//   font-weight: 400;
//   font-variant: normal;
//   text-transform: none;
//   line-height: 1;
//   vertical-align: baseline;
//   display: inline-block;
//   -webkit-font-smoothing: antialiased;
//   -moz-osx-font-smoothing: grayscale;
//   font-size: 20px;
//   color: #448ff7;
// }
// // /deep/ .el-table .el-table__expand-icon .el-icon-arrow-right:before {
// //   content: "\e6d9";
// //   font-size: 12px;
// //   width: 16px;
// //   height: 14px;
// //   color: #000000;
// //   border: 1px solid #cccccc;
// //   padding: 2px;
// //   margin-right: -10px;
// //   position: relative;
// //   left: 20px;
// //   font-weight: 500;
// // }
// // /deep/ .el-table .el-table__expand-icon--expanded {
// //   transform: rotate(0);
// //   .el-icon-arrow-right:before {
// //     content: "\e6d8";
// //     font-size: 12px;
// //     width: 16px;
// //     height: 14px;
// //     color: #000000;
// //     border: 1px solid #cccccc;
// //     padding: 2px;
// //     margin-right: -10px;
// //     position: relative;
// //     left: 20px;
// //     font-weight: 500;
// //   }
// // }
// /deep/.el-table__expand-icon {
//   margin-right: -18px !important;
// }
// /deep/.el-table__indent {
//   padding-left: 5px !important;
// }
// /deep/.el-table__cell {
//   border-right: none;
//   border-bottom: 1px solid #c4c4c4 !important;
//   text-align: left !important;
// }
// /deep/.el-table .disabledCheck .cell .el-checkbox__inner {
//   display: none !important;
// }
// /deep/.el-table__fixed {
//   height: auto !important;
//   bottom: 17px !important; // 改为自动高度后，设置与父容器的底部距离，则高度会动态改变
//   overflow-x: hidden !important ;
// }
/deep/.el-table__cell {
  border-right: none;
  border-bottom: 1px solid #c4c4c4 !important;
  text-align: left !important;
}
.btnS {
  color:red
}
.btnY {
  color: #4359FF;
}
</style>
