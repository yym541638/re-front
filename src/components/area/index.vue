<template>
  <div>
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
    >
    </el-input>
  </div>
</template>
<script>
import area from "./area.js";
export default {
  props: ["areaValue", "close"],
  data() {
    return {
      value: [],
      areaInfo: "",
      sendArea: "",
      options: area.arrAll,
      Props: {
        value: "label",
        label: "label",
        children: "children",
      },
    };
  },
  created() {
    if (this.areaValue) {
      this.value = [
        this.areaValue.split("-")[0],
        this.areaValue.split("-")[1],
        this.areaValue.split("-")[2],
      ];
      this.areaInfo = this.areaValue.split("-")[3];
    } else {
      this.value = [];
      this.areaInfo = "";
    }
  },
  watch: {
    areaInfo(val) {
      this.sendArea += val;
      this.$emit("area", this.sendArea);
    },
    immediate: true,
    deep: true,
  },
  methods: {
    handleChange(value) {
      console.log(value);
      this.sendArea = value.join("-") + "-";
      this.$emit("area", this.sendArea);
    },
  },
};
</script>
 
  