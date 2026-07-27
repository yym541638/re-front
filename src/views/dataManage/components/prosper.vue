<template>
  <div class="model">
    <el-dialog
      :visible.sync="succmodel.dialog"
      width="26%"
      :close-on-click-modal="false"
    >
      <div class="analyse">
        <div><img src="./img/succ.png" alt="" /></div>
        <!-- <div class="msg">导入成功</div> -->
        <div class="msg">{{ succmodel.title }}</div>
        <div class="succ_msg" v-if="succmodel.title == '检查成功'">
          成功<span class="succ">{{ resultData.success }}</span
          >条数据,失败<span class="err">{{ resultData.fail }}</span
          >条数据,可点击下载查看详细信息
        </div>
        <div class="succ_msg" v-else>
          时序数据库共有<span class="all">100</span
          >个数据点,经与数据源库对比,匹配
          <div style="display: flex; justify-content: center">
            到<span class="succ">95</span>个,未匹配<span class="err">5</span>个
          </div>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button
          type="primary"
          size="mini"
          style="background: #536dfe; border-color: #536dfe"
          @click="downView"
          >下载查看</el-button
        >
        <el-button
          plain
          size="mini"
          style="color: #666666; border: 1px solid #cccccc"
          @click="close"
          >关闭</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      resultData: {},
    };
  },
  created() {
    if (this.succmodel.obj !== undefined) {
      this.resultData = this.succmodel.obj;
    }
  },
  props: {
    succmodel: {
      type: Object,
      default: () => {
        return {
          dialog: false,
          title: "",
        };
      },
    },
  },
  methods: {
    //下载查看
    downView() {
      this.$emit("downView");
    },
    //关闭
    close() {
      this.succmodel.dialog = false;
    },
  },
};
</script>
<style scoped lang="less">
.analyse {
  width: 100%;
  height: 270px;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  padding: 48px 24px 0 24px;
  //   justify-content: center;
  align-items: center;
  .msg {
    font-family: PingFang SC;
    font-size: 24px;
    font-weight: 400;
    line-height: 32px;
    color: #1e2226;
    margin-top: 32px;
  }
  .succ_msg {
    color: #666666;
    font-family: "PingFang SC";
    font-size: 16px;
    font-style: normal;
    font-weight: 400;
    line-height: 24px;
    margin-top: 8px;
    .all {
      color: #536dfe;
      font-family: "PingFang SC";
      font-size: 16px;
      font-style: normal;
      font-weight: 500;
      line-height: 24px;
    }
    .succ {
      color: #48bf5c;
      font-family: "PingFang SC";
      font-size: 16px;
      font-style: normal;
      font-weight: 500;
      line-height: 24px;
    }
    .err {
      color: #ff1616;
      font-family: "PingFang SC";
      font-size: 16px;
      font-style: normal;
      font-weight: 500;
      line-height: 24px;
    }
  }
}
/deep/.el-dialog__header {
  display: none;
}
/deep/.el-dialog__body {
  padding: 0 !important;
}
/deep/.el-dialog__footer {
  display: flex;
  justify-content: center;
}
</style>
