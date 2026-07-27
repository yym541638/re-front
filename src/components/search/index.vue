<template>
  <div class="search_box">
    <div class="router_list">
      <!-- <el-breadcrumb v-if="!back" separator="/">
        {{ $route.parentName }}
        <el-breadcrumb-item
          v-if="$route.meta.parentParentCnName"
          :to="{ name: $route.meta.parentParentName }"
          >{{ $route.meta.parentParentCnName }}</el-breadcrumb-item
        >
        <el-breadcrumb-item
          v-if="$route.meta.parentCnName"
          :to="{
            name: $route.meta.parentName,
            query: query,
            params: params,
          }"
          >{{ $route.meta.parentCnName }}</el-breadcrumb-item
        >
        <el-breadcrumb-item
          ><span v-if="$route.query.name">{{ $route.query.name }}-</span
          >{{ $route.meta.cnName }}</el-breadcrumb-item
        >
      </el-breadcrumb>
      <el-button
        v-else
        class="gao_btn"
        icon="el-icon-back"
        @click="backGo()"
        size="small"
        >返回
      </el-button> -->
    </div>
    <div class="search">
      <div class="btn_serach">
        <slot class="slot" name="left_btn"></slot>
        <!-- <img class="imgStyle" src="../../assets/search/selectTitle1.png" alt="" /> -->
        <el-button
          class="gao_btn"
          style="padding: 0px 10px"
          v-if="showSearch"
          @click="dialogSearch.outer = !dialogSearch.outer"
          size="small"
        >
          <!-- {{
            JSON.stringify(searchList) != "{}" &&
            Object.keys(searchList) &&
            Object.keys(searchList).length > 0
              ? "有" + Object.keys(searchList).length + "个筛选"
              : "更多筛选"
          }} -->
          {{ Searchtext.text }}
          <i
            v-if="Object.keys(searchList).length == 0"
            style="font-size: 16px; transform: rotate(90deg)"
            class="el-icon-s-operation el-icon--right"
          ></i>
        </el-button>
        <slot class="slot" name="right_btn"></slot>
      </div>
      <div
        class="height_search_list"
        :style="dialogSearch.outer ? 'display:block' : 'display:none'"
      >
        <div class="title">
          {{ Searchtext.textS }}
          <span
            @click="dialogSearch.outer = !dialogSearch.outer"
            class="el-icon-circle-close title_icon"
          ></span>
        </div>
        <div
          class="height_search_list_content"
          @click="dialogSearch.inner = false"
        >
          <template v-for="(key, index) in sendSearchTitles">
            <!-- slot型 -->
            <div
              class="search_item"
              v-if="key.fontendType == 'slot'"
              :key="index"
            >
              <label class="search_item_label" for>{{ key.titleName }}：</label>
              <slot :name="key.fieldName" :data="key"></slot>
              <!-- <el-input
                clearable
                :placeholder="'请输入' + key.titleName"
                v-model="searchList[key.fieldName]"
              ></el-input> -->
            </div>
            <!-- text型 -->
            <div
              class="search_item"
              v-if="key.fontendType == 'text'"
              :key="index"
            >
              <label class="search_item_label" for>{{ key.titleName }}：</label>
              <el-input
                clearable
                :placeholder="'请输入' + key.titleName"
                v-model="searchList[key.fieldName]"
              ></el-input>
            </div>
            <!-- number -->
            <div
              class="search_item"
              v-if="key.fontendType == 'number'"
              :key="index"
            >
              <label class="search_item_label" for>{{ key.titleName }}：</label>
              <el-input
                type="number"
                clearable
                :placeholder="'请输入' + key.titleName"
                v-model="searchList[key.fieldName]"
              ></el-input>
            </div>
            <!-- date 类型 -->
            <div
              class="search_item"
              :key="index"
              v-if="key.fontendType == 'date'"
            >
              <label class="search_item_label" for>{{ key.titleName }}：</label>
              <el-date-picker
                :disabled="key.disabled"
                style="width: 100%"
                clearable
                v-model="searchList[key.fieldName]"
                value-format="yyyy-MM-dd"
                align="right"
                type="date"
                placeholder="选择日期"
              >
              </el-date-picker>
            </div>
            <!-- date类型时分秒 -->
            <div
              class="search_item"
              :key="index"
              v-if="key.fontendType == 'dateDetails'"
            >
              <label class="search_item_label" for>{{ key.titleName }}：</label>
              <el-date-picker
                v-model="searchList[key.fieldName]"
                type="datetime"
                :clearable="true"
                :disabled="key.disabled"
                style="width: 100%"
                value-format="yyyy-MM-dd HH:mm:ss"
                align="right"
                placeholder="选择日期"
              >
              </el-date-picker>
            </div>
            <!-- select 类型 -->
            <div
              class="search_item"
              v-if="key.fontendType == 'select'"
              :key="index"
            >
              <label class="search_item_label" for>{{ key.titleName }}：</label>
              <el-select
                clearable
                v-model="searchList[key.fieldName]"
                :placeholder="'请选择' + key.titleName"
              >
                <el-option
                  v-for="(opt, opI) in EnumList[key.enumTypeId]"
                  :key="opI"
                  :label="opt.name"
                  :value="opt.enumValue"
                ></el-option>
              </el-select>
            </div>
            <div
              class="search_item"
              v-if="key.fontendType == 'selectOne'"
              :key="index"
            >
              <label class="search_item_label" for>{{ key.titleName }}：</label>
              <!-- @clear="reset" -->
              <el-select
                clearable
                v-model="searchList[key.fieldName]"
                :disabled="key.disabled"
                :placeholder="'请选择' + key.titleName"
                @click.native="getunitTypeList(key, index)"
              >
                <el-option
                  v-for="(opt, opI) in key.data"
                  :key="opI"
                  :label="opt.name"
                  :value="opt.enumValue"
                ></el-option>
              </el-select>
            </div>
            <div
              class="search_item"
              v-if="key.fontendType == 'selectTwo'"
              :key="index"
            >
              <label class="search_item_label" for>{{ key.titleName }}：</label>
              <!-- @clear="reset" -->
              <el-select
                clearable
                filterable
                v-model="searchList[key.fieldName]"
                :disabled="key.disabled"
                :placeholder="'请选择' + key.titleName"
                @click.native="getunitTypeList(key, index)"
              >
                <el-option
                  v-for="(opt, opI) in key.data"
                  :key="opI"
                  :label="opt.name"
                  :value="opt.enumValue"
                ></el-option>
              </el-select>
            </div>
            <!-- selectFTA 类型 -->
            <div
              class="search_item"
              v-if="key.fontendType == 'selectFTA'"
              :key="index"
            >
              <label class="search_item_label" for>{{ key.titleName }}：</label>
              <el-select
                clearable
                v-model="searchList[key.fieldName]"
                :placeholder="'请选择' + key.titleName"
                @visible-change="selectFTAChange(key)"
              >
                <el-option
                  v-for="opt in selectFTAData"
                  :key="opt.id"
                  :label="opt[key.relatedFieldName]"
                  :value="opt.id"
                ></el-option>
              </el-select>
            </div>
            <!-- selectFTAPack 类型 -->
            <div
              class="search_item"
              v-if="key.fontendType == 'selectFTAPack'"
              :key="index"
            >
              <label class="search_item_label" for>{{ key.titleName }}：</label>
              <el-select
                clearable
                v-model="searchList[key.fieldName]"
                :placeholder="'请选择' + key.titleName"
                @visible-change="selectFTAChangePack(key)"
              >
                <el-option
                  v-for="opt in selectFTAData"
                  :key="opt.id"
                  :label="opt['name']"
                  :value="opt.name"
                ></el-option>
              </el-select>
            </div>
            <!-- searchSelect类型 -->
            <div
              class="search_item"
              v-if="key.fontendType == 'searchSelect'"
              :key="index"
            >
              <label class="search_item_label" for>{{ key.titleName }}：</label>
              <el-select
                clearable
                filterable
                remote
                reserve-keyword
                v-model="searchList[key.fieldName]"
                :remote-method="
                  (query) => {
                    remoteSearchList(query, key, index);
                  }
                "
                :placeholder="'请选择' + key.titleName"
              >
                <!-- <el-option
                  v-for="opt in relatedModelList[0]
                    ? relatedModelList[0][key.relatedModelId]
                    : []"
                  :key="opt.id"
                  :label="opt[key.relatedFieldName]"
                  :value="opt.id"
                ></el-option> -->
                <el-option
                  v-for="(opt, opI) in key.data"
                  :key="opI"
                  :label="opt[key.selectLabel]"
                  :value="opt[key.selectValue]"
                ></el-option>
              </el-select>
            </div>
            <!-- selectDataFTA 类型 -->
            <div
              class="search_item"
              :key="index"
              v-if="key.fontendType == 'selectDataFTA'"
            >
              <label class="search_item_label" for>{{ key.titleName }}：</label>

              <el-select
                :disabled="key.disabled"
                style="width: 100%"
                clearable
                v-model="searchList[key.fieldName]"
                :placeholder="'请选择' + key.titleName"
                @visible-change="selectDataFTAChange(key, index)"
              >
                <el-option
                  v-for="(opt, opI) in selectFTAData"
                  :key="opI"
                  :label="opt[item.selectLabel]"
                  :value="opt[item.selectValue]"
                ></el-option>
              </el-select>
            </div>
            <!-- selectvalueFTA 类型 -->
            <div
              class="search_item"
              :key="index"
              v-if="key.fontendType == 'selectvalueFTA'"
            >
              <label class="search_item_label" for>{{ key.titleName }}：</label>

              <el-select
                :disabled="key.disabled"
                style="width: 100%"
                clearable
                v-model="searchList[key.fieldName]"
                :placeholder="'请选择' + key.titleName"
                @visible-change="selectvalueChange(key, index)"
              >
                <el-option
                  v-for="(opt, opI) in key.data"
                  :key="opI"
                  :label="opt[key.selectLabel]"
                  :value="opt[key.selectValue]"
                ></el-option>
              </el-select>
            </div>
            <!-- selectvalueMultipleFTA 类型 -->
            <div
              class="search_item"
              :key="index"
              v-if="key.fontendType == 'selectvalueMultipleFTA'"
            >
              <label class="search_item_label" for>{{ key.titleName }}：</label>
              <el-select
                multiple
                :disabled="key.disabled"
                style="width: 100%"
                clearable
                v-model="searchList[key.fieldName]"
                :placeholder="'请选择' + key.titleName"
                @visible-change="selectvalueChange(key, index)"
              >
                <el-option
                  v-for="(opt, opI) in key.data"
                  :key="opI"
                  :label="opt[key.selectLabel]"
                  :value="opt[key.selectValue]"
                ></el-option>
              </el-select>
            </div>
            <!-- cascaderData 类型 -->
            <div
              class="search_item"
              :key="index"
              v-if="key.fontendType == 'cascaderData'"
            >
              <label class="search_item_label" for>{{ key.titleName }}：</label>
              <el-cascader
                clearable
                :disabled="key.disabled"
                style="width: 100%"
                :show-all-levels="false"
                v-model="searchList[key.fieldName]"
                :options="cascaderOptions"
                :props="{
                  //联级选择
                  value: key.selectLabel,
                  label: key.selectLabel,
                  children: key.selectValue,
                }"
                :placeholder="'请选择' + key.titleName"
                @visible-change="cascaderFTAChange(key, index)"
              >
              </el-cascader>
            </div>
            <!-- switch类型 -->
            <div
              class="search_item"
              v-if="key.fontendType == 'switch'"
              :key="index"
            >
              <label class="search_item_label" for>{{ key.titleName }}：</label>
              <el-switch
                v-model="searchList[key.fieldName]"
                active-color="#409eff"
                inactive-color="#f2f2f2"
              >
              </el-switch>
            </div>
            <!-- radio 类型 -->
            <div
              class="search_item"
              v-if="key.fontendType == 'radio'"
              :key="index"
            >
              <label class="search_item_label" for>{{ key.titleName }}：</label>
              <el-radio
                v-model="searchList[key.fieldName]"
                :label="key.titleName"
              ></el-radio>
            </div>
          </template>
        </div>
        <div class="height_submit">
          <el-button
            icon="el-icon-circle-plus"
            slot="reference"
            @click="searchAdd()"
            type="text"
            v-if="isShowInnerSearch"
            >添加可搜索项</el-button
          >
          <div>
            <el-button size="mini" @click="reset(true)">重置</el-button>
            <el-button type="primary" size="mini" @click="search()"
              >确定</el-button
            >
          </div>
          <div
            class="add_search_item"
            :style="dialogSearch.inner ? 'display:block' : 'display:none'"
          >
            <div class="title">
              选择需要搜索的字段
              <span
                @click="dialogSearch.inner = !dialogSearch.inner"
                class="el-icon-circle-close title_icon"
              />
            </div>
            <div class="group_box">
              <el-checkbox-group class="checbox_list" v-model="addSearch">
                <el-checkbox
                  class="checkout_item"
                  v-for="(key, keyIn) in searchTitles"
                  :value="key.fieldName"
                  :label="key.id"
                  :key="keyIn"
                  >{{ key.titleName }}</el-checkbox
                >
              </el-checkbox-group>
            </div>
            <div class="height_submit">
              <div></div>
              <el-button type="primary" size="mini" @click="searchAddSubmit"
                >确定</el-button
              >
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- <div class="btns_list">
          <el-button type="primary" size="small" @click="search()">搜索</el-button>
          <el-button type="primary" size="small" @click="reset()">重置</el-button>
          <slot class="slot" name="btn"></slot>
      </div> -->
    <!-- <el-dialog
  title="提示"
  :visible.sync="dialogVisible"
  width="30%"
  >
   <el-transfer v-model="searchKey" :data="searchTitles">
      <span slot-scope="{ option }">{{ option.name }} - {{ option.name }}</span>
   </el-transfer>
  <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
  </span>
