<template>
  <el-dialog
    :close-on-click-modal="false"
    :title="dialog.title"
    :visible.sync="dialog.model"
    :width="dialogWidth"
    @close="close('ruleForm')"
    v-dragModal
  >
    <el-form
      ref="ruleForm"
      :model="formData"
      size=""
      :class="$route.name == 'powerplantpoint' ? 'demo-ruleForm' : 'data_form'"
      label-position="left"
    >
      <el-form-item
        v-for="(formobj, index) in formObj"
        v-show="!formobj.notShow"
        :key="index"
        :label="formobj.label"
        :prop="formobj.prop"
        :rules="formobj.rules"
        :style="
          formobj.itembackground && formobj.itemWidth
            ? 'background: #F7F7F7;width: 100%;padding-left:23px;height: 32px;display: flex; align-items: center'
            : formobj.itemWidth
            ? 'width: 100%'
            : 'width: 48%'
        "
      >
        <span slot="label"
          >{{ formobj.label }}
          <el-tooltip class="item" effect="dark" placement="bottom"
            ><div slot="content" class="multiline-content">
              {{ formobj.content }}
            </div>
            <i v-if="formobj.isShow" class="el-icon-info"></i>
          </el-tooltip>
        </span>
        <!-- inupt输入框 -->
        <el-input
          v-if="formobj.input"
          v-model="formData[formobj.prop]"
          size="small"
          :disabled="dialog.title == '查看点' ? true : formobj.disabled"
          :placeholder="'请输入' + formobj.label"
          @input="inputINPUT($event, index, formobj.prop)"
          @change="inputChange($event, index, formobj.prop)"
        />
        <!-- number输入框 -->
        <el-input-number
          style="width: 100%"
          v-if="formobj.number"
          v-model="formData[formobj.prop]"
          :disabled="dialog.title == '查看点' ? true : formobj.disabled"
          :placeholder="'请输入' + formobj.label"
          @keyup.native="UpNumber"
          @keydown.native="UpNumber"
        />
        <!-- textarea输入框 -->
        <el-input
          style="width: 100%"
          v-if="formobj.textarea"
          v-model="formData[formobj.prop]"
          size="small"
          type="textarea"
          :disabled="dialog.title == '查看点' ? true : formobj.disabled"
          :placeholder="'请输入' + formobj.label"
          @input="forceUpdate"
        />
        <!-- select选择器 -->
        <el-select
          v-if="formobj.select"
          v-model="formData[formobj.prop]"
          size="small"
          :disabled="
            dialog.title == '查看点' || formobj.isdisabled
              ? true
              : formobj.disabled
          "
          :placeholder="'请选择' + formobj.label"
          @change="selectChange($event, index, formobj.prop)"
          @input="forceUpdate"
        >
          <el-option
            v-for="(options, sIndex) in formobj.options"
            :key="sIndex"
            :label="options.label"
            :value="options.value"
          />
        </el-select>
        <!-- select搜索框 -->
        <el-select
          v-if="formobj.searchSelect"
          v-model="formData[formobj.prop]"
          :disabled="formobj.disabled"
          multiple
          :placeholder="'请选择' + formobj.label"
          @input="forceUpdate"
        >
          <el-option
            v-for="(item, ssIndex) in formobj.options"
            :key="ssIndex"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
        <!-- select搜索框id与name全绑 -->
        <!-- <el-select
          v-if="formobj.searchSelectTwo"
          v-model="formData[formobj.prop]" 
          :disabled="formobj.disabled"
          multiple
          value-key="id"
          :placeholder="'请选择' + formobj.label"
        >
          <el-option
            v-for="(item, ssIndex) in formob    j.options"
            :key="ssIndex"
            :label="item.name"
            :value="item"
          />
        </el-select> -->
        <el-select
          v-if="formobj.searchSelectTwo"
          v-model="formData[formobj.prop]"
          size="small"
          value-key="id"
          clearable
          :disabled="formobj.disabled"
          :placeholder="formobj.placeholder"
          @change="selectChange($event, index, formobj.prop)"
          @input="forceUpdate"
        >
          <el-option
            v-for="(item, sIndex) in formobj.options"
            :key="sIndex"
            :label="item.label"
            :value="item.value"
          />
        </el-select>

        <!-- 树结构 -->
        <el-select
          v-if="formobj.selectTree"
          v-model="formData[formobj.prop]"
          size="small"
          clearable
          :disabled="formobj.disabled"
          :placeholder="formobj.placeholder"
        >
          <el-option
            hidden
            :value="formData[formobj.prop]"
            :label="formData[formobj.prop]"
          />
          <el-tree
            :data="formobj.treeData"
            :props="defaultProps"
            :check-on-click-node="true"
            @node-click="handleNodeClick"
          />
        </el-select>

        <!-- 年月日时分秒选择器 -->
        <el-date-picker
          v-if="formobj.dateTime"
          v-model="formData[formobj.prop]"
          value-format="yyyy-MM-dd HH:mm:ss"
          type="datetime"
          size="small"
          :disabled="formobj.disabled"
          :placeholder="'请选择' + formobj.label"
        />
        <!-- 年月日时分秒，开始和结束时间 -->
        <el-date-picker
          v-if="formobj.dateTimeRange"
          v-model="formData[formobj.prop]"
          value-format="yyyy-MM-dd HH:mm:ss"
          format="yyyy-MM-dd HH:mm:ss"
          size="small"
          type="datetimerange"
          :disabled="formobj.disabled"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        />
        <!-- 时分秒选择器 -->
        <el-time-picker
          v-if="formobj.timePicker"
          v-model="formData[formobj.prop]"
          value-format="HH:mm:ss"
          format="HH:mm:ss"
          size="small"
          :disabled="formobj.disabled"
          :placeholder="'请选择' + formobj.label"
          :picker-options="formobj.options"
        />
        <!-- 时分秒选择器，开始和结束时间 -->
        <el-time-picker
          v-if="formobj.timePickerIsRange"
          v-model="formData[formobj.prop]"
          value-format="HH:mm:ss"
          format="HH:mm:ss"
          is-range
          size="small"
          :disabled="formobj.disabled"
          range-separator="至"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
          placeholder="选择时间范围"
        />
        <!-- 年月日选择器 -->
        <el-date-picker
          v-if="formobj.datePicker"
          v-model="formData[formobj.prop]"
          value-format="yyyy-MM-dd"
          size="small"
          :disabled="formobj.disabled"
          :placeholder="'请选择' + formobj.label"
        />
        <!-- 年月日选择器，开始和介绍年月日 -->
        <el-date-picker
          v-if="formobj.datePickerIsRange"
          v-model="formData[formobj.prop]"
          value-format="yyyy-MM-dd"
          type="daterange"
          size="small"
          :disabled="formobj.disabled"
          :placeholder="formobj.placeholder"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        />
        <!-- switch开关 -->
        <el-switch
          v-if="formobj.switch"
          v-model="formData[formobj.prop]"
          size="small"
          :disabled="formobj.disabled"
          @change="formSwitchChange($event, index, formobj.prop)"
        />
        <!-- radio单选框 -->
        <el-radio-group
          v-if="formobj.radio"
          v-model="formData[formobj.prop]"
          :placeholder="'请选择' + formobj.label"
        >
          <el-radio
            v-for="(options, rIndex) in formobj.options"
            :key="rIndex"
            :label="options.label"
            :value="options.value"
          />
        </el-radio-group>
        <!-- checkbox复选框 -->
        <el-checkbox-group
          v-if="formobj.checkbox"
          v-model="formData[formobj.prop]"
          :placeholder="'请选择' + formobj.label"
        >
          <el-checkbox
            v-for="options in formobj.options"
            :key="options.value"
            :label="options.label"
          />
        </el-checkbox-group>

        <!-- 文件上传 -->
        <!-- 如果对象有值就回显，没有值就为空 -->
        <el-upload
          v-if="formobj.upload"
          :ref="formobj.prop"
          :accept="formobj.uploadObj.accept"
          :file-list="formData[formobj.prop] ? formData[formobj.prop] : []"
          action="#"
          :on-remove="
            (file, fileList) =>
              handleRemove(file, fileList, formobj.prop, index)
          "
          :on-change="
            (file, fileList) =>
              uploadSuccess(
                file,
                fileList,
                formobj.prop,
                formobj.uploadObj.replace
              )
          "
          :auto-upload="false"
        >
          <el-button size="small" type="white"
            ><i class="el-icon-map_1"></i>上传附件</el-button
          >
          <div slot="tip" class="el-upload__tip">
            {{ formobj.uploadObj.DocText }}
          </div>
        </el-upload>
        <!-- text展示 -->
        <span v-if="formobj.text" v-text="formData[formobj.prop]" />
        <!-- 计量单位 -->
        <span v-if="formobj.unit" class="left10">{{ formobj.unit }}</span>
        <!--计算公式 -->
        <template v-if="formobj.computational">
          <div class="computationalStyle">
            <div style="height: 24px; display: flex; padding-left: 12px">
              <el-button
                :disabled="dialog.title == '查看点' ? true : false"
                type="primaryAdd"
                @click="addPoint()"
                >添加点</el-button
              >
              <el-dropdown
                style="line-height: 0 !important; margin-left: 12px"
                v-for="(sq, index) in computationalData"
                :key="index"
              >
                <el-button type="primaryYs"> {{ sq.name }} </el-button>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item
                    :disabled="dialog.title == '查看点' ? true : false"
                    v-for="(se, index1) in sq.data"
                    :key="index1"
                    @click.native="computationaldataT(se.name, formobj.prop)"
                    >{{ se.name }}</el-dropdown-item
                  >
                </el-dropdown-menu>
              </el-dropdown>
            </div>
            <div style="flex: 1; background: #f8f8fa; margin-top: 8px">
              <el-input
                :disabled="dialog.title == '查看点' ? true : formobj.disabled"
                type="text"
                class="custom-input"
                placeholder="请添加点计算"
                id="promptInput"
                @blur="handleInputBlur"
                v-model="formData[formobj.prop]"
              />
            </div>
          </div>
        </template>
        <template v-if="formobj.tag">
          <div class="plusSignBox" @click="!isShowlabe">
            <div
              v-for="(item1, index1) in formData[formobj.prop]"
              class="lblHelpMessage"
              :key="index1"
              :style="{
                background: item1.colour[0].color,
                color: item1.colour[0].background,
              }"
            >
              {{ item1.name }}
            </div>
            <div
              v-if="dialog.title !== '查看点'"
              class="el-dropdown-link"
              v-click-outside="handleBlur"
              @click="
                isShowlabe = !isShowlabe;
                addlabeS = false;
              "
            >
              <div class="plusSign">+</div>
              <div class="tagS" @click="queryLabelList()">添加标签</div>
              <div @click.stop="" class="addlabeStyle" v-if="isShowlabe">
                <div class="addlabeStylebox">
                  <el-input
                    v-model="searchList.name"
                    @keyup.enter.native="queryLabelList"
                    placeholder="搜索标签"
                  ></el-input>
                  <i
                    @click="
                      addlabeS = true;
                      addcolor();
                    "
                    class="el-icon-circle-plus-outline linestyle"
                  ></i>
                  <div class="labeBox">
                    <div
                      class="labeItem"
                      v-for="(item, key) in taskStatusMap"
                      :key="key"
                      @click="switchStatusKeywords(item)"
                    >
                      <i
                        class="dotted"
                        :style="{ background: item.colour[0].background }"
                      ></i>
                      {{ item.name }}
                      <i
                        class="el-icon-check"
                        v-if="chooseAfterValue.includes(item)"
                      ></i>
                    </div>
                  </div>
                </div>
              </div>

              <div class="addlabeStyle" v-if="addlabeS" @click.stop="">
                <div class="addlabeStylebox">
                  <div class="head">
                    <i
                      @click.stop=""
                      class="el-icon-arrow-left"
                      @click="
                        addlabeS = false;
                        isShowlabe = true;
                      "
                    ></i>
                    新增标签
                    <i
                      @click.stop=""
                      class="el-icon-close"
                      @click="
                        addlabeS = false;
                        isShowlabe = false;
                      "
                    ></i>
                  </div>
                  <el-form
                    :model="labeForm"
                    ref="labeForm"
                    class="demo-ruleForm"
                    style="width: 100%; padding: 16px"
                    label-position="left"
                  >
                    <el-form-item label="" prop="name" style="width: 100%">
                      <el-input v-model="labeForm.name"></el-input>
                    </el-form-item>
                    <el-form-item label="" style="width: 100%">
                      <el-input
                        type="textarea"
                        maxlength="200"
                        show-word-limit
                        :autosize="{ minRows: 4, maxRows: 6 }"
                        v-model="labeForm.remarks"
                      ></el-input>
                    </el-form-item>
                    <el-form-item label="" style="width: 100%">
                      <div class="circle_all">
                        <div
                          class="circle"
                          :style="{ background: item.background }"
                          v-for="(item, index) in labeForm.circleArr"
                          :key="index"
                          @click="checkCircle(item, index)"
                        >
                          <img
                            src="../../views/dataManage/components/img/check.png"
                            alt=""
                            v-if="item.status == true"
                          />
                        </div>
                      </div>
                    </el-form-item>
                    <el-form-item style="width: 100%">
                      <el-button
                        type="primary"
                        size="mini"
                        style="background: #536dfe; width: 100%; border: none"
                        @click="identification(labeForm)"
                        >创建</el-button
                      ></el-form-item
                    >
                  </el-form>
                </div>
              </div>
            </div>
          </div>
        </template>
        <!-- slot型 -->
        <template v-if="formobj.slot">
          <slot name="model"> </slot>
        </template>
        <!--分割线 -->
        <template v-if="formobj.divider">
          <div class="dividerStyle">
            <div class="line"></div>
            {{ formobj.content }}
          </div></template
        >
        <!-- 动态表单 -->
        <template v-if="formobj.dynamicForm">
          <div class="form_input">
            <!-- <div>43</div> -->
            <div
              style="height: 36px; margin-top: 8px; position: relative"
              v-for="(child, chInd) in formData[formobj.prop]"
              :key="chInd"
            >
              <div class="dynamiclabe" v-if="chInd == 0">
                <div class="labe labe1">参数名:</div>
                <div class="labe">参数名:</div>
              </div>
              <el-form-item label="" style="width: 100%">
                <el-input
                  :disabled="dialog.title == '查看数据源' ? true : false"
                  v-model="child['value1']"
                  size="small"
                  placeholder="请输入"
                />
                <div style="width: 20%"></div>
                <el-input
                  :disabled="dialog.title == '查看数据源' ? true : false"
                  v-model="child['value2']"
                  size="small"
                  placeholder="请输入"
                />
                <el-button
                  type="text"
                  @click="addOther(formData[formobj.prop])"
                  v-if="chInd < 1 && dialog.title !== '查看数据源'"
                  style="
                    font-size: 25px;
                    font-weight: 530;
                    color: #536dfe;
                    margin-left: 10px;
                  "
                  >+</el-button
                >
                <el-button
                  v-if="chInd > 0 && dialog.title !== '查看数据源'"
                  type="text"
                  @click="removeOther(child, formData[formobj.prop])"
                  style="
                    font-size: 25px;
                    font-weight: 540;
                    color: #536dfe;
                    margin-left: 16px;
                  "
                  >-</el-button
                >
              </el-form-item>
            </div>
          </div>
        </template>
        <!-- 操作按钮 -->
        <template v-if="formobj.operatingButton">
          <div class="dividerStyle operatingButton">
            <div style="margin-right: 48px">
              <el-button
                type="primary_one"
                :disabled="
                  formData.dataSourceName == '' ||
                  formData.dataSourceCoding == '' ||
                  formData.collectionCycle == '' ||
                  dialog.title == '查看数据源'
                "
                size="medium"
                style="
                  background: #ffff;
                  border-color: #dcdfe6;
                  color: #303133;
                  font-weight: 600;
                "
                @click="testContinue()"
                >测试连接</el-button
              >
              <div>点击后可测试数据源库连接状态</div>
            </div>
            <!-- <div
              v-if="
                formobj.operatingButton && formData.dataSourceType === 'redis'
              "
            >
              <el-button type="primary_one" disabled>点表核对</el-button>
              <div>数据源类型为redis时，点击后可核对数据点是否存在</div>
            </div> -->
          </div>
        </template>
        <!-- 表格 -->
        <div class="table_listS" v-if="formobj.table">
          <el-button type="unify" class="VxetableTb">选择工器具</el-button>
          <Vxetable
            :showSetList="false"
            ref="invoiceVxeTable"
            @currentChange="VoPageListByDto"
            @sizeChange="sizeChange"
            :tablePage="tablePage"
            :tableTitles="tableTitles"
            :tableData="formData[formobj.prop]"
            operationW="100"
          >
            <div slot="btn_edit" slot-scope="{ row }">
              <el-button type="text" class="del" size="medium">删除</el-button>
            </div>
          </Vxetable>
        </div>
      </el-form-item>
    </el-form>

    <span slot="footer" v-if="footer" class="dialog-footer">
      <div style="display: flex; justify-content: flex-end" @click.stop="">
        <!-- primaryYs -->
        <el-button
          v-if="
            dialog.title !== '查看点' &&
            dialog.title !== '查看数据源' &&
            dialog.title !== '查看'
          "
          plain
          size="mini"
          style="color: #666666; border: 1px solid #cccccc"
          @click="close('ruleForm')"
          >取消</el-button
        >
        <!--  type="primaryAdd" -->
        <el-button
          type="primary"
          size="mini"
          style="background: #536dfe; border-color: #536dfe"
          :loading="loadmodel"
          @click="submit(formData)"
        >
          {{
            dialog.title == "查看点" ||
            dialog.title == "查看数据源" ||
            dialog.title == "查看"
              ? "关闭"
              : "确定"
          }}
        </el-button>
        <slot class="slot" name="right_btn"></slot>
      </div>
    </span>
  </el-dialog>
