<template>
  <div class="cm-page">
    <div class="cm-page__body">
      <div class="cm-toolbar">
        <div class="cm-toolbar__left">
          <span class="cm-page-title">Operation log</span>
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
          :showHeader="true"
        />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "OperationLog",
  data() {
    return {
      tableTitles: [
        {
          fieldName: "ProjectName",
          titleName: "Operation Log",
        },
      ],
      tableData: [
        {
          ProjectName: "XXXX add new colun to initialrequest as column 37",
        },
        {
          ProjectName: "XXXX add new colun to initialrequest as column 37",
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
.cm-page-title {
  font-size: 16px;
  font-weight: 700;
  color: #0f172a;
}
</style>
