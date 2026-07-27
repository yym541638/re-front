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
          operationW="100"
        >
          <div slot="btn_edit" slot-scope="{ row }" class="cm-op-actions">
            <el-button
              type="text"
              size="small"
              class="cm-op-link"
              @click="Edit(row)"
            >
              Edit
            </el-button>
          </div>
        </Vxetable>
      </div>

      <el-dialog
        title="Project Settings"
        :visible.sync="editDialogVisible"
        width="600px"
        custom-class="cm-dialog"
      >
        <div class="cm-dialog__body" v-if="currentRow">
          <div class="cm-dialog__field">
            <label class="cm-label">Project name</label>
            <el-input v-model="currentRow.ProjectName" />
          </div>

          <div class="cm-dialog__section">
            <label class="cm-label">Project user management</label>
            <el-table :data="userData" style="width: 100%; margin-top: 12px" border>
              <el-table-column prop="role" label="Role" width="150" />
              <el-table-column prop="name" label="Name">
                <template slot-scope="scope">
                  <el-input
                    v-if="scope.row.editing"
                    v-model="scope.row.name"
                    size="small"
                  />
                  <span v-else>{{ scope.row.name || "--" }}</span>
                </template>
              </el-table-column>
              <el-table-column prop="operation" label="Operation" width="100">
                <template slot-scope="scope">
                  <el-button
                    type="text"
                    size="small"
                    class="cm-op-link"
                    @click="toggleEdit(scope.row)"
                  >
                    {{ scope.row.editing ? "Save" : "Edit" }}
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>

        <span slot="footer" class="cm-dialog__footer">
          <el-button class="cm-btn-primary">Create</el-button>
          <el-button class="cm-btn-secondary" @click="editDialogVisible = false">
            Cancel
          </el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
export default {
  name: "ProjectSettings",
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
      editDialogVisible: false,
      currentRow: null,
      userData: [
        { role: "Administrator", name: "", operation: "edit", editing: false },
        { role: "Project Owner", name: "", operation: "edit", editing: false },
        { role: "Document Owner", name: "", operation: "edit", editing: false },
        { role: "General User", name: "", operation: "edit", editing: false },
        { role: "Test User", name: "", operation: "edit", editing: false },
        { role: "Auditor", name: "", operation: "edit", editing: false },
        { role: "Manager User 1", name: "", operation: "edit", editing: false },
      ],
    };
  },
  methods: {
    async VoPageListByDto(page) {},
    sizeChange(size) {
      this.tablePage.pageSize = size;
      this.VoPageListByDto(1);
    },
    Edit(row) {
      this.currentRow = row;
      this.editDialogVisible = true;
    },
    toggleEdit(row) {
      row.editing = !row.editing;
    },
  },
};
</script>

<style lang="less" scoped>
.cm-dialog__body {
  padding: 4px 0;
}

.cm-dialog__field {
  margin-bottom: 24px;

  .cm-label {
    display: block;
    margin-bottom: 8px;
  }
}

.cm-dialog__section {
  .cm-label {
    display: block;
  }
}

.cm-dialog__footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
</style>
