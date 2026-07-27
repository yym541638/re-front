<template>
  <el-dialog
    :close-on-click-modal="false"
    :title="dialog.title"
    :visible.sync="dialog.model"
    :width="width ? width : dialog.row == 1 || !dialog.row ? '50%' : '50%'"
    @close="close"
    top="5vh"
    v-dragModal
  >
    <!-- 提示信息 -->
    <div
      v-if="dialog.tootip"
      :style="
        dialog.tootipColor
          ? 'color:' +
            dialog.tootipColor +
            ';background:' +
            dialog.tootipBgColor +
            ';'
          : 'color: #3166f2;background: rgba(49, 102, 242, 0.06);'
      "
      class="dialog_tootip"
      v-html="dialog.tootip"
    >
      {{ dialog.tootip }}
    </div>

    <el-form
      ref="form"
      :style="dialog.row == 1 || !dialog.row ? 'padding:32px 56px 0' : ''"
      :model="form"
      label-width="130px"
      label-position="left"
    >
      <template v-for="(item, index) in formTitles">
        <!-- slotFTA 类型 不带el-form-item-->
        <slot :name="item.fieldName + 'item'" :item="item"> </slot>
        <!-- slot 类型 -->
        <el-form-item
          :style="dialog.row == 1 || !dialog.row ? 'width:100%' : 'width:40%'"
          :key="index"
          v-if="item.fontendType == 'slot'"
          :label="item.titleName + '：'"
          :prop="item.fieldName"
          :rules="
            item.requireAble
              ? [
                  {
                    required: true,
                    trigger: 'blur',
                    key: item.titleName,
                    reg: '',
                    value: form[item.fieldName],
                    validator: validateEveryData,
                  },
                ]
              : []
          "
        >
          <slot :name="item.fieldName" :item="item"> </slot>
        </el-form-item>
        <!-- numunit 类型 带单位的数字-->
        <el-form-item
          :style="dialog.row == 1 || !dialog.row ? 'width:100%' : 'width:40%'"
          :key="index"
          v-if="item.fontendType == 'numunit'"
          :label="item.titleName + '：'"
          :prop="item.fieldName"
          :rules="
            item.requireAble
              ? [
                  {
                    required: true,
                    trigger: 'blur',
                    key: item.titleName,
                    reg: '',
                    value: form[item.fieldName],
                    validator: validateEveryData,
                  },
                  {
                    pattern: /^-?\d+(.\d{1,2})?$/,
                    message: '只可以输入数字，最多两位小数',
                  },
                ]
              : [
                  {
                    pattern: /^-?\d+(.\d{1,2})?$/,
                    message: '只可以输入数字，最多两位小数',
                  },
                ]
          "
        >
          <div class="add_unit">
            <el-input
              type="number"
              style="width: 100%"
              :disabled="item.disabled"
              :placeholder="'请输入' + item.titleName"
              :clearable="!item.disabled"
              v-model="form[item.fieldName]"
            ></el-input>
            <span class="unit">{{ item.unit }}</span>
          </div>
        </el-form-item>
        <!--  numunitTwo 类型 只能输入正整数 -->
        <el-form-item
          :style="dialog.row == 1 || !dialog.row ? 'width:100%' : 'width:40%'"
          :key="index"
          v-if="item.fontendType == 'numunitTwo'"
          :label="item.titleName + '：'"
          :prop="item.fieldName"
          :rules="
            item.requireAble
              ? [
                  {
                    required: true,
                    trigger: 'blur',
                    key: item.titleName,
                    reg: '',
                    value: form[item.fieldName],
                    validator: validateEveryData,
                  },
                  {
                    pattern: /^[0-9]*[1-9][0-9]*$/,
                    message: '只能输入正整数',
                  },
                ]
              : [
                  {
                    pattern: /^[0-9]*[1-9][0-9]*$/,
                    message: '只能输入正整数',
                  },
                ]
          "
        >
          <div class="add_unit">
            <el-input
              type="number"
              style="width: 100%"
              :disabled="item.disabled"
              :placeholder="'请输入' + item.titleName"
              :clearable="!item.disabled"
              v-model="form[item.fieldName]"
            ></el-input>
            <span class="unit">{{ item.unit }}</span>
          </div>
        </el-form-item>
        <!-- text 类型 -->
        <el-form-item
          :style="dialog.row == 1 || !dialog.row ? 'width:100%' : 'width:40%'"
          :key="index"
          v-if="item.fontendType == 'text'"
          :label="item.titleName + '：'"
          :prop="item.fieldName"
          :rules="
            item.requireAble
              ? [
                  {
                    required: true,
                    trigger: 'blur',
                    key: item.titleName,
                    reg: '',
                    value: form[item.fieldName],
                    validator: validateEveryData,
                  },
                ]
              : []
          "
        >
          <el-input
            show-word-limit
            :disabled="item.disabled"
            :placeholder="'请输入' + item.titleName"
            :clearable="!item.disabled"
            :maxlength="item.maxlength"
            v-model="form[item.fieldName]"
          >
          </el-input>
        </el-form-item>
        <!-- number 类型 -->
        <el-form-item
          :style="dialog.row == 1 || !dialog.row ? 'width:100%' : 'width:40%'"
          :key="index"
          v-if="item.fontendType == 'number'"
          :label="item.titleName + '：'"
          :prop="item.fieldName"
          :rules="
            item.requireAble
              ? [
                  {
                    required: true,
                    trigger: 'blur',
                    key: item.titleName,
                    reg: '',
                    fontendType: item.fontendType,
                    field: item.fieldName,
                    value: form[item.fieldName],
                    validator: validateEveryData,
                  },
                ]
              : []
          "
        >
          <el-input
            :disabled="item.disabled"
            :placeholder="'请输入' + item.titleName"
            clearable
            type="number"
            v-model="form[item.fieldName]"
            @input="forceUpdate"
          >
          </el-input>
        </el-form-item>
        <!-- textarea 类型 -->
        <el-form-item
          class="textarea"
          :key="index"
          :style="dialog.row == 1 || !dialog.row ? 'width:100%' : 'width:40%'"
          v-if="item.fontendType == 'textarea'"
          :label="item.titleName + '：'"
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
            :disabled="item.disabled"
            type="textarea"
            :placeholder="'请输入' + item.titleName"
            clearable
            :maxlength="item.maxlength"
            show-word-limit
            v-model="form[item.fieldName]"
          >
          </el-input>
        </el-form-item>
        <!-- password 类型 -->
        <el-form-item
          :key="index"
          v-if="item.fontendType == 'password'"
          :label="item.titleName + '：'"
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
                    reg: item.regMsg,
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
        <!-- textSpan 类型 -->
        <el-form-item
          :style="dialog.row == 1 || !dialog.row ? 'width:100%' : 'width:40%'"
          :key="index"
          v-if="item.fontendType == 'textSpan'"
          :label="item.titleName + '：'"
        >
          <span>{{ item.data }} 件</span>
        </el-form-item>
        <!-- textSelect 类型 -->
        <el-form-item
          :style="dialog.row == 1 || !dialog.row ? 'width:100%' : 'width:40%'"
          class="textSelect"
          :key="index"
          v-if="item.fontendType == 'textSelect'"
          :label="item.titleName + '：'"
          :prop="item.fieldName"
          placeholder="请输入"
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
            :disabled="item.disabled"
            type="number"
            clearable
            v-model="form[item.fieldName]"
          >
            <div slot="append">件</div>
            <!-- <el-select v-model="unit" slot="append" placeholder="请选择">
              <el-option label="件" value="1"></el-option>
              <el-option label="箱" value="2"></el-option>
              <el-option label="套" value="3"></el-option>
            </el-select> -->
          </el-input>
        </el-form-item>
        <!-- date 类型 -->
        <el-form-item
          :style="dialog.row == 1 || !dialog.row ? 'width:100%' : 'width:40%'"
          :key="index"
          v-if="item.fontendType == 'date'"
          :label="item.titleName + '：'"
          :prop="item.fieldName"
          :rules="
            item.requireAble
              ? [
                  {
                    required: true,
                    trigger: ['blur'],
                    key: item.titleName,
                    reg: '',
                    validator: validateEveryData,
                  },
                ]
              : []
          "
        >
          <el-date-picker
            :disabled="item.disabled"
            style="width: 100%"
            clearable
            @input="forceUpdate"
            @change="changeData(item)"
            v-model="form[item.fieldName]"
            value-format="yyyy-MM-dd"
            align="right"
            type="date"
            placeholder="选择日期"
          >
          </el-date-picker>
        </el-form-item>
        <!-- datetime -->
        <el-form-item
          :key="index"
          v-if="item.fontendType == 'datetime'"
          :label="item.titleName + '：'"
          :prop="item.fieldName"
          :rules="
            item.requireAble
              ? [
                  {
                    required: true,
                    trigger: ['blur'],
                    key: item.titleName,
                    reg: '',
                    validator: validateEveryData,
                  },
                ]
              : []
          "
        >
          <el-date-picker
            @input="forceUpdate"
            :disabled="item.disabled"
            style="width: 100%"
            clearable
            v-model="form[item.fieldName]"
            value-format="yyyy-MM-dd HH:mm:ss"
            align="right"
            type="datetime"
            placeholder="选择时间"
          >
          </el-date-picker>
        </el-form-item>
        <!-- file 类型 -->
        <el-form-item
          class="file"
          :key="index"
          v-if="item.fontendType == 'file'"
          :label="item.titleName + '：'"
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
          <el-upload
            class="avatar-uploader"
            multiple
            action="javascript:;"
            :before-upload="imgUpload"
            :fileKey="(fileKey = item.fieldName)"
            :show-file-list="false"
          >
            <i class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
          <div class="img_list">
            <!-- <div class="img_box" v-for="(item, index) in fileLsit" :key="index">
              <i
                class="el-icon-error icon"
                color="#333333;"
                @click="removeImg(index)"
              ></i>
              <img :src="item.fileUrl" alt="" />
            </div> -->
            <template v-for="(fileitem, fileindex) in fileLsit">
              <div
                class="img_box"
                v-if="
                  fileitem.type
                    ? fileitem.type.indexOf('image') != -1
                    : !fileitem.isEnclosure
                "
                :key="fileindex + 'file'"
              >
                <i
                  class="el-icon-error icon"
                  color="#333333;"
                  @click="removeImg(fileindex, fileitem.id)"
                ></i>
                <img :src="fileitem.fileUrl" alt="" />
              </div>
              <div class="file" :key="fileindex + 'file'" v-else>
                <span>{{
                  fileitem.type ? fileitem.name : fileitem.fileName
                }}</span>
                <i
                  class="el-icon-error icon"
                  color="#333333;"
                  @click="removeImg(fileindex, fileitem.id)"
                ></i>
              </div>
              <a-divider
                v-if="fileindex < fileLsit.length - 1"
                :key="fileindex + 'divider'"
                type="vertical"
              />
            </template>
          </div>
        </el-form-item>
        <!-- area 类型 -->
        <el-form-item
          :style="dialog.row == 1 || !dialog.row ? 'width:100%' : 'width:40%'"
          class="area"
          :key="index"
          v-if="item.fontendType == 'area'"
          :label="item.titleName + '：'"
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
          <el-cascader
            style="width: 100%; margin-bottom: 6px"
            v-model="value"
            :options="options"
            @change="handleChange"
            placeholder="请选择省/市/区"
            :props="Props"
          ></el-cascader>
          <el-input
            style="width: 100%"
            type="textarea"
            placeholder="请填写详细地址"
            :autosize="{ minRows: 2, maxRows: 4 }"
            v-model="areaInfo"
            @change="areaInfoChange(item.fieldName)"
          >
          </el-input>
        </el-form-item>
        <!-- select 类型 -->
        <el-form-item
          class="searchSelect"
          :key="index"
          :style="dialog.row == 1 || !dialog.row ? 'width:100%' : 'width:40%'"
          v-if="item.fontendType == 'select'"
          :label="item.titleName + '：'"
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
            :disabled="item.disabled"
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
        <!-- selectData = selectvalueFTA 自定义数据 类型 -->
        <el-form-item
          :style="dialog.row == 1 || !dialog.row ? 'width:100%' : 'width:40%'"
          class="searchSelect"
          :key="index"
          v-if="item.fontendType == 'selectData'"
          :label="item.titleName + '：'"
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
            @change="changeData(item)"
            :disabled="item.disabled"
            style="width: 100%"
            clearable
            filterable
            v-model="form[item.fieldName]"
            :placeholder="'请选择' + item.titleName"
          >
            <el-option
              v-for="(opt, opI) in item.data"
              :key="opI"
              :label="opt[item.selectLabel]"
              :value="opt[item.selectValue]"
            ></el-option>
            <!-- <el-option
              v-for="(opt, opI) in item.data"
              :key="opI"
              :label="opt[item.selectLabel]"
              :value="opt[item.selectValue]"
            ></el-option> -->
          </el-select>
        </el-form-item>
        <el-form-item
          :style="dialog.row == 1 || !dialog.row ? 'width:100%' : 'width:40%'"
          class="searchSelect"
          :key="index"
          v-if="item.fontendType == 'selectcrt'"
          :label="item.titleName + '：'"
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
            v-model="form[item.fieldName]"
            placeholder="请选择"
            :disabled="item.disabled"
            @change="selectChange"
            @visible-change="visibleselectChange"
            @input="forceUpdate"
          >
            <el-option
              v-for="(opt, opI) in item.data"
              :key="opI"
              :label="opt.maintenance"
              :value="opt.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <!-- selectFTA 类型 -->
        <el-form-item
          :style="dialog.row == 1 || !dialog.row ? 'width:100%' : 'width:40%'"
          class="searchSelect"
          :key="index"
          v-if="item.fontendType == 'selectFTA'"
          :label="item.titleName + '：'"
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
            :disabled="item.disabled"
            style="width: 100%"
            clearable
            v-model="form[item.fieldName]"
            :placeholder="'请选择' + item.titleName"
            @visible-change="selectFTAChange(item, index)"
          >
            <el-option
              v-for="(opt, opI) in selectFTAData"
              :key="opI"
              :label="opt[item.selectLabel]"
              :value="opt.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <!-- selectvalueFTA =selectData 类型 -->
        <el-form-item
          :style="dialog.row == 1 || !dialog.row ? 'width:100%' : 'width:40%'"
          class="searchSelect"
          :key="index"
          v-if="item.fontendType == 'selectvalueFTA'"
          :label="item.titleName + '：'"
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
            :disabled="item.disabled"
            style="width: 100%"
            clearable
            v-model="form[item.fieldName]"
            :placeholder="'请选择' + item.titleName"
            @visible-change="selectvalueChange(item, index)"
          >
            <el-option
              v-for="(opt, opI) in item.data"
              :key="opI"
              :label="opt[item.selectLabel]"
              :value="opt[item.selectValue]"
            ></el-option>
          </el-select>
        </el-form-item>
        <!-- selectvalueMultipleFTA 类型 -->
        <el-form-item
          :style="dialog.row == 1 || !dialog.row ? 'width:100%' : 'width:40%'"
          class="searchSelect"
          :key="index"
          v-if="item.fontendType == 'selectvalueMultipleFTA'"
          :label="item.titleName + '：'"
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
            multiple
            :disabled="item.disabled"
            style="width: 100%"
            clearable
            v-model="form[item.fieldName]"
            :placeholder="'请选择' + item.titleName"
            @visible-change="selectvalueChange(item, index)"
          >
            <el-option
              v-for="(opt, opI) in item.data"
              :key="opI"
              :label="opt[item.selectLabel]"
              :value="opt[item.selectValue]"
            ></el-option>
          </el-select>
        </el-form-item>
        <!-- searchSelect 类型 -->
        <el-form-item
          class="searchSelect"
          :key="index + item.relatedModelId"
          v-if="item.fontendType == 'searchSelect'"
          :label="item.titleName + '：'"
          :prop="item.fieldName"
          :rules="
            item.requireAble
              ? [
                  {
                    required: true,
                    trigger: ['blur', 'change'],
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
            v-model="form[item.fieldName]"
            :remote-method="
              (query) => {
                searchList(query, item, index);
              }
            "
            :placeholder="'请选择' + item.titleName"
          >
            <el-option
              v-for="(opt, opI) in item.data"
              :key="opI"
              :label="opt[item.selectLabel]"
              :value="opt[item.selectValue]"
            ></el-option>
          </el-select>
        </el-form-item>
        <!-- searchSelectmultiple  类型-->
        <el-form-item
          class="searchSelect"
          :key="index"
          v-if="item.fontendType == 'searchSelectMultiple'"
          :label="item.titleName + '：'"
          :prop="item.fieldName"
          :rules="
            item.requireAble
              ? [
                  {
                    required: true,
                    trigger: ['blur', 'change'],
                    key: item.titleName,
                    reg: '',
                    validator: validateEveryData,
                  },
                ]
              : []
          "
        >
          <!-- <el-select
            multiple
            style="width: 100%"
            clearable
            filterable
            remote
            v-model="form[item.fieldName]"
            :remote-method="
              (query) => {
                searchList(query, item, index);
              }
            "
            :placeholder="'请选择' + item.titleName"
          >
            <el-option
              v-for="(opt, opI) in item.data"
              :key="opI"
              :label="opt[item.selectLabel]"
              :value="opt[item.selectValue]"
            ></el-option>
          </el-select> -->
        </el-form-item>
        <!-- selectDataFTA 类型 【废弃】 -->
        <el-form-item
          :style="dialog.row == 1 || !dialog.row ? 'width:100%' : 'width:40%'"
          class="searchSelect"
          :key="index"
          v-if="item.fontendType == 'selectDataFTA'"
          :label="item.titleName + '：'"
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
            :disabled="item.disabled"
            style="width: 100%"
            clearable
            v-model="form[item.fieldName]"
            :placeholder="'请选择' + item.titleName"
            @visible-change="selectDataFTAChange(item, index)"
          >
            <el-option
              v-for="(opt, opI) in selectFTAData"
              :key="opI"
              :label="opt[item.selectLabel]"
              :value="opt[item.selectValue]"
            ></el-option>
          </el-select>
        </el-form-item>
        <!-- cascaderData 类型 -->
        <el-form-item
          :style="dialog.row == 1 || !dialog.row ? 'width:100%' : 'width:40%'"
          class="searchSelect"
          :key="index"
          v-if="item.fontendType == 'cascaderData'"
          :label="item.titleName + '：'"
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
          <el-cascader
            :disabled="item.disabled"
            style="width: 100%"
            :show-all-levels="false"
            v-model="form[item.fieldName]"
            :options="cascaderOptions"
            :props="{
              //联级选择
              value: item.selectLabel,
              label: item.selectLabel,
              children: item.selectValue,
            }"
            :placeholder="'请选择' + item.titleName"
            @visible-change="cascaderFTAChange(item, index)"
          >
          </el-cascader>
        </el-form-item>
        <!-- radio 类型 -->
        <el-form-item
          class="switch_item"
          :key="index"
          v-if="item.fontendType == 'radio'"
          :label="item.titleName"
          :prop="item.fieldName"
        >
          <div style="width: 100%">
            <el-radio
              :disabled="item.disabled"
              v-for="(radio, radioIn) in item.data"
              :key="radioIn"
              v-model="form[item.fieldName]"
              :label="radio.value"
              >{{ radio.name }}</el-radio
            >
          </div>
        </el-form-item>
        <!-- switch 类型 -->
        <el-form-item
          class="switch_item"
          :key="index"
          v-if="item.fontendType == 'switch'"
          :label="item.titleName + '：'"
          :prop="item.fieldName"
        >
          <div style="width: 100%">
            <el-switch
              :active-value="1"
              :inactive-value="0"
              v-model="form[item.fieldName]"
              active-color="#5F95F7"
              inactive-color="#f2f2f2"
            >
            </el-switch>
          </div>
        </el-form-item>
        <!-- table -->
        <el-form-item
          :style="dialog.row == 1 || !dialog.row ? 'width:100%' : 'width:40%'"
          class="table"
          :key="index"
          v-if="item.fontendType == 'table'"
          :label="item.titleName + '：'"
        >
          <el-table
            border
            :data="item.data"
            height="auto"
            max-height="400px"
            style="width: 100%"
            :show-header="false"
          >
            <el-table-column type="index" width="80"> </el-table-column>
            <template v-for="(key, ketIn) in item.formTitles">
              <el-table-column
                v-if="key.fontendType != 'slot'"
                :key="ketIn"
                :prop="key.fieldName"
              >
              </el-table-column>
              <el-table-column
                v-if="key.fontendType == 'slot'"
                :key="ketIn"
                :prop="key.fieldName"
              >
                <template slot-scope="{ row }">
                  <slot :name="key.fieldName" :data="row"> </slot>
                </template>
              </el-table-column>
            </template>
          </el-table>
        </el-form-item>
      </template>
      <slot name="model"> </slot>
    </el-form>
    <slot name="model-FTA"> </slot>
    <slot name="model-footer"> </slot>
    <span slot="footer" v-if="footer" class="dialog-footer">
      <div style="display: flex; justify-content: flex-end">
        <el-button size="mini" @click="close()">{{
          dialog.leftBtn ? dialog.leftBtn : "取消"
        }}</el-button>
        <el-button
          v-if="rightBtnShow"
          style="margin-right: 10px"
          size="mini"
          :plain="dialog.plain ? dialog.plain : false"
          :type="dialog.rightBtnType ? dialog.rightBtnType : 'primary'"
          @click="submit()"
          >{{ dialog.rightBtn ? dialog.rightBtn : "确 定" }}</el-button
        >
        <slot class="slot" name="right_btn"></slot>
      </div>
    </span>
  </el-dialog>
</template>
 
<script>
import area from "./area.js";

export default {
  props: {
    footer: {
      type: Boolean,
      default: () => {
        return true;
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
          tootip: "", //提示信息
          tootipColor: "#3166f2", //背景色
          tootipBgColor: "",
          rightBtn: "", //自定义确认按钮
          rightBtnType: "", //按钮类型
          leftBtn: "", //自定义取消按钮
          plain: false, //
          row: 1,
        };
      },
    },
    rightBtnShow: {
      type: Boolean,
      default: () => {
        return true;
      },
    },
    formTitles: {
      type: Array,
      default: () => {
        return []; //自定义
        /**
         * fontendType 类型
         * titleName 标题
         * fieldName 绑定字段
         * reg 正则校验
         * regMsg 正则信息提示
         * data 动态数据
         * selectLabel 下拉动态字段
         * selectValue 下拉绑定值
         * selectChild tree结构的子集列表
         * searchKey 后端自定义枚举表搜索字段
         * searchValue 后端自定义枚举表搜索传值
         * requireAble 是否验证
         */
      },
    },
    slotBtn: {
      type: Number,
      default: () => {
        return 1;
      },
    },
    form: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  data() {
    // var validateEveryData = (rule, value, callback) => {
    //   console.log(value);
    //   if (!isNaN(value)) value += "";
    //   if (rule.reg != "") {
    //     if (rule.fontendType == "selectTree") {
    //       if (!this.form[rule.field]) {
    //         callback(new Error(rule.key + "不能为空"));
    //       } else if (!rule.reg.test(this.form[rule.field])) {
    //         callback(new Error(rule.key + "不符合要求"));
    //       } else {
    //         callback();
    //       }
    //     } else if (!value) {
    //       callback(new Error(rule.key + "不能为空"));
    //     } else if (!rule.reg.test(value)) {
    //       callback(new Error(rule.key + "不符合要求"));
    //     } else {
    //       callback();
    //     }
    //   } else if (rule.fontendType == "selectTree") {
    //     if (!this.form[rule.field]) {
    //       callback(new Error(rule.key + "不能为空"));
    //     } else {
    //       callback();
    //     }
    //   } else if (rule.fontendType == "select") {
    //     if (!this.form[rule.field]) {
    //       callback(new Error(rule.key + "不能为空"));
    //     } else {
    //       callback();
    //     }
    //   } else if (rule.fontendType == "switch") {
    //     if (!this.form[rule.field]) {
    //       this.form[rule.field] = false;
    //       callback();
    //     } else {
    //       callback();
    //     }
    //   } else if (rule.fontendType == "radio") {
    //     if (!this.form[rule.field]) {
    //       this.form[rule.field] = false;
    //       callback();
    //     } else {
    //       callback();
    //     }
    //   } else if (rule.fontendType == "number") {
    //     if (!this.form[rule.field]) {
    //       callback(new Error(rule.key + "不能为空"));
    //     } else if (value.indexOf(".") != -1) {
    //       let numstr = value.substring(value.indexOf(".") + 1);
    //       if (numstr.length > 2) {
    //         callback(new Error(rule.key + "不能超过两位小数"));
    //       }
    //     } else {
    //       callback();
    //     }
    //   } else if (!value || value == "null") {
    //     callback(new Error(rule.key + "不能为空"));
    //   } else {
    //     callback();
    //   }
    // };
    var validateEveryData = (rule, value, callback) => {
      console.log(rule, "/n", value);
      if (rule.reg != "") {
        if (rule.fontendType == "selectTree") {
          if (!this.form[rule.field]) {
            callback(new Error(rule.key + "不能为空"));
          } else if (!rule.reg.test(this.form[rule.field])) {
            callback(new Error(rule.key + "不符合要求"));
          } else {
            callback();
          }
        } else if (!value) {
          callback(new Error(rule.key + "不能为空"));
        } else if (!rule.reg.test(value)) {
          callback(new Error(rule.key + "不符合要求"));
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
    return {
      validateEveryData: validateEveryData, //其他验证
      validatePass2: validatePass2, //密码验证
      selectData: {},
      areaState: false,
      unit: "1", //单位
      value: [],
      areaInfo: "",
      sendArea: "",
      options: area.arrAll,
      Props: {
        value: "label",
        label: "label",
        children: "children",
      },
      cascaderOptions: [],
      fileKey: "", //上传文件的key
      fileLsit: [],
      selectFTAData: [],
      selectValueFTAData: [],
      removeIds: [], //文件删除的id
    };
  },
  watch: {
    slotBtn(val) {
      console.log(val);
      if (val) {
        this.submit();
      }
    },
    // form(val) {
    //   console.log("监听form", val);
    //   if (val.shippingAddress) {
    //     this.value = [
    //       val.shippingAddress.split("-")[0],
    //       val.shippingAddress.split("-")[1],
    //       val.shippingAddress.split("-")[2],
    //     ];
    //     this.areaInfo = val.shippingAddress.split("-")[3];
    //   } else if (val.multipartFiles) {
    //     console.log(val.multipartFiles);
    //     this.fileLsit = val.multipartFiles;
    //   } else {
    //     this.fileLsit = [];
    //     this.value = [];
    //     this.areaInfo = "";
    //   }
    // },
    fileLsit(val) {
      if (this.fileKey) {
        this.form[this.fileKey] = val;
      }
    },
    "form.deliveryAddress"(val) {
      console.log(val);
      if (val.deliveryAddress) {
        this.value = [
          val.deliveryAddress.split("-")[0],
          val.deliveryAddress.split("-")[1],
          val.deliveryAddress.split("-")[2],
        ];
        this.areaInfo = val.deliveryAddress.split("-")[3];
      } else {
        this.value = [];
        this.areaInfo = "";
      }
    },
    async submitState(val) {
      console.log(val);
      if (val) {
        let valid = await this.$refs.form.validate().catch((err) => {});
        if (valid) {
          this.$emit("submit", this.sendForm);
        }
      }
    },
    deep: true,
  },

  methods: {
    areaInfoChange(key) {
      if (key) {
        this.form[key] = this.sendArea += this.areaInfo;
      }
    },
    // 上传图片
    async imgUpload(file) {
      let that = this;
      console.log("12121", file);
      file.fileUrl = this.convertSrc(file);
      if (this.fileKey) {
        this.form[this.fileKey] = [];
        // this.$nextTick(() => {
        //   that.form[this.fileKey].push(file);
        // });
        this.fileLsit.push(file);
      }
    },
    // 删除图片
    removeImg(index, id) {
      if (this.fileLsit.length > 0) {
        this.fileLsit.splice(index, 1);
        if (id) {
          this.removeIds.push(id);
        }
      }
      // if (this.form["storageFiles"].length > 0) {
      //   this.form["storageFiles"].splice(index, 1);
      // }
    },
    //生成本地文件路径
    convertSrc(file) {
      let URL = window.URL || window.webkitURL;
      return URL.createObjectURL(file);
    },
    // 地址
    area(value) {
      this.areaState = true;
      this.form.deliveryAddress = value;
    },
    handleChange(value) {
      console.log(value);
      this.sendArea = value.join("-") + "-";
      // this.$emit("area", this.sendArea);
    },
    // selectFTA事件
    async selectFTAChange(item, index) {
      console.log(item);
      let res = await this.$api.VoListByPo(
        {},
        item.relatedModelName,
        item.nacos
      );
      console.log("res", res);
      if (res.code == 0) {
        this.formTitles[index]["data"] = res.data;
        this.selectFTAData = res.data;
        console.log("444", this.selectFTAData);
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
    //selectvalueFTA||selectvalueMultipleFTA事件
    async selectvalueChange(item, index) {
      console.log(item);
      let params = {};
      if (item.relatedFieldName && item.propName) {
        params[item.relatedFieldName] = item.propName;
      }
      let res = await this.$api.VoListByPo(
        params,
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
    //searchSelect 远程搜索
    async searchList(query, item, index) {
      let obj = {};
      obj[item.relatedFieldName] = query;
      let res = await this.$api.VoListByPo(
        obj,
        item.relatedModelName,
        item.nacos
      );
      if (res.code == 0) {
        let formTitles = this.formTitles;
        formTitles[index]["data"] = res.data;
        this.formTitles = Object.assign([], formTitles);
      }
    },
    // selectDataFTA事件
    async selectDataFTAChange(item, index) {
      let res = await this.$api.VoListByPo(
        { statusType: "0" },
        item.relatedModelName,
        item.nacos
      );
      console.log("res", res);
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
    selectChange(item) {
      console.log("&&&&&&&&&&&&", item);
      this.$emit("selectChange", item);
    },
    //苏新恺临时添加
    changeData(item) {
      console.log("123456777", item.data);
      this.$emit("changeData", item.data);
    },
    visibleselectChange() {
      this.forceUpdate();
    },
    forceUpdate() {
      console.log("强制刷新");
      this.$forceUpdate();
    },
    // 弹窗关闭事件
    close() {
      this.dialog.model = false;
      this.fileLsit = [];
      this.$refs.form.clearValidate();
      this.$refs.form.resetFields();
      this.$emit("close", "model");
    },
    // 弹窗确定事件
    async submit() {
      let valid = await this.$refs.form.validate().catch((err) => {});
      if (valid) {
        if (this.removeIds.length > 0) {
          this.form["removeIds"] = this.removeIds;
        }

        this.$emit("submit", this.form);
      }
    },
  },
  created() {},
};
</script>
 
<style lang="less" scoped>
/deep/.el-dialog__header {
  border-bottom: 1px solid #e9e9e9;
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
  padding: 0 0 56px 0;
  .dialog_tootip {
    z-index: 1111;
    font-family: PingFang SC;
    font-style: normal;
    font-weight: normal;
    font-size: 14px;
    color: #3166f2;
    // background: #3166f2;
    // opacity: 0.8;
    background: rgba(49, 102, 242, 0.06);
    width: 100%;
    height: 46px;
    display: flex;
    align-items: center;
    justify-content: center;
    // margin-bottom: 24px;
  }
}
/deep/.el-dialog__footer {
  border-top: 2px solid #e9e9e9;
  padding-bottom: 12px;
  padding-top: 12px;
  display: flex;
  justify-content: center;
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
  padding-top: 32px;
  // padding-right: 50px;
  /deep/.el-select,
  /deep/.el-date-editor {
    width: 100% !important;
  }
  .el-form-item {
    width: 100%;
    margin: 0 3% 4%;
    display: flex;
    align-items: center;
    .el-form-item__label {
      width: 120px;
      height: 30px;
      font-family: PingFang SC;
      font-style: normal;
      font-weight: normal;
      font-size: 14px;
      color: #333;
    }
    .el-form-item__content {
      flex: 1;
      margin-left: 0px !important;
      .add_unit {
        display: grid;
        grid-column-gap: 10px;
        grid-template-columns: auto 46px;
        justify-content: space-between;
        box-sizing: border-box;
        .unit {
          // margin-left: 10px !important;
        }
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
</style>
