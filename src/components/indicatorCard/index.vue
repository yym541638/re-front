<template>
  <div class="indicator_card">
    <!-- 指标卡标题 -->
    <div class="indicator_card_title">{{ cardData.title }}</div>
    <!-- 指标卡列表 -->
    <div class="indicator_card_list" id="wrap">
      <div id="content" class="content">
        <div class="content_list">
          <!-- 卡片* -->
          <div
            class="content_card"
            v-for="(item, index) in cardData.data"
            :key="index"
          >
            <div class="content_card_left">
              <div :title="item.name" class="content_card_title">
                {{ item.name }}
              </div>
              <div
                v-if="item.value"
                :style="item.color ? 'color:' + item.color : ''"
                class="content_card_number"
              >
                {{ item.value }}
              </div>
              <div
                :style="item.color ? 'color:' + item.color : ''"
                v-if="item.percent"
                class="content_card_number"
              >
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
      </div>
      <!--右侧滚动条部分-->
      <!-- <div id="sliderWrap">
        <div id="slider"></div>
      </div> -->
    </div>
  </div>
</template>
<script>
export default {
  props: ["cardData"],
  data() {
    return {
      activetabsName: "1",
    };
  },
  mounted() {},
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
    position: relative;
    // overflow: hidden;
    overflow: auto;
    // border: 3px solid black;
    .content {
      width: 100%;
      position: absolute;
      padding: 0 20px;
      left: 0;
      top: 0;
      // border: 1px solid red;
      .content_list {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;
        .content_card {
          width: 48.67%;
          height: 67px;
          // background: #f2f2f2;
          background: #f4f7fc;
          border-radius: 4px;
          margin-bottom: 10px;
          display: flex;
          .content_card_left {
            width: 65.9%;
            height: 100%;
            padding: 5px 13px 0;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            box-sizing: border-box;
            .content_card_title {
              font-family: PingFang SC;
              font-size: 14px;
              font-weight: 400;
              font-style: normal;
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
            @media (max-width: 1176px) {
              .content_card_title {
                margin-bottom: 10px;
              }
              .content_card_number {
                font-size: 20px;
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
                width: 50px;
                height: 50px;
              }
              /deep/ .el-progress-circle {
                width: 50px !important;
                height: 50px !important;
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
}
</style>











/*自定义卡片数据格式 */
//  cardData: {
//         title: "标题",
//         data: [
//           {
//             title: "标题",
//             number: "0",
//             unit: "MWh",
//             progress: 0,
//             color: "#5cb87a",
//           },
//           {
//             title: "标题",
//             number: "0",
//             unit: "",
//             progress: 0,
//             color: "#5cb87a",
//           },
//           {
//             title: "标题",
//             number: "0",
//             unit: "MWh",
//             progress: 0,
//             color: "#5cb87a",
//           },
//           {
//             title: "标题",
//             number: "0",
//             unit: "",
//             progress: 0,
//             color: "#5cb87a",
//           },
//           {
//             title: "标题",
//             number: "0",
//             unit: "MWh",
//             progress: 0,
//             color: "#5cb87a",
//           },
//           {
//             title: "标题",
//             number: "0",
//             unit: "",
//             progress: 0,
//             color: "#5cb87a",
//           },
//           {
//             title: "标题",
//             number: "0",
//             unit: "MWh",
//             progress: 0,
//             color: "#5cb87a",
//           },
//           {
//             title: "标题",
//             number: "0",
//             unit: "",
//             progress: 0,
//             color: "#5cb87a",
//           },
//         ],
//       },