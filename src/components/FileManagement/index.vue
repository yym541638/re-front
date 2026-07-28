<template>
  <el-dialog
    :title="title"
    :visible="visible"
    @close="handleClose"
    width="720px"
    :close-on-click-modal="false"
    custom-class="file-mgmt-dialog"
  >
    <el-table :data="pagedFiles" style="width: 100%" border>
      <el-table-column prop="fileNo" label="File No" width="90" />
      <el-table-column prop="file" label="File" min-width="200" />
      <el-table-column prop="relevantWork" label="Relevant work" min-width="160" />
      <el-table-column label="Operations" width="120">
        <template slot-scope="scope">
          <el-button
            type="text"
            size="small"
            class="op-delete"
            @click="handleDelete(scope.row)"
          >
            delete
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="file_pager">
      <el-pagination
        background
        layout="prev, pager, next"
        :current-page="filePage.pageIndex"
        :page-size="filePage.pageSize"
        :total="filePage.total"
        @current-change="handleFileCurrentChange"
      />
      <span class="page_hint">
        Page {{ filePage.pageIndex }} of {{ totalPages }}
      </span>
    </div>

    <span slot="footer" class="dialog-footer">
      <el-button type="primary" class="btn-confirm" @click="handleConfirm">
        Confirm
      </el-button>
      <el-button class="btn-cancel-green" @click="handleClose">
        Cancel
      </el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  name: "FileManagement",
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: "File management",
    },
  },
  data() {
    return {
      fileData: [
        {
          fileNo: 1,
          file: "evidence-access-review.pdf",
          relevantWork: "Access review",
        },
        {
          fileNo: 2,
          file: "policy-security.docx",
          relevantWork: "Policy update",
        },
        {
          fileNo: 3,
          file: "control-matrix.xlsx",
          relevantWork: "Control mapping",
        },
        {
          fileNo: 4,
          file: "audit-trail.pdf",
          relevantWork: "Audit support",
        },
        {
          fileNo: 5,
          file: "training-record.docx",
          relevantWork: "Awareness",
        },
        {
          fileNo: 6,
          file: "risk-register.xlsx",
          relevantWork: "Risk assessment",
        },
      ],
      filePage: {
        pageIndex: 1,
        pageSize: 3,
        total: 6,
      },
    };
  },
  computed: {
    totalPages() {
      return Math.max(
        1,
        Math.ceil(this.filePage.total / this.filePage.pageSize) || 1,
      );
    },
    pagedFiles() {
      const start =
        (this.filePage.pageIndex - 1) * this.filePage.pageSize;
      return this.fileData.slice(start, start + this.filePage.pageSize);
    },
  },
  watch: {
    visible(val) {
      if (val) {
        this.filePage.pageIndex = 1;
        this.filePage.total = this.fileData.length;
      }
    },
  },
  methods: {
    handleFileCurrentChange(page) {
      this.filePage.pageIndex = page;
    },
    handleDelete(row) {
      this.$confirm("Confirm delete this file?", "Tip", {
        confirmButtonText: "OK",
        cancelButtonText: "Cancel",
        type: "warning",
      })
        .then(() => {
          this.fileData = this.fileData.filter(
            (item) => item.fileNo !== row.fileNo,
          );
          this.filePage.total = this.fileData.length;
          const maxPage = this.totalPages;
          if (this.filePage.pageIndex > maxPage) {
            this.filePage.pageIndex = maxPage;
          }
          this.$message.success("Deleted successfully");
        })
        .catch(() => {});
    },
    handleConfirm() {
      this.$emit("confirm", this.fileData);
      this.handleClose();
    },
    handleClose() {
      this.$emit("update:visible", false);
    },
  },
};
</script>

<style scoped>
.file_pager {
  margin-top: 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.page_hint {
  color: #64748b;
  font-size: 13px;
}

.op-delete {
  color: #dc2626 !important;
  font-weight: 600;
}

.btn-confirm {
  background-color: #2563eb !important;
  border-color: #2563eb !important;
}

.btn-cancel-green {
  background: #16a34a !important;
  border-color: #16a34a !important;
  color: #fff !important;
}
</style>

<style>
.file-mgmt-dialog .el-dialog__title {
  font-weight: 700;
}
</style>
