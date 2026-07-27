<template>
  <el-dialog
    :close-on-click-modal="false"
    :title="dialog.title"
    :visible.sync="dialog.model"
    width="50%"
    @close="close"
  >
    <div>
      <el-form ref="form" :model="form" label-width="150">
        <template v-for="(item, index) in formTitles">
          <!-- text 类型 -->
          <el-form-item
            :key="index"
            v-if="item.fontendType == 'text'"
            :label="item.titleName"
            :prop="item.fieldName"
            :rules="
              item.requireAble
                ? [
                    {
                      required: true,
                      trigger: 'blur',
                      key: item.titleName,
                      reg: '',
                      validator: validateEveryData,
                    },
                  ]
                : []
            "
          >
            <el-input
              placeholder="请输入"
              clearable
              v-model="form[item.fieldName]"
            ></el-input>
          </el-form-item>
          <!-- number 类型 -->
          <el-form-item
            :key="index"
            v-if="item.fontendType == 'number'"
            :label="item.titleName"
            :prop="item.fieldName"
            :rules="
              item.requireAble
                ? [
                    {
                      required: true,
                      trigger: 'blur',
                      key: item.titleName,
                      reg: '',
                      validator: validateEveryData,
                    },
                  ]
                : []
            "
          >
            <el-input
              type="number"
              clearable
              v-model="form[item.fieldName]"
            ></el-input>
          </el-form-item>
          <!-- password 类型 -->
          <el-form-item
            :key="index"
            v-if="item.fontendType == 'password'"
            :label="item.titleName"
            :prop="item.fieldName"
            :rules="
              item.requireAble
                ? [
                    {
                      required: true,
                      trigger: 'blur',
                      key: item.titleName,
                      field: item.fieldName,
                      reg: item.reg,
                      regMsg: item.regMsg,
                      validator:
                        item.fieldName == 'checkPassword'
                          ? validatePass2
                          : validateEveryData,
                    },
                  ]
                : []
            "
          >
            <el-input
              clearable
              type="password"
              v-model="form[item.fieldName]"
            ></el-input>
          </el-form-item>
          <!-- 邮箱 -->
          <el-form-item
            :key="index"
            v-if="item.fontendType == 'email'"
            :label="item.titleName"
            :prop="item.fieldName"
            :rules="
              item.requireAble
                ? [
                    {
                      required: true,
                      trigger: 'blur',
                      key: item.titleName,
                      reg: '',
                      validator:
                        item.fieldName == 'email' ? email2 : validateEveryData,
                    },
                  ]
                : []
            "
          >
            <el-input
              placeholder="请输入"
              clearable
              v-model="form[item.fieldName]"
            ></el-input>
          </el-form-item>
          <!-- select 类型 -->
          <el-form-item
            class="searchSelect"
            :key="index"
            v-if="item.fontendType == 'select'"
            :label="item.titleName"
            :prop="item.fieldName"
            :rules="
              item.requireAble
                ? [
                    {
                      required: true,
                      trigger: 'blur',
                      key: item.titleName,
                      reg: '',
                      validator: validateEveryData,
                    },
                  ]
                : []
            "
          >
            <el-select
              style="width: 100%"
              clearable
              v-model="form[item.fieldName]"
              :placeholder="'请选择' + item.titleName"
            >
              <el-option
                v-for="(opt, opI) in EnumList[item.enumTypeId]"
                :key="opI"
                :label="opt.name"
                :value="opt.enumValue"
              ></el-option>
            </el-select>
          </el-form-item>
          <!-- selectFTA 类型 -->
          <el-form-item
            class="searchSelect"
            :key="index"
            v-if="item.fontendType == 'selectFTA'"
            :label="item.titleName"
            :prop="item.fieldName"
            :rules="
              item.requireAble
                ? [
                    {
                      required: true,
                      trigger: 'blur',
                      key: item.titleName,
                      reg: '',
                      validator: validateEveryData,
                    },
                  ]
                : []
            "
          >
            <el-select
              style="width: 100%"
              clearable
              v-model="form[item.fieldName]"
              :placeholder="'请选择' + item.titleName"
              @visible-change="selectFTAChange(item)"
            >
              <el-option
                v-for="(opt, opI) in selectFTAData"
                :key="opI"
                :label="opt[item.relatedFieldName]"
                :value="opt.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <!-- selectTree 类型 -->
          <el-form-item
            class="searchSelect"
            :key="index"
            v-if="item.fontendType == 'selectTree'"
            :label="item.titleName"
            :prop="item.fieldName"
            :rules="
              item.requireAble
                ? [
                    {
                      required: true,
                      trigger: 'blur',
                      key: item.titleName,
                      fontendType: item.fontendType,
                      field: item.fieldName,
                      reg: '',
                      validator: validateEveryData,
                    },
                  ]
                : []
            "
          >
            <el-select
              style="width: 100%"
              clearable
              v-model="form[item.fieldName]"
              :placeholder="'请选择' + item.titleName"
              @clear="
                treeName = '';
                treeId = '';
                treeShow = '';
              "
              @visible-change="
                treeSelectChange(item);
                treeShow = true;
              "
            >
              <el-option
                v-for="(opt, opI) in treeOption"
                style="display: none"
                :key="opI"
                :label="opt[item.relatedFieldName]"
                :value="opt.id"
              ></el-option>
              <el-option
                v-show="treeShow"
                :label="treeName"
                :value="treeId"
                style="height: auto; padding: 0"
              >
                <el-tree
                  node-key="id"
                  :data="treeListEidt"
                  class="add_tree"
                  @current-change="treeChangeAdd"
                  :props="{
                    children: 'children',
                    label: item.relatedFieldName,
                  }"
                ></el-tree>
                <div class="tree_submit">
                  <el-button
                    type="primary"
                    style="margin-right: 15px"
                    size="mini"
                    @click="treeSumbit(item.fieldName)"
                    >确定</el-button
                  >
                </div>
              </el-option>
            </el-select>
          </el-form-item>
          <!-- searchSelect 类型 -->
          <el-form-item
            class="searchSelect"
            :key="index + item.relatedModelId"
            v-if="item.fontendType == 'searchSelect'"
            :label="item.titleName"
            :prop="item.fieldName"
            :rules="
              item.requireAble
                ? [
                    {
                      required: true,
                      trigger: 'blur',
                      key: item.titleName,
                      reg: '',
                      validator: validateEveryData,
                    },
                  ]
                : []
            "
          >
            <el-select
              style="width: 100%"
              clearable
              filterable
              remote
              reserve-keyword
              v-model="form[item.fieldName]"
              @focus="searchSelectFocus(item)"
              :remote-method="remoteMethod"
              :placeholder="'请选择' + item.titleName"
            >
              <el-option
                v-for="opt in relatedModelList[0]
                  ? relatedModelList[0][item.relatedModelId]
                  : []"
                :key="opt.id"
                :label="opt[item.relatedFieldName]"
                :value="opt.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <!--  date 类型-->
          <el-form-item
            :key="index"
            v-if="item.fontendType == 'date'"
            :label="item.titleName"
            :prop="item.fieldName"
            :rules="
              item.requireAble
                ? [
                    {
                      required: true,
                      trigger: 'blur',
                      key: item.titleName,
                      reg: '',
                      validator: validateEveryData,
                    },
                  ]
                : []
            "
          >
            <el-date-picker
              clearable
              value-format="yyyy-MM-dd"
              type="date"
              placeholder="选择日期"
              v-model="form[item.fieldName]"
            ></el-date-picker>
          </el-form-item>
          <!-- switch 类型 -->
          <el-form-item
            class="switch_item"
            :key="index"
            v-if="item.fontendType == 'switch'"
            :label="item.titleName"
            :prop="item.fieldName"
            :rules="
              item.requireAble
                ? [
                    {
                      required: true,
                      trigger: 'blur',
                      key: item.titleName,
                      fontendType: item.fontendType,
                      field: item.fieldName,
                      reg: '',
                      validator: validateEveryData,
                    },
                  ]
                : []
            "
          >
            <div style="width: 100%">
              <el-switch
                v-model="form[item.fieldName]"
                active-color="#13ce66"
                inactive-color="#f2f2f2"
              >
              </el-switch>
            </div>
          </el-form-item>
          <!-- radio 类型 -->
          <el-form-item
            class="switch_item"
            :key="index"
            v-if="item.fontendType == 'radio'"
            :label="item.titleName"
            :prop="item.fieldName"
            :rules="
              item.requireAble
                ? [
                    {
                      required: true,
                      trigger: 'blur',
                      key: item.titleName,
                      reg: '',
                      validator: validateEveryData,
                    },
                  ]
                : []
            "
          >
            <div style="width: 100%">
              <el-radio
                v-model="form[item.fieldName]"
                :label="item.titleName"
              ></el-radio>
            </div>
          </el-form-item>
        </template>
      </el-form>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button size="mini" @click="close">取 消</el-button>
      <el-button size="mini" type="primary" @click="submit()">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  props: {
    formTitles: {
      type: Array,
      default: [],
    },
    dialog: {
      type: Object,
      default: () => {
        return {
          model: false,
          title: "新增",
        };
      },
    },
    form: {
      type: Object,
      default: () => {
        return {};
      },
    },
    // EnumList:{
    //   type:Object,
    //   default:()=>{return {}}
    // }
  },
  data() {
    var validateEveryData = (rule, value, callback) => {
      console.log(rule, "/n", value);
      if (rule.reg != "") {
        if (rule.fontendType == "selectTree") {
          if (!this.form[rule.field]) {
            callback(new Error(rule.key + "不能为空"));
          } else if (!rule.reg.test(this.form[rule.field])) {
            callback(
              new Error(
                rule.key + ":" + rule.regMsg ? rule.regMsg : +"不符合要求"
              )
            );
          } else {
            callback();
          }
        } else if (!value) {
          callback(new Error(rule.key + "不能为空"));
        } else if (!rule.reg.test(value)) {
          callback(
            new Error(rule.key + ":" + rule.regMsg ? rule.regMsg : "不符合要求")
          );
        } else {
          callback();
        }
      } else if (rule.fontendType == "selectTree") {
        if (!this.form[rule.field]) {
          callback(new Error(rule.key + "不能为空"));
        } else {
          callback();
        }
      } else if (rule.fontendType == "switch") {
        if (!this.form[rule.field]) {
          this.form[rule.field] = false;
          callback();
        } else {
          callback();
        }
      } else if (value != "0" && !value) {
        callback(new Error(rule.key + "不能为空"));
        // if (value.length >= 21) {
        // callback(new Error(rule.key + "长度不能超过20个字符"));
        // } else
      } else {
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      console.log(rule, "/n", value);
      if (rule.field == "checkPassword") {
        if (!value) {
          callback(new Error("请再次输入密码"));
        } else if (value !== this.form.loginPwd) {
          callback(new Error("两次输入密码不一致!"));
        } else {
          callback();
        }
      }
    };
    let email2 = (rule, value, callback) => {
      const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/;
      if (rule.field == "email") {
        if (!value) {
          callback(new Error("请输入邮箱"));
        } else if (value.match(regEmail) == null) {
          callback(new Error("请输入合法的邮箱!"));
        } else {
          callback();
        }
      }
    };
    return {
      validateEveryData: validateEveryData, //其他验证
      validatePass2: validatePass2, //密码验证
      email2: email2, //密码验证
      // searchselect
      searchSelectItem: {},
      obj: {},
      relatedModelList: [],
      // EnumList:{}
      // selecttree
      treefieldName: "",
      treeId: "",
      treeName: "",
      treeShow: "",
      treeOption: [],
      treeListEidt: [],
      selectFTAData: [],
      defaultProps: {
        children: "children",
        label: "name",
      },
    };
  },
  computed: {},
  created() {},
  methods: {
    // 远程搜索
    async remoteMethod(query, eidtSearch) {
      console.log(query, this.obj, this.relatedModelList);
      if (query || eidtSearch) {
        let { relatedModelId, relatedModelName, relatedFieldName, nacos } =
          this.searchSelectItem;
        let data = {};
        data[relatedFieldName] = query;
        let res = await this.$api.VoListByPo(
          eidtSearch ? eidtSearch : data,
          relatedModelName,
          nacos
        );
        if (res.code == 0) {
          let that = this;
          if (!!this.obj[relatedModelId]) {
            this.obj[relatedModelId] = [];
            this.obj[relatedModelId].push(...res.data);
            if (
              this.obj[relatedModelId].length < 1 ||
              this.obj[relatedModelId][0]["name"] != "空"
            ) {
              let obj1 = {};
              obj1[relatedFieldName] = "空";
              obj1["id"] = "0";
              this.obj[relatedModelId].unshift(obj1);
            }
          }
          this.relatedModelList.push(this.obj);
          //  this.relatedModelList = new Set()
        }
      }
    },
    searchSelectFocus(item) {
      console.log(item, "item");
      this.searchSelectItem = item;
      if (this.obj[item.relatedModelId] == undefined) {
        this.obj[item.relatedModelId] = [];
        let obj1 = {};
        obj1[item.relatedFieldName] = "空";
        obj1["id"] = "0";
        this.obj[item.relatedModelId].unshift(obj1);
      }
    },
    // selectFTA事件
    async selectFTAChange(item) {
      let res = await this.$api.VoListByPo(
        {},
        item.relatedModelName,
        item.nacos
      );
      console.log("res", res);
      if (res.code == 0) {
        this.selectFTAData = res.data;
        this.selectFTAData.unshift({
          name: "空",
          id: "0",
        });
      }
    },
    //     async selectFTAChange(item) {
    //   let res = await getStateInfoListByDto({}, item.relatedModelName,);
    //   console.log("res", res);
    //   if (res.code == 0) {
    //     res.data.map((item) => {

    //     //  const stringResult = item.statusName.split('')
    //          //console.log(stringResult)
    //   this.selectFTAData= item.statusName

    //     })
    //     // this.selectFTAData = res.data;
    //     // this.selectFTAData.unshift({
    //     //   name: "空",
    //     //   id: "0",
    //     // });
    //   }
    // },
    // selectTree事件
    async treeSelectChange(item) {
      console.log(item);
      if (this.obj[item.relatedModelId] == undefined) {
        this.obj[item.relatedModelId] = [];
      }
      let result = await this.$api.VoListByPo({}, item.relatedModelName);
      if (result.code == 0) {
        console.log("result", result);
        this.treeOption = result.data;
        this.treeOption.unshift({
          name: "空",
          id: "0",
        });
      }
      let res = await this.$api.getVoTree({}, item.relatedModelName);
      if (res.code == 0) {
        let that = this;
        this.treeListEidt = res.data;
        this.treeListEidt.unshift({
          name: "空",
          id: "0",
        });
      }
    },
    // 树节点点击
    treeChangeAdd(data, node) {
      this.treeId = data.id;
      this.treeName = data.name;
      // this.add.data.typeId = data.id;
      console.log(data, node);
    },
    async treeSumbit(fieldName) {
      // this.add.data.typeId = this.treeId;
      this.treefieldName = fieldName;
      if (!this.form[fieldName]) {
        this.form[fieldName] = this.treeId;
        this.treeShow = false;
        console.log(fieldName, this.form);
      }
    },
    // 弹窗确定事件
    async submit() {
      let valid = await this.$refs.form.validate().catch((err) => {});
      console.log("valid", valid);
      if (valid) {
        this.searchSelectItem = {};
        this.obj = {};
        this.relatedModelList = [];
        this.$emit("submit", this.form);
      }
    },
    // 弹窗关闭事件
    close() {
      this.searchSelectItem = {};
      this.obj = {};
      this.relatedModelList = [];
      this.$refs.form.clearValidate();
      this.$emit("close", "edit");
    },
  },
};
</script>

