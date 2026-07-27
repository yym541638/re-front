<template>
  <div class="alarm-record-card">
    <div class="table-box">
      <div class="table-title">
        <div class="title-left">
          <span class="unit-text">所属机组</span>
          <el-input
            style="width: 20%"
            v-model="searchList.unit"
            placeholder="请输入内容"
            disabled
          ></el-input>
          <span class="unit-text">位置</span>
          <el-select
            style="width: 20%"
            v-model="searchList.site"
            placeholder="请选择"
          >
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.value"
              :value="item.value"
            >
            </el-option>
          </el-select>
          <span class="unit-text">编号</span>
          <el-input
            style="width: 20%"
            v-model="searchList.numNo"
            placeholder="请输入内容"
          ></el-input>
        </div>
        <div class="title-right">
          <el-button type="primary-add" @click="VoPageListByDto(1)"
            >查询</el-button
          >
          <el-button type="primary-reset" @click="reset()">重置</el-button>
          <el-button @click="navigateToConditionMonitoring" type="black-white"
            >返回</el-button
          >
        </div>
      </div>
      <div class="table-content">
        <Vxetable
          ref="invoiceVxeTable"
          @currentChange="VoPageListByDto"
          @sizeChange="sizeChange"
          :tablePage="tablePage"
          :table-titles="tableTitles"
          :table-data="tableData"
          :selection="false"
        >
          <template slot="remain" slot-scope="{ row }">
            <div class="remainprogress">
              <!-- 自定义显示的文本内容 -->
              <span :style="{ color: customProgressColor(row.remain) }">
                {{ row.remain }}%
              </span>
              <el-progress
                :percentage="parseFloat(row.remain)"
                :color="customProgressColor(row.remain)"
                :show-text="false"
              >
              </el-progress>
            </div>
          </template>
          <div slot="btn_edit" slot-scope="{ row }">
            <el-button
              type="text"
              size="small"
              :disabled="row.replaceEventList.length == 0"
              @click="handleHealthReset(row)"
              :style="
                row.replaceEventList.length == 0
                  ? ' color: #606266; font-size: 14px'
                  : 'color: #0775db; font-size: 14px'
              "
              >详情</el-button
            >
          </div>
        </Vxetable>
      </div>
    </div>
    <Delete v-if="dehoff.model" :dehoff="dehoff"></Delete>
  </div>
</template>
<script>
export default {
  components: {},
  data() {
    return {
      tablePage: {
        pageIndex: 1,
        pageSize: 20,
        total: 0,
      },
      searchList: {
        unit: "3号机",
        site: "",
        numNo: "",
      },
      dehoff: {
        model: false,
        title: "",
        contents: "",
        time: true,
      },
      options: [{ value: "调阀端" }, { value: "电机端" }],
      lifeId: "",
      tableTitles: [
        { fieldName: "unit", titleName: "所属机组" },
        { fieldName: "device", titleName: "设备" },
        { fieldName: "site", titleName: "位置" },
        { fieldName: "numNo", titleName: "编号", width: 160 },
        { fieldName: "remain", titleName: "剩余寿命", fontendType: "slot" },
        { fieldName: "replaceTime", titleName: "叶片更换时间" },
        { fieldName: "recoveryTime", titleName: "复位时间" },
      ],
      tableData: [],
      fd: new FormData(),
    };
  },
  created() {
    this.VoPageListByDto(1);
  },
  methods: {
    // 重置
    reset() {
      this.searchList = {
        unit: "3号机",
        site: "",
        numNo: "",
      };
      this.VoPageListByDto(1);
    },

    async VoPageListByDto(page) {
      this.tablePage.pageIndex = page;
      const res = await this.$api.getLifeDetails({
        pageSize: this.tablePage.pageSize,
        pageNum: this.tablePage.pageIndex,
        ...this.searchList,
      });
      if (res.code == 0) {
        this.tableData = res.data.list;
        this.tablePage.total = res.data.total ? res.data.total : 0;
      }
    },
    customProgressColor(percentage) {
      const value = parseFloat(percentage);
      if (value >= 80) return "#67C23A"; // success 绿
      else if (value >= 70) return "#0775DB"; // normal 蓝
      else if (value >= 60) return "#F6AD02"; // warning 黄
      else return "#E94848"; // exception 红
    },
    sizeChange(size) {
      this.tablePage.pageSize = size;
      this.VoPageListByDto(1);
    },

    // 返回到状态监测页面
    navigateToConditionMonitoring() {
      const currentTag = {
        name: "RcmManual",
        RouterName: "RcmManual",
      };
      this.$store.commit("REMOVE_TAG", currentTag);
      this.$router.push({ name: "RcmFinal" });
    },
    // 详情
    handleHealthReset(val) {
      this.dehoff = {
        model: true,
        title: "详情",
        time: false,
        timelineArr: val.replaceEventList,
      };
    },
  },
};
</script>
<style lang="less" scoped>
.alarm-record-card {
  height: 100%;
  width: 100%;
  padding: 15px;
  background-color: #f7f8fa;

  .table-box {
    width: 100%;
    height: 100%;
    padding: 20px;
    background: #ffffff;
    display: flex;
    flex-direction: column;

    .table-title {
      width: 100%;
      height: 32px;
      display: flex;
      justify-content: space-between;
      align-items: center;

      .title-left {
        display: flex;
        align-items: center;

        .unit-text {
          margin-right: 12px;
          color: #606266;
          font-family: "Microsoft YaHei";
          font-size: 12px;
          font-style: normal;
          font-weight: 400;
        }

        /deep/ .el-select,
        /deep/ .el-input {
          margin-right: 24px !important;
        }

        /deep/ .el-input__inner {
          height: 32px !important;
        }
      }

      .title-right {
        display: flex;
        justify-content: flex-end;
      }
    }

    .table-content {
      margin-top: 12px;
      height: calc(94% - 44px);
      width: 100%;
    }
  }
}

.remainprogress {
  display: flex;
  align-items: center;
  /deep/.el-progress-bar {
    padding-left: 10px;
  }
  /deep/.el-progress {
    width: 90%;
  }
}
</style>
