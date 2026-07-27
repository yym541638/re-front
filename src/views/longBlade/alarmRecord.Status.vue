<template>
  <div class="cm-page">
    <div class="cm-page__body">
      <div class="cm-toolbar">
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
  name: "AIGenerate",
  components: {
    FileManagement,
  },
  data() {
    return {
      fileTitle: "Upload RCM",
      fileDialogVisible: false,
      buttons: [
        { label: "Upload to Manual", name: "", primary: true },
        { label: "Back to RCM Final", name: "RcmFinal" },
        { label: "Back to Manual", name: "RcmManual" },
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
      editingRow: null,
      originalData: null,
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
        case 1:
        case 2:
          this.openReportDetail(name);
          break;
      }
    },

    openReportDetail(name) {
      const newTab = {
        name: name,
        RouterName:
          name == "RcmFinal"
            ? "RcmFinal"
            : name == "RcmManual"
            ? "RcmManual"
            : "",
        id:
          name == "RcmFinal"
            ? "1428549913133977601"
            : name == "RcmManual"
            ? "report-detail-123"
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
