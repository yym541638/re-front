<template>
  <div class="model">
    <el-dialog
      :visible.sync="dehoff.model"
      width="24%"
      :title="dehoff.title"
      :close-on-click-modal="false"
      :destroy-on-close="true"
      top="25vh"
      @close="close"
    >
      <div class="timeline-container" v-if="dehoff.title == '详情'">
        <el-timeline v-for="(item, index) in dehoff.timelineArr" :key="index">
          <el-timeline-item :timestamp="item.updateTime" placement="top">
            <div class="timestamp">更新时间：</div>
            <el-card class="card-content">
              <div class="timeline_text">
                叶片剩余寿命：
                <span class="timeline_value">{{ item.remain }}%</span>
              </div>
              <div class="timeline_text">
                叶片更换时间：
                <span class="timeline_time"> {{ item.replaceTime }}</span>
              </div>
            </el-card>
          </el-timeline-item>
        </el-timeline>
      </div>
      <div class="dialog_content_q" v-else>
        <div class="top">
          <img src="./img/mark.png" alt="" />
          <div class="title">{{ dehoff.contents }}</div>
        </div>
        <div class="block" v-if="dehoff.time">
          <span class="demonstration">叶片更换时间为</span>
          <el-date-picker
            v-model="value1"
            value-format="yyyy-MM-dd HH:mm:ss"
            format="yyyy-MM-dd HH:mm:ss"
            :disabled="dehoff.replaceTime !== undefined"
            type="datetime"
            placeholder="选择日期时间"
          >
          </el-date-picker>
        </div>
      </div>
      <div
        slot="footer"
        class="dialog-footer"
        v-if="dehoff.replaceTime == undefined && dehoff.title !== '详情'"
      >
        <el-button
          @click="close()"
          plain
          size="mini"
          style="color: #666666; border: 1px solid #cccccc"
          >取消</el-button
        >
        <el-button
          type="primary"
          size="mini"
          style="background: #536dfe; border-color: #536dfe"
          @click="affirm"
          >确认</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      value1: "",
    };
  },
  props: {
    dehoff: {
      type: Object,
      default: () => {
        return {
          model: false, //状态
          title: "", //标题
          contents: "", //内容
          time: true,
          replaceTime: "",
          timelineArr: [],
        };
      },
    },
  },
  created() {
    console.log("replaceTime", this.dehoff.replaceTime);
    if (this.dehoff.replaceTime !== undefined) {
      this.value1 = this.dehoff.replaceTime;
    }
  },
  methods: {
    close() {
      this.dehoff.model = false;
      //   this.$emit("dehclose");
    },
    //确认
    affirm() {
      this.$emit("affirm", this.value1);
    },
  },
};
</script>
<style scoped lang="less">
.timeline-container {
  height: 351px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 27px 43px;
  overflow: auto;
  /deep/.el-timeline {
    width: 100%;
    height: 100%;
  }
}
.dialog_content_q {
  height: 151px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 27px 43px;
  .top {
    width: 100%;
    display: flex;
    align-items: center;
    margin-bottom: 21px;
    img {
      margin-right: 12px;
      width: 22px;
      height: 22px;
    }
    .title {
      font-family: PingFang SC;
      font-size: 16px;
      font-weight: 400;
      line-height: 24px;
      color: #212121;
    }
  }
  .block {
    width: 100%;
    text-align: left;
    color: #606266;
    font-family: "Microsoft YaHei";
    font-size: 12px;
    font-style: normal;
    font-weight: 400;
    /deep/.el-input--prefix .el-input__inner {
      height: 26px;
    }
    /deep/.el-input__icon {
      line-height: 26px;
    }
    .demonstration {
      margin-right: 12px;
    }
  }
  .bottom {
    font-family: PingFang SC;
    font-size: 14px;
    font-weight: 400;
    line-height: 24px;
    color: #666666;
  }
}
/deep/.dialog-footer {
  display: flex;
  justify-content: flex-end;
}
/deep/.el-dialog__header {
  display: flex;
  align-items: center;
  border-bottom: 1px solid #e9e9e9;
}
/deep/.el-dialog__title {
  font-family: PingFang SC;
  font-size: 16px;
  font-weight: 400;
  color: #000000;
}
/deep/.el-dialog__footer {
  background: #f7f8fa;
  padding: 12px 24px 12px 0;
}
/deep/.el-dialog__body {
  padding: 0 !important;
}
/deep/.el-dialog {
  height: auto !important;
}

::v-deep .el-timeline-item:nth-of-type(1) .el-timeline-item__node {
  background-color: #fff !important;
  border: 2px solid #0775db !important;
}
</style>
<style>
.el-dialog__headerbtn:hover .el-dialog__close {
  color: #536dfe !important;
}
</style>
<style>
.card-content {
  width: 100%;
  margin-left: 0 !important;
}
.el-card.is-always-shadow {
  box-shadow: unset !important;
}
.timeline-container {
  width: 100%;
}

.el-timeline-item__timestamp {
  font-size: 14px;
  color: #333333;
  margin-right: 16px;
  float: right;
  font-family: "Microsoft YaHei";
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  margin-right: 0 !important;
}

.timestamp {
  font-family: "Microsoft YaHei";
  display: inline-block;
  vertical-align: top;
  margin-top: 1px;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  color: #606266;
}

.card-content {
  display: inline-block;
  width: 100%; /* Adjust based on your needs */
  vertical-align: top;
  margin-left: 16px;
}

.el-card__body {
  padding: 10px 16px !important;
}
.card-content span {
  font-weight: 400;
}
.timeline_text {
  color: #606266;
  font-family: "Microsoft YaHei";
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
}
.timeline_value {
  color: #333333;
  font-family: "Microsoft YaHei";
  font-size: 20px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
}
.timeline_time {
  color: #333333;
  font-family: "Microsoft YaHei";
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
}
.el-timeline .el-timeline-item:last-child .el-timeline-item__tail {
  display: block !important;
}
</style>
