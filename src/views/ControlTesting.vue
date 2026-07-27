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
          operationW="220"
        >
          <template v-for="title in tableTitles" :slot="title.fieldName" slot-scope="{ row }">
            <div :key="title.fieldName" v-if="editingRow === row">
              <el-input
                v-model="row[title.fieldName]"
                size="small"
                style="width: 100%"
              />
            </div>
            <div :key="title.fieldName" v-else>
              {{ row[title.fieldName] }}
            </div>
          </template>

          <div slot="btn_edit" slot-scope="{ row }" class="cm-op-actions">
            <el-button
              type="text"
              size="small"
              class="cm-op-link"
              @click="editRow(row)"
            >
              {{ editingRow === row ? 'Save' : 'Edit' }}
            </el-button>
            <span class="cm-op-sep">|</span>
            <el-button
              v-if="editingRow === row"
              type="text"
              size="small"
              class="cm-op-muted"
              @click="cancelEdit"
            >
              Cancel
            </el-button>
            <el-button
              v-else
              type="text"
              size="small"
              class="cm-op-link"
              @click="openFileDialog"
            >
              Upload
            </el-button>
            <span class="cm-op-sep">|</span>
            <el-button
              type="text"
              size="small"
              class="cm-op-danger"
              @click="confirmDelete(row)"
            >
              Delete
            </el-button>
          </div>
        </Vxetable>
      </div>
    </div>

    <FileManagement :visible="fileDialogVisible" @update:visible="fileDialogVisible = $event" />
  </div>
</template>

<script>
import FileManagement from '@/components/FileManagement/index.vue';

export default {
  name: "ControlTesting",
  components: {
    FileManagement
  },
  data() {
    return {
      options: [
        { value: "2022/02/23", label: "2022/02/23" },
        { value: "2023/02/23", label: "2023/02/23" },
        { value: "2024/02/23", label: "2024/02/23" },
        { value: "2025/02/23", label: "2025/02/23" },
        { value: "2026/02/23", label: "2026/02/23" },
      ],
      value: "2026/02/23",
      editingRow: null,
      originalData: null,
      fileDialogVisible: false,
      tableTitles: [
        { fieldName: "ProjectName", titleName: "Project Name", fontendType: "slot" },
        { fieldName: "Type", titleName: "Type", fontendType: "slot" },
        { fieldName: "Version", titleName: "Version", fontendType: "slot" },
        { fieldName: "GapsNumber", titleName: "Gaps", fontendType: "slot" },
        { fieldName: "LastModifiedDate", titleName: "Last Modified", fontendType: "slot" },
        { fieldName: "Status", titleName: "Status", fontendType: "slot" },
        { fieldName: "StartDate", titleName: "Start Date", fontendType: "slot" },
        { fieldName: "EndDate", titleName: "End Date", fontendType: "slot" },
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
    remove(row) {
      this.$message.success("Deleted successfully");
    },
    openFileDialog() {
      this.fileDialogVisible = true;
    },
    editRow(row) {
      if (this.editingRow === row) {
        this.saveRow();
      } else {
        this.cancelEdit();
        this.editingRow = row;
        this.originalData = JSON.parse(JSON.stringify(row));
      }
    },
    saveRow() {
      if (this.editingRow) {
        this.$message.success("Saved successfully");
        this.editingRow = null;
        this.originalData = null;
      }
    },
    cancelEdit() {
      if (this.editingRow && this.originalData) {
        Object.assign(this.editingRow, this.originalData);
        this.editingRow = null;
        this.originalData = null;
      }
    },
    confirmDelete(row) {
      this.$confirm("Confirm delete this record?", "Tip", {
        confirmButtonText: "OK",
        cancelButtonText: "Cancel",
        type: "warning",
      })
        .then(() => {
          this.remove(row);
        })
        .catch(() => {});
    },
  },
};
</script>

<style lang="less" scoped>
</style>
