<template>
  <div class="cm-page">
    <div class="cm-page__body">
      <div class="cm-toolbar">
        <div class="cm-toolbar__left">
          <span class="cm-label">Version:</span>
          <el-select
            v-model="value"
            placeholder="Select version"
            class="cm-select"
          >
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </div>
        <div class="cm-toolbar__right">
          <el-button
            v-for="(item, index) in buttons"
            :key="index"
            type="primary"
            :class="item.primary ? 'cm-btn-primary' : 'cm-btn-secondary'"
            @click="clickBtn(index, item.name)"
          >
            {{ item.label }}
          </el-button>
        </div>
      </div>

      <div class="cm-table-panel">
        <Vxetable
          ref="invoiceVxeTable"
          @currentChange="VoPageListByDto"
          @sizeChange="sizeChange"
          :tablePage="tablePage"
          :tableTitles="tableTitles"
          :tableData="tableData"
          :selection="false"
          :operation="false"
        />
      </div>
    </div>

    <FileManagement
      :visible="fileDialogVisible"
      :title="fileTitle"
      @update:visible="fileDialogVisible = $event"
    />
  </div>
</template>

<script>
import FileManagement from "@/components/FileManagement/index.vue";
export default {
  name: "RcmFinal",
  components: {
    FileManagement,
  },
  data() {
    return {
      fileTitle: "Upload RCM",
      fileDialogVisible: false,
      options: [
        { value: "2022/02/23", label: "2022/02/23" },
        { value: "2023/02/23", label: "2023/02/23" },
        { value: "2024/02/23", label: "2024/02/23" },
        { value: "2025/02/23", label: "2025/02/23" },
        { value: "2026/02/23", label: "2026/02/23" },
      ],
      value: "2026/02/23",
      buttons: [
        { label: "Upload RCM", name: "", primary: true },
        { label: "Upload from Manual", name: "" },
        { label: "Manual Input", name: "RcmManual" },
        { label: "AI Generate", name: "AIGenerate" },
      ],
      tableTitles: [
        { fieldName: "ProjectName", titleName: "Project Name" },
        { fieldName: "Type", titleName: "Type" },
        { fieldName: "Version", titleName: "Version" },
        { fieldName: "GapsNumber", titleName: "Gaps" },
        { fieldName: "LastModifiedDate", titleName: "Last Modified" },
        { fieldName: "Status", titleName: "Status" },
        { fieldName: "StartDate", titleName: "Start Date" },
        { fieldName: "EndDate", titleName: "End Date" },
      ],
      tableData: [
        {
          ProjectName: "Compliance Audit",
          Type: "Type 1",
          Version: "12/15/2025",
          GapsNumber: "--",
          LastModifiedDate: "1/1/2026",
          Status: "Active/ End",
          StartDate: "12/15/2025",
          EndDate: "N/A",
        },
        {
          ProjectName: "company Name1",
          Type: "Type 1",
          Version: "12/15/2025",
          GapsNumber: "--",
          LastModifiedDate: "1/1/2026",
          Status: "Active/ End",
          StartDate: "12/15/2025",
          EndDate: "N/A",
        },
      ],
      tablePage: {
        pageIndex: 1,
        pageSize: 20,
        total: 0,
      },
    };
  },
  methods: {
    async VoPageListByDto(page) {},
    sizeChange(size) {
      this.tablePage.pageSize = size;
      this.VoPageListByDto(1);
    },

    clickBtn(index, name) {
      switch (index) {
        case 2:
        case 3:
          this.openReportDetail(name);
          break;
        case 0:
          this.fileDialogVisible = true;
      }
    },

    openReportDetail(name) {
      const newTab = {
        name: name,
        RouterName:
          name == "RcmManual"
            ? "RcmManual"
            : name == "AIGenerate"
            ? "AIGenerate"
            : "",
        id:
          name == "RcmManual"
            ? "report-detail-123"
            : name == "AIGenerate"
            ? "report-alarmRecord-123"
            : "",
      };
      const exists = this.$store.state.tagsArr.some(
        (tag) => tag.RouterName === newTab.RouterName,
      );
      if (!exists) {
        this.$store.commit("ADD_TAG", newTab);
      }
      this.$store.commit("ADD_TAG", newTab);
      this.$store.commit("SET_ACTIVE_TAB", newTab.name);
      this.$router.push({ name: newTab.RouterName });
    },
  },
};
</script>

<style lang="less" scoped>
</style>