</el-dialog> -->
  </div>
</template>

<script>
export default {
  props: {
    back: {
      type: Boolean,
      default: () => {
        return false;
      },
    },
    showSearch: {
      type: Boolean,
      default: () => {
        return true;
      },
    },
    searchTitles: {
      // 初始的几个搜索筛选字段
      type: Array,
      default: [],
    },
    sendSearchTitles: {
      type: Array,
      default: [],
    },
    Searchtext: {
      type: Object,
      default: () => {
        return {
          text: "更多筛选",
          textS: " 高级搜索",
        };
      },
    },
    searchList: {
      type: Object,
      default: () => {
        return {};
      },
    },
    query: {
      type: Object,
      default: () => {
        return {};
      },
    },
    params: {
      type: Object,
      default: () => {
        return {};
      },
    },
    isShowInnerSearch: {
      type: Boolean,
      default: true,
    },
    // 确定之前校验是否需要关闭窗口
    checkBeforeClosing: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      dialogSearch: {
        outer: false,
        inner: false,
      },
      addSearch: [],
      dialogVisible: false,
      searchKey: [],
      // select
      searchSelectItem: {},
      obj: {},
      relatedModelList: [],
      selectFTAData: [],
      selectValueFTAData: [],
    };
  },
  /**
   *sendTitles 高级筛选选中的key值事件
   *search  高级搜索事件
   *reset   重置事件
   */
  methods: {
    backGo() {
      this.$router.go(-1);
    },
    // 枚举值信息列表
    async getEnumerateVoListByPo(typeId) {
      let res = await this.$api.getEnumerateVoListByPo({
        typeId: typeId, //用户状态枚举类型
      });
      if (res.code == 0) {
        return res.data;
      }
    },
    // 添加可搜索字段
    searchAdd() {
      let arr = [];
      this.sendSearchTitles.map((item) => {
        arr.push(item.id);
      });
      this.addSearch = arr;
      this.dialogSearch.inner = true;
    },
    searchAddSubmit() {
      this.sendSearchTitles.map((item) => {
        if (this.addSearch.indexOf(item.id) == -1) {
          this.searchList[item.fieldName] = "";
        }
      });

      this.$emit("sendTitles", this.addSearch);
      this.dialogSearch.inner = false;
    },
    getunitTypeList(key) {
      this.$emit("getunitTypeList", key);
    },
    // 弹窗确定事件
    search() {
      this.$emit("search", this.searchList);
      if (!this.checkBeforeClosing) {
        this.dialogSearch.outer = !this.dialogSearch.outer;
      }
    },
    // 弹窗关闭事件
    reset(type) {
      if (type) {
        let data = [];
        let sendSearchTitles = Object.assign([], this.sendSearchTitles);
        sendSearchTitles.map((item, index) => {
          if (index < 3) {
            data.push(item.id);
          }
        });
        // console.log(data);
        if (data.length > 0) {
          this.$emit("sendTitles", data);
        }
      }
      this.$emit("reset", "search");
    },
    /**select事件 */
    // selectFTA事件
    async selectFTAChange(item) {
      let res = await this.$api.VoListByPo({}, item.relatedModelName);
      if (res.code == 0) {
        this.selectFTAData = res.data;
        if (item.relatedModelName == "Permission") {
          this.selectFTAData.unshift({
            name: "顶级菜单",
            id: "0",
          });
        }
      }
    }, // selectFTAPack
    async selectFTAChangePack(item) {
      let res = await this.$api.VoListByPoPack({}, item.relatedModelName);
      if (res.code == 0) {
        this.selectFTAData = res.data;
        if (item.relatedModelName == "Permission") {
          this.selectFTAData.unshift({
            name: "顶级菜单",
            id: "0",
          });
        }
      }
    },
    // selectDataFTA事件
    async selectDataFTAChange(item, index) {
      let res = await this.$api.VoListByPo(
        { statusType: "0" },
        item.relatedModelName,
        item.nacos
      );
      if (res.code == 0) {
        this.formTitles[index]["data"] = res.data;
        this.selectFTAData = res.data;
        // this.selectFTAData.unshift({
        //   name: "空",
        //   id: "0",
        // });
      } else {
        this.selectFTAData = [];
      }
    },
    //selectvalueFTA||selectvalueMultipleFTA事件
    async selectvalueChange(item, index) {
      console.log(item);
      let res = await this.$api.VoListByPo(
        {},
        item.relatedModelName,
        item.nacos
      );
      if (res.code == 0) {
        let formTitles = this.formTitles;
        formTitles[index]["data"] = res.data;
        this.formTitles = Object.assign([], formTitles);
        this.selectValueFTAData = res.data;
      } else {
        this.selectFTAData = [];
      }
    },
    // cascaderData事件
    async cascaderFTAChange(item, index) {
      let res = await this.$api.VoListByPo(
        { statusType: "0" },
        item.relatedModelName,
        item.nacos
      );
      console.log("res", res);
      if (res.code == 0) {
        // this.formTitles[index]["data"] = res.data;
        this.cascaderOptions = res.data;
      } else {
        this.cascaderOptions = [];
      }
    },
    // searchSelect事件
    // 远程搜索
    //searchSelect 远程搜索
    async remoteSearchList(query, item, index) {
      let obj = {};
      obj[item.relatedFieldName] = query;
      let res = await this.$api.VoListByPo(
        obj,
        item.relatedModelName,
        item.nacos
      );
      if (res.code == 0) {
        let formTitles = this.sendSearchTitles;
        formTitles[index]["data"] = res.data;
        this.sendSearchTitles = Object.assign([], formTitles);
      }
    },
  },
};
</script>