<style lang="less" scoped>
/deep/.el-dialog__header {
  border-bottom: 2px solid #e9e9e9;
  font-family: ".PingFang SC";
  font-style: normal;
  font-weight: 600;
  font-size: 16px;
  color: #000000;
  padding-bottom: 16px;
  padding-top: 16px;

  display: flex;
  align-items: center;
  justify-content: space-between;
  /deep/.el-dialog__headerbtn {
    height: 16px;
    width: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    position: unset;
  }
  /deep/.el-dialog__close {
    font-size: 18px;
  }
}
/deep/.el-dialog__footer {
  border-top: 2px solid #e9e9e9;
  padding-bottom: 12px;
  padding-top: 12px;
}
/deep/.el-form {
  display: flex;
  flex-wrap: wrap;
  /deep/.el-select,
  /deep/.el-date-editor {
    width: 100% !important;
  }
  .el-form-item {
    width: 44%;
    margin: 0 3% 2%;
  }
}

.table_box {
  width: 100% !important;
  height: 100% !important;
  position: relative;
  /deep/.el-table {
    position: absolute;
    width: 100% !important;
    height: calc(100% - 50px) !important;
  }
  /deep/ .el-table__body-wrapper,
  /deep/.el-table__fixed-body-wrapper {
    height: calc(100% - 50px) !important;
  }
  /deep/.el-table__fixed-body-wrapper {
    top: 48px !important;
  }
  .table_page {
    width: 100%;
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    bottom: 0;
  }
}

.add_tree {
  padding-bottom: 40px;
  z-index: 10;
  background: #fff;
  /deep/.el-tree-node__label {
    font-family: ".PingFang SC";
    font-style: normal;
    font-weight: normal;
    font-size: 14px;
    line-height: 14px;
    text-transform: capitalize;
    color: #333333;
  }
}
.tree_submit {
  width: 100%;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  z-index: 11;
  background: #fff;
}
.switch_item {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  /deep/.el-form-item__content {
    width: 100%;
  }
}
.searchSelect {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  /deep/.el-form-item__content {
    width: 100%;
  }
}
</style>