</template>

<script>
const clickOutside = {
  bind(el, binding) {
    // 在元素上绑定一个点击事件监听器
    el.clickOutsideEvent = function (event) {
      // 检查点击事件是否发生在元素的内部
      if (!(el === event.target || el.contains(event.target))) {
        // 如果点击事件发生在元素的外部，则触发指令绑定的方法,将点击的event数据传过去
        binding.value(event);
      }
    };
    // 在文档上添加点击事件监听器
    document.addEventListener("click", el.clickOutsideEvent);
  },
  unbind(el) {
    // 在元素上解除点击事件监听器
    document.removeEventListener("click", el.clickOutsideEvent);
  },
};
export default {
  directives: {
    "click-outside": clickOutside, // 注册自定义指令
  },
  props: {
    footer: {
      type: Boolean,
      default: () => {
        return true;
      },
    },

    dialogWidth: {
      type: String,
      default: () => {
        return "50%";
      },
    },
    width: {
      type: String,
      default: () => {
        return "";
      },
    },
    dialog: {
      type: Object,
      default: () => {
        return {
          model: false, //状态
          title: "", //标题
        };
      },
    },
    rightBtnShow: {
      type: Boolean,
      default: () => {
        return true;
      },
    },

    slotBtn: {
      type: Number,
      default: () => {
        return 1;
      },
    },

    loadmodel: {
      type: Boolean,
      default: () => {
        return false;
      },
    },

    formObj: {
      type: Array,
      required: true,
    },
    formData: {
      type: Object,
      required: true,
    },
    searchSelectOptionsCb: {
      type: Array,
    },
  },
  components: {},
  data() {
    return {
      defaultProps: {
        children: "children",
        label: "name",
      },
      searchList: {},
      cursorIndex: 0,
      addlabeS: false,
      labeForm: {
        name: "",
        remarks: "",
        circleArr: [
          {
            background: "#536DFE",
            color: "#E8EBFF",
            status: true,
          },
          {
            background: "#48BF5C",
            color: "#E6F6E9",
            status: false,
          },
          {
            background: "#FA9805",
            color: "#FBF2E4",
            status: false,
          },
          {
            background: "#FF1616",
            color: "#FAECEC",
            status: false,
          },
          {
            background: "#4EBDFC",
            color: "#D3ECFA",
            status: false,
          },
          {
            background: "#6A70B8",
            color: "#E8EBFF",
            status: false,
          },
        ],
      },
      isShowlabe: false,
      //新增标签
      newLabel: {
        model: false,
        title: "新增标签",
      },
      inputv: "",
      chooseAfterValue: [],
      taskStatusMap: [],
      computationalData: [
        {
          name: "二元运算符",
          data: [
            {
              name: "+",
            },
            {
              name: "-",
            },
            {
              name: "*",
            },
            {
              name: "/",
            },
          ],
        },
        {
          name: "常用函数",
          data: [
            {
              name: "max()",
            },
            {
              name: "min()",
            },
            // {
            //   name: "avg()",
            // },
            // {
            //   name: "avg()",
            // },
            // {
            //   name: "moveAvg()",
            // },
          ],
        },
        {
          name: "其他",
          data: [
            {
              name: "()",
            },
            // {
            //   name: "[]",
            // },
            // {
            //   name: "{}",
            // },
          ],
        },
      ],
      showSelect: false,
      options: [
        {
          name: "热力",
          type: "success",
          value: "热力",
        },
        {
          name: "避风港",
          type: "warning",
          value: "避风港",
        },
        {
          name: "vds",
          type: "",
          value: "vds",
        },
      ],
      searchSelectLoading: false,
      dialogVisible: false,
      disabled: false,
      tablePage: {
        pageIndex: 1,
        pageSize: 20,
        total: 0,
      },
      tableTitles: [],
      tableData: [],
    };
  },
  watch: {},
  methods: {
    //点击其它区域
    handleBlur(event) {
      console.log("点击区域外", event);
      this.addlabeS = false;
      this.isShowlabe = false;
    },
    async identification(form) {
      let res = await this.$api.insertLabel({
        name: form.name,
        remarks: form.remarks,
        colourType: form.circleArr,
      });
      if (res.code == 0) {
        this.addlabeS = false;
        this.$message.success("新增标签成功");
        this.queryLabelList();
      } else {
        this.$message.warning(res.msg);
      }
    },
    switchStatusKeywords(index) {
      console.log("index", index);
      if (this.chooseAfterValue.includes(index)) {
        // 已勾选，取消勾选
        this.chooseAfterValue = this.chooseAfterValue.filter(
          (item) => item.name !== index.name
        );
      } else {
        if (this.chooseAfterValue.length < 30) {
          // 未勾选，添加勾选
          this.chooseAfterValue.push(index);
        } else {
          this.$message.warning("最多只能勾选30个标签");
        }

        console.log(this.chooseAfterValue, "ssss");
      }
      this.formData.pointLabels = this.chooseAfterValue;
    },
    computationaldataT(data, prop) {
      console.log(data, prop);
      if (prop == "formulaContent") {
        let s1 = "";
        let s2 = "";
        if (this.formData.formulaContent.length == this.cursorIndex) {
          this.formData.formulaContent = this.formData.formulaContent + data;
        } else {
          s1 = this.formData.formulaContent.toString();
          s2 = this.formData.formulaContent.toString();
          this.formData.formulaContent =
            s1.substring(0, this.cursorIndex) +
            data +
            s2.substring(this.cursorIndex, this.formData.formulaContent.length);
        }
        // 最后让文本框获取焦点
        this.focus();
      }
    },
    focus() {
      this.$nextTick(() => {
        document.getElementById("promptInput").focus();
      });
    },
    UpNumber(e) {
      e.target.value = e.target.value.replace(/[^\d]/g, "");
    },
    VoPageListByDto() {},
    sizeChange() {},
    //select变化调用
    selectChange(value, index, prop) {
      this.$emit("selectChange", value, index, prop);
    },
    // input的input事件
    // inputINPUT(value, index, prop) {
    //   console.log(value);
    //   if (prop == "upperLimit" || prop == "lowerLimit") {
    //     if (value) {
    //       let regExp = /^\d+$/;
    //       if (!regExp.test(value)) {
    //         let d = this.$refs.ruleForm.fields;
    //         for (var i = 0; i < d.length; i++) {
    //           if (i == index) {
    //             d[i]["validateMessage"] = "必须是数字类型";
    //             d[i]["validateState"] = "error";
    //             return;
    //           }
    //         }
    //       } else {
    //         this.formData[prop] = "";
    //       }
    //     } else {
    //       this.$refs.ruleForm.clearValidate(prop);
    //     }
    //   }
    //   this.$emit("inputINPUT", value, index, prop);
    // },
    inputINPUT(value, index, prop) {
      this.$forceUpdate();
      if (prop === "upperLimit" || prop === "lowerLimit") {
        if (value) {
          let regExp = /^-?\d+(\.\d+)?$/;
          if (!regExp.test(value)) {
            let d = this.$refs.ruleForm.fields;
            for (let i = 0; i < d.length; i++) {
              if (i === index) {
                d[i]["validateMessage"] = "必须是数字类型";
                d[i]["validateState"] = "error";
                this.formData[prop] = "";
                setTimeout(() => {
                  this.$refs.ruleForm.clearValidate(prop);
                }, 2000);
                return;
              }
            }
          } else {
            // 如果值符合要求，这里可以设置为默认状态，但通常不需要显式设置，
            // 因为如果验证通过，validateState 应该已经是 'success' 或未定义（默认）
            // this.formData[prop] = ""; 这行代码实际上会清除输入框的值，这可能不是你想要的
          }
        } else {
          // 当值为空时，清除验证状态和错误消息
          this.$refs.ruleForm.clearValidate(prop);
          let d = this.$refs.ruleForm.fields;
          for (let i = 0; i < d.length; i++) {
            if (i === index) {
              d[i]["validateMessage"] = ""; // 清空错误消息
              d[i]["validateState"] = ""; // 清空验证状态
            }
          }
        }
      }
      this.$emit("inputINPUT", value, index, prop);
    },
    // input的change事件
    inputChange(value, index, prop) {
      this.$emit("inputChange", value, index, prop);
    },
    // 搜索类型select搜索
    remoteMethod(query, index, prop) {
      if (query) {
        this.searchSelectLoading = true;
        this.$emit("querySelectValue", query, index, prop);
        setTimeout(() => {
          this.formObj[index].options = this.searchSelectOptionsCb;
          this.searchSelectLoading = false;
        }, 500);
      } else {
        this.searchSelectOptios = [];
      }
    },
    //switch变化
    formSwitchChange(val, index, prop) {
      this.$emit("formSwitchChange", val, index, prop);
    },
    //按钮点击事件
    buttonClick(prop, index) {
      this.$emit("buttonClick", prop, index);
    },

    //文件上传成功回调
    uploadSuccess(file, fileList, prop, replace) {
      console.log("成功", fileList);
      if (replace) {
        if (fileList.length > 1) {
          fileList.shift();
        }
      }
      this.formData[prop] = fileList;
    },
    //文件删除
    handleRemove(file, fileList, prop, index) {
      this.pushUpload(file, fileList, prop);
    },

    //提交时验证表单，直接在父级调用
    submit(form) {
      if (
        this.dialog.title == "查看点" ||
        this.dialog.title == "查看" ||
        this.dialog.title == "查看数据源"
      ) {
        this.dialog.model = false;
      } else {
        let formValidate = Boolean;
        this.$refs.ruleForm.validate((valid) => {
          if (valid) {
            formValidate = true;

            this.$emit("submit", form, this.dialog.title);
          } else {
            formValidate = false;
          }
        });
        return formValidate;
      }
    },
    forceUpdate() {
      this.$forceUpdate();
    },
    // 单个字段验证
    validateFieldProp(prop) {
      let formValidate = Boolean;
      this.$refs.ruleForm.validateField(prop, (valid) => {
        if (!valid) {
          formValidate = true;
        } else {
          formValidate = false;
        }
      });
      return formValidate;
    },
    // 对文件上传，删除进行赋值，调用form验证
    pushUpload(file, fileList, prop) {
      if (fileList.length > 0) {
        this.formData[prop] = fileList;
        console.log("fileList", fileList);
      } else {
        // 表示没有数据,把字段置空
        this.formData[prop] = [];
      }
      this.$refs.ruleForm.validateField(prop); //调用验证form表单的文件上传
    },
    close(ruleForm) {
      this.addlabeS = false;
      this.isShowlabe = false;
      this.chooseAfterValue = [];
      // this.formData.parameter = [];
      this.$refs[ruleForm].resetFields();
      this.dialog.model = false;
      this.$emit("close", this.formData);
    },
    //添加点
    addPoint() {
      this.$emit("addPoint");
    },
    //下拉 树结构
    handleNodeClick(data) {
      this.formData.deviceName = data.name;
      this.formData.deviceId = data.id;
      // this.$refs.selectRegionId.blur();
    },
    //测试连接
    testContinue() {
      this.$emit("testContinue", this.formData);
    },
    handleInputBlur(e) {
      this.cursorIndex = e.srcElement.selectionStart;
      this.$emit("handleInputBlur", e);
    },
    removeOther(item, val) {
      var index = val.indexOf(item);
      if (index !== -1) {
        val.splice(index, 1);
      }
    },
    //勾选颜色
    checkCircle(item, index) {
      this.labeForm.circleArr.forEach((circleItem) => {
        circleItem.status = false; // 假设正确的属性名是 status
      });
      this.labeForm.circleArr[index].status = !item.status;
    },
    //点击标签按钮
    addcolor() {
      this.labeForm = this.$options.data().labeForm;
    },
    async queryLabelList() {
      this.chooseAfterValue = [];
      let res = await this.$api.queryLabelList({
        ...this.searchList,
      });
      if (res.code == 0) {
        this.taskStatusMap = res.data;
        res.data.forEach((item) => {
          if (this.formData.pointLabels) {
            this.formData.pointLabels.map((it) => {
              if (item.id == it.id) {
                this.chooseAfterValue.push(item);
              }
            });
          }
        });
      }
    },
    addOther(val) {
      val.push({
        value1: "",
        value2: "",
      });
    },
  },

  created() {},
};
</script>

