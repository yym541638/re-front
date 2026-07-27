<template>
  <div class="cm-page">
    <div class="cm-page__body">
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
  </div>
</template>

<script>
export default {
  name: "GapAnalysis",
  data() {
    return {
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
  },
};
</script>

<style lang="less" scoped>
</style>
