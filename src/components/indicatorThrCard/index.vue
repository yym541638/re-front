<template>
  <div class="indicator_card">
    <!-- 指标卡标题 -->
    <div
      class="indicator_card_title"
      v-if="cardDataTitle && cardDataTitle != ''"
    >
      {{ cardDataTitle }}
    </div>
    <!-- 指标卡列表 -->
    <div class="indicator_card_list" id="wrap" ref="wrap">
      <div id="content" class="content" ref="content">
        <!-- 指标卡 -->
        <div class="content_list" v-if="cardData && cardData.length > 0">
          <!-- 卡片* -->
          <div
            :style="cardData.length < 3 ? 'width:48%' : ''"
            class="content_card"
            v-for="(item, index) in cardData"
            :key="index"
          >
            <div class="content_card_left">
              <div :title="item.name" class="content_card_title">
                <!-- v-if="!titletooltip[item.name]" -->
                <span
                  v-if="Object.keys(titletooltip).indexOf(item.name) == -1"
                  >{{ item.name }}</span
                >
                <el-tooltip
                  class="item"
                  effect="dark"
                  v-if="Object.keys(titletooltip).indexOf(item.name) != -1"
                  :content="
                    Object.keys(titletooltip).indexOf(item.name) != -1
                      ? titletooltip[item.name]
                      : ''
                  "
                  placement="top-start"
                >
                  <span
                    style="cursor: pointer"
                    v-if="Object.keys(titletooltip).indexOf(item.name) != -1"
                    >{{ item.name }}</span
                  >
                </el-tooltip>
              </div>
              <div
                :style="item.color ? 'color:' + item.color : ''"
                v-if="item.value"
                class="content_card_number"
              >
                {{ item.value }}
              </div>
              <div
                :style="item.color ? 'color:' + item.color : ''"
                v-if="item.percent"
                class="content_card_number"
              >
                {{ item.color }}
                {{ item.percent + item.unit }}
              </div>
              <div
                v-if="!item.value && !item.percent"
                class="content_card_number"
              >
                --
              </div>
            </div>
            <div class="content_card_right">
              <div v-if="item.unit && !item.percent" class="content_card_unit">
                {{ item.unit }}
              </div>
              <div v-if="item.percent" class="content_card_progress">
                <el-progress
                  class="progress"
                  :stroke-width="20"
                  color="#F2994A"
                  type="circle"
                  :percentage="Number(item.percent)"
                ></el-progress>
              </div>
            </div>
          </div>
        </div>
        <!-- 图标展示卡  -->
        <div
          class="content_pie_echarts"
          v-show="options && JSON.stringify(options) != '{}'"
        >
          <div class="pie_echarts_title" v-if="seriesDataTitle != ''">
            {{ seriesDataTitle }}
          </div>
          <div class="pie_echarts">
            <slot name="echart"></slot>
          </div>
        </div>
        <!-- 表格信息展示 -->
        <div
          class="content_table"
          v-if="
            columns && columns.length > 0 && tableData && tableData.length > 0
          "
        >
          <div class="table_title" v-if="tableTitleS != ''">
            {{ tableTitleS }}
          </div>
          <!--  :headerstyle="{
              background: '#F8F9FA',
              color: '#4d4d4d',
              fontWeight: 'bold',
            }" -->
          <Table
            :tabeltooltip="tabeltooltip"
            :tableHeader="columns"
            :tableList="tableData"
            :headerstyle="{
              background: '#FAFAFA',
              color: '#212121',
              fontFamily: 'PingFang SC',
              fontWeight: 400,
            }"
            fixedHeight=""
            :single="true"
            :loading="false"
          />
        </div>
      </div>
      <!--右侧滚动条部分-->
      <!-- <div id="sliderWrap" ref="sliderWrap">
        <div id="slider" ref="slider"></div>
      </div> -->
    </div>
  </div>