<style lang="less" scoped>
/deep/.el-dialog__title {
  font-family: PingFang SC;
  font-weight: 600;
  font-size: 16px;
  color: #051c32;
}
/deep/.el-dialog__header {
  border-bottom: 1px solid #e9e9e9;
  font-family: PingFang SC;
  font-weight: 600;
  font-size: 16px;
  color: #051c32;
  padding-bottom: 16px;
  padding-top: 16px;

  display: flex;
  align-items: center;
  justify-content: space-between;
  .el-dialog__headerbtn {
    height: 16px;
    width: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    // margin-left: 10px;
  }
  .el-dialog__close {
    font-size: 18px;
    margin-left: 10px;
  }
}

/deep/.el-dialog__body {
  padding: 0;
  .dialog_tootip {
    z-index: 1111;
    font-family: PingFang SC;
    font-style: normal;
    font-weight: normal;
    font-size: 14px;
    color: #3166f2;
    background: rgba(49, 102, 242, 0.06);
    width: 100%;
    height: 46px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
/deep/.el-dialog__footer {
  border-top: 2px solid #e9e9e9;
  padding-bottom: 12px;
  padding-top: 12px;
  display: flex;
  justify-content: right;
}
/deep/.el-button--primary {
  // background-color: @bg!important;
  // border-color: @bg!important;
}
/deep/.el-button--primary.is-plain {
  //color: @bg !important;
  background: rgba(49, 102, 242, 0.1) !important;
  // border-color: @bg !important;
}
/deep/.el-form {
  display: flex;
  flex-wrap: wrap;
  padding: 24px 24px 0 24px;
  justify-content: space-between;
  // padding-right: 50px;
  .el-select {
    width: 100% !important;
  }
  /deep/.el-date-editor {
    width: 100% !important;
  }
  .el-form-item {
    // margin-bottom: 16px;
    margin-bottom: 22px;
    .el-form-item__label {
      width: 72px;
      //  height: 30px;
      font-family: PingFang SC;
      font-style: normal;
      font-weight: normal;
      font-size: 14px;
      color: #051c32;
      white-space: nowrap;
      margin-right: 24px;
    }
    .el-form-item__content {
      display: flex;
      height: 100%;
      .add_unit {
        display: grid;
        grid-column-gap: 10px;
        grid-template-columns: auto 46px;
        justify-content: space-between;
        box-sizing: border-box;
      }
    }
  }
  .textSelect {
    /deep/.el-input-group__append {
      background-color: #fff;
      border-color: #fff;
      color: #333;
      cursor: pointer;
    }
  }
  .area {
    /deep/.el-input-group__append {
      background-color: #409eff;
      border-color: #409eff;
      color: #fff;
      cursor: pointer;
    }
  }
  // .textarea {
  //   // padding-right: 56px;
  //   height: 106px;
  //   .el-form-item__label {
  //     width: 120px;
  //   }
  //   .el-form-item__content {
  //     width: 100%;
  //     margin-left: 0px !important;
  //   }
  // }
  .file {
    display: flex;
    .el-form-item__content {
      display: flex;
    }
    .avatar-uploader {
      width: 100px !important;
      margin-right: 23px;
    }
    .avatar-uploader .el-upload {
      width: 100px;
      height: 100px;
      border: 1px dashed #d9d9d9;
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      background: rgba(0, 0, 0, 0.02);
    }
    .avatar-uploader .el-upload:hover {
      border-color: #409eff;
    }
    .avatar-uploader-icon {
      font-size: 28px;
      color: #8c939d;
      width: 100px;
      height: 100px;
      line-height: 100px;
      text-align: center;
    }
    .avatar {
      width: 178px;
      height: 178px;
      display: block;
    }
    .img_list {
      height: 100%;
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      .img_box {
        width: 100px;
        height: 100px;
        position: relative;
        background: red;
        margin-right: 22px;
        margin-bottom: 10px;
        .icon {
          position: absolute;
          right: -5px;
          top: -6px;
          font-size: 18px;
          background: #fff;
          border-radius: 50%;
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: 18;
          width: 15px;
          height: 16px;
          color: #333333;
        }
        img {
          width: 100%;
          height: 100%;
        }
      }
      .file {
        display: flex;
        align-items: center;
        justify-content: center;
        span {
          margin-right: 10px;
        }
        .icon {
          font-size: 18px;
          background: #fff;
          border-radius: 50%;
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: 18;
          width: 15px;
          height: 16px;
          color: #333333;
        }
      }
    }
  }
  .table {
    /deep/.el-table {
      width: 100% !important;
    }
  }
}
/deep/.el-input--small .el-input__inner,
/deep/.el-input-number .el-input__inner {
  height: 36px !important;
  line-height: 36px !important;
}
/deep/.el-textarea__inner,
/deep/.el-input__inner {
  font-family: "PingFang SC" !important;
  font-style: normal !important;
  font-weight: 400 !important;
  font-size: 14px !important;
  color: #333333;
}
/deep/.el-textarea .el-input__count {
  height: 5px !important;
  bottom: 23px !important;
}
.table_listS {
  width: 100%;
  height: 200px;
  position: relative;
  /deep/ .VxetableTb {
    position: absolute !important;
    top: -37px;
    right: 0;
  }
  /deep/.el-tag.el-tag--info {
    background: rgba(5, 28, 50, 0.1) !important;
    color: #051c32 !important;
    border: none !important;
  }
}
</style>
<style lang="less">
.el-dialog__headerbtn:hover .el-dialog__close {
  color: #536dfe !important;
}
.el-input-number .el-input__inner {
  text-align: left !important;
}
.el-input-number {
  line-height: 33px !important;
}
.el-input-number__increase,
.el-input-number__decrease {
  width: 18px;
  background: #ffffff;
}
.el-icon-map_1 {
  width: 14px;
  height: 14px;
  margin-right: 5px;
  //  background: url("../../assets/img/sc.png") left no-repeat;
}
.el-icon-map_1:before {
  font-size: 0;
  visibility: hidden;
  content: "\e778";
}
.el-select-dropdown__item.selected {
  color: #2348f9 !important;
}
.el-upload-list {
  max-height: 170px;
  overflow: auto;
}
.el-upload__tip,
.el-upload-list__item:first-child {
  margin-top: 0;
}
.tagS {
  color: #536dfe;
  font-family: "PingFang SC";
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  position: relative;
  .selectS {
    position: absolute;
    left: -15px;
    top: 40px;
    width: 291px;
    height: 200px;
    border: 1px solid #666;
    background: #fff;
    display: flex;
    flex-direction: column;
    .selectSH {
      height: 42px;
      border-radius: 4px 4px 0 0;
      border-bottom: 1px solid #e5e6eb;
    }
    .selectSC {
      flex: 1;
      overflow: auto;
    }
  }
}
.plusSignBox {
  display: flex;
  align-items: center;
  cursor: pointer;
  width: 100%;
  flex-wrap: wrap;
}
.operatingButton {
  //display: unset !important;
}
.dividerStyle {
  width: 100%;
  //height: 32px;
  border-radius: 2px;
  color: #666666;
  font-family: "PingFang SC";
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  position: relative;
  display: flex;
  align-items: center;
  .line {
    width: 3px;
    height: 16px;
    background: #536dfe;
    border-radius: 18px;
    position: absolute;
    left: -108px;
    top: 8px;
  }
}
.plusSign {
  width: 12.25px !important;
  height: 12.25px !important;
  background: #536dfe !important;
  line-height: 12.25px !important;
  text-align: center;
  border-radius: 50%;
  color: #fff;
  margin-right: 3px;
}
.computationalStyle {
  width: 100%;
  height: 125px;
  border: 1px solid #dcdfe6;
  padding-top: 12px;
  display: flex;
  flex-direction: column;
}
.custom-input {
  .el-input__inner {
    height: 79px !important;
    border: none !important;
    line-height: 0 !important;
    padding-top: 0 !important;
    background: #f8f8fa;
  }
}
.el-dropdown-link {
  display: flex;
  align-items: center;
  position: relative;
  .addlabeStyle {
    position: absolute;
    // top: 35px;
    top: -324px;
    left: 0;
    width: 291px;
    // height: 294px;
    height: 325px;
    background: #fff;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    border-radius: 4px;
    z-index: 9999;

    .addlabeStylebox {
      display: flex;
      flex-direction: column;
      width: 291px;
      // height: 294px;
      height: 325px;
      z-index: 9999;
      .head {
        width: 100%;
        height: 42px;
        border-bottom: 1px solid #e5e6eb;
        color: #212121;
        font-family: "PingFang SC";
        font-size: 14px;
        font-style: normal;
        font-weight: 500;
        display: flex;
        justify-content: center;
        flex-wrap: wrap;
        align-content: space-between;
        flex-direction: column-reverse;
        padding: 0 16px;
      }
    }
    .labeBox {
      flex: 1;
      // padding: 0 12px;
      overflow: auto;
      .labeItem {
        width: 100%;
        height: 40px;
        color: #212121;
        font-family: "PingFang SC";
        font-size: 14px;
        font-style: normal;
        font-weight: 400;
        position: relative;
        padding: 0 12px;
      }
      .labeItem:hover {
        background: #f7f7f7;
      }
    }
  }
}
.el-icon-check {
  position: absolute;
  right: 16px;
  top: 10px;
  color: #536dfe;
}
.dotted {
  display: inline-block;
  width: 6px;
  height: 6px;
  border-radius: 50%;
}
.linestyle {
  position: absolute;
  top: 12px;
  right: 14px;
  font-size: 18px;
  cursor: pointer;
}
.circle_all {
  width: 100%;
  display: flex;
  .circle {
    width: 15px;
    height: 15px;
    margin-top: 10px;
    border-radius: 100%;
    margin-right: 15px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
  }
}
.el-icon-close {
  text-align: right;
}
.form_input {
  border: 1px solid #e9e9e9;
  display: flex;
  flex-direction: column;
  flex: 1;
  padding: 29px 68px 11px 17px;
  position: relative;
  max-height: 150px;
  overflow: auto;
}
.multiline-content {
  white-space: pre-line !important;
  font-family: PingFang SC, PingFang SC;
  font-weight: 400;
  font-size: 12px;
}
.dynamiclabe {
  width: 100%;
  position: absolute;
  top: -39px;
  left: 2px;
  display: flex;
  .labe1 {
    width: 52% !important;
  }
  .labe {
    width: 47%;
    color: #212121;
    font-family: "PingFang SC";
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
  }
}
.el-form-item__error {
  font-family: PingFang SC;
  font-size: 12px;
  font-weight: 400;
  color: #ff1616 !important;
}
.data_form {
  overflow: auto !important;
  max-height: calc(900px - 100px) !important;
}
</style>