<style lang="less" scoped>
@import "~@/common/less/main.less";
.search_box {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  .router_list {
    height: 32px;
    display: flex;
    align-items: center;
    /deep/.gao_btn {
      background: @maincolor;
      border-color: @maincolor;
      font-family: "PingFang SC";
      font-style: normal;
      font-weight: normal;
      // font-size: 14px;
      color: #ffffff;
      padding-right: 23px;
      padding-left: 10px;
    }
    .el-breadcrumb {
      display: flex;
      align-items: center;
      /deep/.el-breadcrumb__inner {
        font-family: " .PingFang SC";
        font-style: normal;
        font-weight: bold;
        font-size: 14px;
        color: #333333;
      }

      img {
        margin-right: 12px;
      }
    }
  }
  .search {
    position: relative;
    .btn_serach {
      width: 100%;
      display: flex;
      justify-content: flex-end;
      position: relative;
      .imgStyle {
        width: 11px;
        height: 11px;
        position: absolute;
        top: 11px;
        right: 7px;
      }
      /deep/.gao_btn {
        background: @maincolor;
        border-color: @maincolor;
        font-family: "PingFang SC";
        font-style: normal;
        font-weight: normal;
        // font-size: 14px;
        color: #ffffff;
        padding-right: 23px;
        padding-left: 10px;
        height: 36px;
      }
    }
    .height_search_list {
      z-index: 100;
      width: 350px;
      // width: 340px;
      height: 500px;
      background: #fff;
      min-height: 100%;
      position: absolute;
      border: 1px solid #efefef;
      border-radius: 10px;
      right: 65px;
      padding-top: 50px;
      padding-bottom: 50px;
      .height_search_list_content {
        padding-top: 15px;
        padding-left: 20px;
        width: 100%;
        height: calc(100%);
        // overflow: auto;
        overflow-x: hidden;
        overflow-y: auto;
        // position: relative;
        .search_item {
          width: 307px;
          display: flex;
          align-items: center;
          justify-content: flex-start;
          margin-right: 20px;
          margin-bottom: 15px;
          .search_item_label {
            color: rgba(0, 0, 0, 0.75);
            font-weight: bold;
            font-size: 12px;
            display: inline-block;
            min-width: 104px;
            //  text-align: right;
            margin-right: 10px;
          }
        }
      }
      .title {
        width: 100%;
        height: 48px;
        background: #ffffff;
        border-radius: 4px;
        border-bottom: 1px solid #e9e9e9;
        padding-left: 24px;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        font-family: "Microsoft YaHei Regular", "Microsoft YaHei";
        font-weight: bold;
        font-style: normal;
        font-size: 14px;
        color: rgba(0, 0, 0, 0.647058823529412);
        margin-bottom: 15px;
        position: absolute;
        left: 0;
        top: 0;
        .title_icon {
          width: 20px;
          height: 20px;
          position: absolute;
          right: 20px;
          font-size: 20px;
          top: 16px;
        }
      }
    }

    .height_submit {
      width: 100%;
      height: 50px;
      position: absolute;
      bottom: 0;
      left: 0;
      display: flex;
      justify-content: right;
      align-items: center;
      background: #fff;
      border-top: 1px solid #efefef;
      padding-right: 20px;
      /deep/.el-button--text {
        color: @maincolor;
      }
      /deep/.el-button--primary {
        background: @maincolor;
        border-color: @maincolor;
      }

      .add_search_item {
        z-index: 11;
        background: #fff;
        width: 100%;
        height: 500px;
        position: absolute;
        bottom: -50px;
        left: -100px;
        display: flex;
        justify-content: space-around;
        border: 1px solid #efefef;
        border-radius: 10px;
        overflow: hidden;
        .title {
          width: 100%;
          height: 48px;
          background: #ffffff;
          border-radius: 4px;
          border-bottom: 1px solid #e9e9e9;
          padding-left: 24px;
          display: flex;
          justify-content: flex-start;
          align-items: center;
          font-family: "Microsoft YaHei Regular", "Microsoft YaHei";
          font-weight: bold;
          font-style: normal;
          font-size: 14px;
          color: rgba(0, 0, 0, 0.647058823529412);
          position: absolute;
          left: 0;
          top: 0;
          .title_icon {
            width: 20px;
            height: 20px;
            position: absolute;
            right: 20px;
            font-size: 20px;
          }
        }
        .group_box {
          width: 100%;
          height: calc(100% - 50px);
          overflow: auto;
          padding-top: 55px;
          .checbox_list {
            width: 100%;
            display: flex;
            justify-content: space-between;
            flex-wrap: wrap;
            align-items: center;
            height: max-content;
            /deep/.el-checkbox__input.is-checked + .el-checkbox__label {
              color: @maincolor;
            }
            /deep/.el-checkbox__input.is-checked .el-checkbox__inner,
            /deep/.el-checkbox__input.is-indeterminate .el-checkbox__inner {
              background-color: @maincolor!important;
              border-color: @maincolor!important;
            }
            .checkout_item {
              width: 40%;
              padding: 5px 10px;
              // /deep/.el-checkbox {
              //   margin-right: 30;
              // }
            }
            /deep/.el-checkbox:last-of-type {
              margin-right: 30px;
            }
          }
          .height_submit {
            width: 100%;
            height: 50px;
            position: absolute;
            bottom: 0;
            left: 0;
            display: flex;
            justify-content: space-around;
            align-items: center;
            background: #fff;
            border-top: 1px solid #efefef;
          }
        }
      }
    }

    .search_list {
      width: 75%;
      height: 100%;
      // overflow-x: auto;
      position: relative;
      .search_list_content {
        top: 0;
        left: 0;
        height: 100%;
        position: absolute;
        display: flex;
        // flex-wrap: wrap;
        // background: #f2f2f2;
        width: max-content;
        .height_search {
          width: 100%;
          height: 100%;
          position: absolute;
          background: red;
          left: 0;
          bottom: -100px;
        }
        .search_item {
          width: 280px;
          display: flex;
          align-items: center;
          justify-content: flex-start;
          margin-right: 20px;
          margin-bottom: 15px;
          .search_item_label {
            color: rgba(0, 0, 0, 0.75);
            font-weight: bold;
            font-size: 12px;
            display: inline-block;
            min-width: 85px;
            // text-align: right;
            margin-right: 10px;
          }
        }
      }
    }
    .btns_list {
      width: 20%;
      display: flex;
      .slot {
        margin-left: 15px;
        margin-right: 15px;
      }
    }
  }

  // .search_list {
  //   width:60%;
  //   .search_list_content{
  //      width: max-content;
  //      .search_item {
  //         width: 280px;
  //         display: flex;
  //         align-items: center;
  //         justify-content: flex-start;
  //         margin-right: 20px;
  //         .search_item_label {
  //           font-size: 12px;
  //           color: #333;
  //           display: inline-block;
  //           width: 80px;
  //           text-align: right;
  //         }
  //         /deep/.el-input__inner{
  //           height: 32px;
  //         }
  //       }
  //   }
  // }
}
</style>