</template>
<script>
export default {
  // props: ["cardData"],
  props: {
    columns: Array,
    tableData: {
      type: Array,
      default: () => {
        return [];
      },
    },
    seriesDataTitle: {
      type: String,
      default: "",
    },
    options: Object,
    cardDataTitle: String,
    cardData: Array,
    titletooltip: {
      type: Object,
      default: {},
    },
    tabeltooltip: {
      type: Object,
      default: () => {
        return {};
      },
    },
    tableTitleS: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      chart: null,
      wrapDiv: null,
      contentDiv: null,
      sliderWrap: null,
      slider: null,
    };
  },
  created() {
    // this.onScroll();
    // if (this.$refs.cardechart) {
    //   this.chart = this.$pie_echarts.init(this.$refs.cardechart);
    //   console.log(this.options);
    //   if (this.options) {
    //     this.chart.setOption(this.options);
    //   }
    // }
  },
  methods: {
    /**
     * 更新echart视图
     */

    /**
     * 当窗口缩放时，echart动态调整自身大小
     */
    handleWindowResize() {
      if (!this.chart) return;
      this.chart.resize();
    },
    /**鼠标移入事件 */
    mouseovers(params) {
      // console.log("饼图点击事件", params, this.extraOption);
      // var dataLen = this.extraOption.series[0].data.length;
      // 高亮当前图形
      this.chart.dispatchAction({
        type: "highlight",
        seriesIndex: 0,
        dataIndex: 0,
      });
    },
    onScroll() {
      //设置比例
      //clientHeight - 不包括border
      var scale = this.wrapDiv.clientHeight / this.contentDiv.clientHeight;
      //设置滑块的高度
      var h1 = this.sliderWrap.clientHeight * scale;
      //为了合理设置高度，设置滑块的最小高度
      if (h1 < 50) {
        h1 = 50;
      } else if (scale >= 1) {
        //说明当前内容能过完全显示在可视区域内，不需要滚动条
        this.sliderWrap.style.display = "none";
      }
      //设置滑块的高度
      this.slider.style.height = h1 + "px";
      //设置y轴的增量
      var y = 0;
      //为wrap添加滚轮事件
      this.wrapDiv.onmousewheel = function (e) {
        var event1 = event || e;
        if (event.wheelDelta < 0) {
          //滑动条向下滚动
          y += 10;
        } else if (event.wheelDelta > 0) {
          //滑动条向上滚动
          y -= 10;
        }
        //y变化时说明在滚动，此时使滚动条发生滚动，以及设置content内容部分滚动
        //判断极端情况，滑块不能划出屏幕
        if (y <= 0) {
          //滑块最多滑到顶部
          y = 0;
        }
        if (y >= this.sliderWrap.clientHeight - this.slider.clientHeight) {
          //滑块最多滑到最底部
          y = this.sliderWrap.clientHeight - this.slider.clientHeight;
        }
        //更新滑块的位置
        this.slider.style.top = y + "px";
        scale = this.wrapDiv.clientHeight / this.contentDiv.clientHeight;
        this.contentDiv.style.top = -y / scale + "px";
      };
    },
  },

  mounted() {
    // var wrapDiv = document.getElementById("wrap"); //主体
    this.wrapDiv = this.$refs.wrap;
    // var contentDiv = document.getElementById("content"); //内容区
    this.contentDiv = this.$refs.content;
    // var sliderWrap = document.getElementById("sliderWrap"); //滚动主体
    this.sliderWrap = this.$refs.sliderWrap;
    // var slider = document.getElementById("slider"); //滚动条
    this.slider = this.$refs.slider;
    // this.$utils.onScroll(); //出发滚动条事件
    if (this.wrapDiv && this.contentDiv && this.sliderWrap && this.slider) {
      // this.onScroll();
    }
  },
};
</script>
<style lang="less" scoped>
// 指标卡
.indicator_card {
  width: 100%;
  height: 100%;
  background: #fff;
  border-radius: 8px;
  // padding: 0 20px;
  .indicator_card_title {
    height: 50px;
    font-family: PingFang SC;
    font-style: normal;
    font-weight: 600;
    font-size: 14px;
    color: rgba(0, 0, 0, 0.75);
    padding: 16px 20px 0;
  }
  .indicator_card_list {
    height: calc(100% - 50px);
    width: 100%;
    // overflow: auto;
    .content {
      width: 100%;
      padding: 0 20px;
      height: 100%;
      display: flex;
      flex-direction: column;
      // 卡片列表
      .content_list {
        width: 100%;
        max-height: 80px;
        height: auto;
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;
        .content_card {
          width: 32.57%;
          height: 68px;
          // background: #f2f2f2;
          background: #f4f7fc;
          border-radius: 4px;
          margin-bottom: 10px;
          justify-content: space-between;
          // margin: 0 10px 10px;
          display: flex;
          .content_card_left {
            // width: 65.9%;
            height: 100%;
            padding: 5px 13px 0;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            box-sizing: border-box;
            .content_card_title {
              font-size: 14px;
              font-weight: 400;
              font-family: PingFang SC;
              font-style: normal;
              font-weight: normal;
              // font-size: 12px;
              line-height: 17px;
              color: rgba(0, 0, 0, 0.75);
              height: 17px;
              white-space: nowrap;
              margin-bottom: 5px;
              max-width: 100%;
              overflow: hidden;
              text-overflow: ellipsis;
              cursor: pointer;
            }
            .content_card_number {
              // font-size: 24px;
              // font-weight: 700;
              // font-family: PingFang SC;
              // font-style: normal;
              // font-weight: normal;
              // font-size: 18px;
              // line-height: 34px;
              // color: #212121;
              // height: 34px;
              // display: flex;
              // flex-wrap: wrap;
              // width: 100%;
              // white-space: nowrap;
              // overflow: hidden;
              // text-overflow: ellipsis;
              font-family: PingFang SC;
              font-style: normal;
              font-weight: normal;
              font-size: 24px;
              line-height: 34px;
              color: #000000;
              height: 34px;
              display: flex;
              flex-wrap: wrap;
              width: 100%;
            
            }
            @media (max-width: 1366px) {
              .content_card_title {
                margin-bottom: 10px;
              }
              .content_card_number {
                font-size: 14px;
              }
            }
            @media (max-width: 1176px) {
              .content_card_title {
                margin-bottom: 10px;
              }
              .content_card_number {
                font-size: 14px;
              }
            }
          }
          .content_card_right {
            width: 38.1%;
            height: 100%;
            box-sizing: border-box;
            .content_card_unit {
              width: 100%;
              height: 100%;
              display: flex;
              align-items: flex-end;
              padding-bottom: 11px;
              font-family: PingFang SC;
              font-style: normal;
              font-weight: normal;
              font-size: 10px;
              line-height: 14px;
              color: #000000;
            }
            .content_card_progress {
              width: 100%;
              height: 100%;
              display: flex;
              align-items: center;
              justify-content: flex-end;
              padding-right: 20px;
              .progress {
                width: 30px;
                height: 30px;
              }
              /deep/ .el-progress-circle {
                width: 30px !important;
                height: 30px !important;
              }
              /deep/ .el-progress__text {
                opacity: 0;
              }
              @media (max-width: 1176px) {
                .progress {
                  width: 30px;
                  height: 30px;
                }
                /deep/ .el-progress-circle {
                  width: 30px !important;
                  height: 30px !important;
                }
              }
            }
          }
        }
      }

      // @media (max-width: 1366px) {
      //   .content_pie_echarts {
      //     height: 260px;
      //   }
      //   .pie_echarts {
      //     width: 100%;
      //     height: calc(100% - 20px);
      //   }
      // }
      // @media (max-width: 1176px) {
      //   .content_pie_echarts {
      //     height: 200px;
      //   }
      //   .pie_echarts {
      //     width: 100%;
      //     height: calc(100% - 20px);
      //   }
      // }
      .content_table {
        width: 100%;
        // min-height: 400px;
        height: auto;
        flex: 1;
        overflow: hidden;
        padding-bottom: 50px;
        // margin-bottom: 20px;
        .table_title {
          font-family: PingFang SC;
          font-style: normal;
          font-weight: 600;
          font-size: 14px;
          color: rgba(0, 0, 0, 0.75);
          margin-bottom: 13px;
        }
        // /deep/.table {
        //   border: 1px solid red;
        //   flex: 1;
        //   width: 100%;
        // }

        /deep/ .el-table th.gutter {
          display: table-cell !important;
          height: 60px;
        }
        /deep/ .el-table__row {
          height: 40px !important;
        }
      }
      // @media (max-height: 1024px) {
      //   .content_table {
      //     width: 100%;
      //     min-height: 300px;
      //   }
      // }
      // @media (max-height: 800px) {
      //   .content_table {
      //     width: 100%;
      //     min-height: 200px;
      //   }
      // }
    }
    #sliderWrap {
      height: 100%;
      width: 16px;
      background-color: #efefef;
      border-radius: 3px;
      position: absolute;
      right: 0px;
      top: 0;
    }
    #slider {
      width: 10px;
      height: 50px;
      background-color: #bdbdbd;
      position: absolute;
      left: 3px;
      top: 0px;
      border-radius: 10px;
    }
  }
  //图标
  .content_pie_echarts {
    width: 100%;
    min-height: 300px;
    position: relative;
    .pie_echarts_title {
      position: absolute;
      // left: 20px;
      font-family: PingFang SC;
      font-style: normal;
      font-weight: 600;
      font-size: 14px;
      line-height: 20px;
      height: 20px;
      color: rgba(0, 0, 0, 0.75);
    }
    .pie_echarts {
      padding-top: 20px;
      width: 100%;
      height: 300px;
      position: relative;
    }
  }
}
</style>





































 





