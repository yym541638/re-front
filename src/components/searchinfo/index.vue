<template>
  <div class="search_info_list">
    <div class="search_info_list_title">筛选:</div>
    <div class="search_info_content">
      <template v-for="(key, index) in sendSearchTitles">
        <template>
          <div
            class="search_info_item"
            v-if="searchList[key.fieldName] || searchList[key.fieldName] == '0'"
            :key="index"
          >
            <el-tag closable type="info" effect="plain" @close="close(key)">
              {{ key.titleName }}
              <!-- ：<span
                v-html="filterValue(searchList[key.fieldName], key)"
              ></span> -->
            </el-tag>
          </div>
        </template>
      </template>
    </div>
    <div class="none" @click="empty()">
      <img src="./img/break.png" alt="" />
      <div class="none_title">重置</div>
    </div>
    <!-- <el-button @click="empty()" type="text">清空</el-button> -->
  </div>
</template>

<script>
export default {
  props: {
    sendSearchTitles: {
      type: Array,
      default: [],
    },
    searchList: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  data() {
    return {};
  },
  methods: {
    close(item) {
      this.$emit("colse", item.fieldName);
    },
    empty() {
      this.$emit("empty");
    },
    // 过滤值
    filterValue(value, item) {
      if (item.fontendType == "select") {
        this.getEnumerateVoListByPo(item.enumTypeId);
        return this.EnumListFilter[item.enumTypeId][value];
      } else if (item.fontendType == "selectmultiple") {
        this.getEnumerateVoListByPo(item.enumTypeId);
        let arr = [];
        value.map((v) => {
          arr.push(this.EnumListFilter[item.enumTypeId][v]);
        });
        return arr.join(",");
      } else {
        return value;
      }
    },
  },
};
</script>

<style lang="less" scoped>
.search_info_list {
  width: 100%;
  height: auto;
  display: flex;
  align-items: center;
  //  padding: 12px 0;
  // padding: 0 0 10px;
  padding: 16px 0;
  // justify-content: space-between;
  justify-content: flex-start;
  .search_info_list_title {
    font-family: "PingFang SC";
    font-style: normal;
    font-weight: normal;
    font-size: 14px;
    text-transform: capitalize;
    color: #212121;
    font-weight: 400;
    margin-right: 10px;
  }
  .search_info_content {
    height: auto;
    // flex: 1;
    margin-right: 24px;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    position: relative;
    .search_info_item {
      margin: 5px 4px 5px;
      height: 29px;
      // display: flex;
      // align-items: center;
    }
  }
  .none {
    display: flex;
    align-items: center;
    cursor: pointer;
    margin-top: 7px;
    .none_title {
      font-family: PingFang SC;
      font-size: 14px;
      font-weight: 400;
      line-height: 22px;
      color: #536dfe;
      margin-left: 6px;
    }
  }
}
/deep/.el-tag--info {
  color: #388af8;
}
/deep/.el-tag {
  background: #eff1ff !important;
  color: #536dfe !important;
  // border-color: #e0e5ff !important;
  font-family: PingFang SC;
  font-size: 12px;
  font-weight: 400;
  border: 1px solid #e0e5ff !important;
}
/deep/.el-tag__close {
  color: #536dfe !important;
}
/deep/.el-tag__close {
  background: none !important;
}
/deep/.el-tag__close:hover {
  color: #fff;
  background-color: none !important ;
}
</style>
