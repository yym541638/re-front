<template>
  <el-dialog
    :title="title"
    :visible="visible"
    @close="handleClose"
    width="760px"
    :close-on-click-modal="false"
    custom-class="file-mgmt-dialog"
  >
    <div class="file_toolbar">
      <el-button
        type="primary"
        class="btn-download"
        :loading="downloading"
        @click="handleDownloadTemplate"
      >
        Download template
      </el-button>
      <el-input
        v-model.trim="criteriaFilter"
        class="criteria_filter"
        clearable
        placeholder="Filter by relevant criteria (e.g. CC1.1)"
        @keyup.enter.native="handleFilter"
        @clear="handleFilter"
      >
        <el-button
          slot="append"
          icon="el-icon-search"
          @click="handleFilter"
        />
      </el-input>
    </div>

    <el-table :data="pagedRows" style="width: 100%" border>
      <el-table-column prop="fileNo" label="File No" width="90" align="center" />
      <el-table-column label="Files" min-width="220">
        <template slot-scope="{ row }">
          <span v-if="row.fileName" class="file_name">{{ row.fileName }}</span>
          <span v-else class="file_placeholder">Word/Excel/Pdf Only</span>
        </template>
      </el-table-column>
      <el-table-column label="Relevant criteria" min-width="160">
        <template slot-scope="{ row }">
          <span
            v-if="row.relevantCriteria"
            class="criteria_link"
            :class="{ muted: isNeutralCriteria(row.relevantCriteria) }"
            @click="filterByCriteria(row.relevantCriteria)"
          >
            {{ row.relevantCriteria }}
          </span>
          <span v-else class="file_placeholder">-</span>
        </template>
      </el-table-column>
      <el-table-column label="Operations" width="150" align="center">
        <template slot-scope="{ row }">
          <template v-if="row.fileName">
            <el-button
              type="text"
              size="small"
              class="op-view"
              @click="handleView(row)"
            >
              View
            </el-button>
            <span class="op-sep">|</span>
            <el-button
              type="text"
              size="small"
              class="op-delete"
              @click="handleDelete(row)"
            >
              delete
            </el-button>
          </template>
          <el-upload
            v-else
            class="op-upload"
            action=""
            :show-file-list="false"
            :disabled="uploading"
            accept=".doc,.docx,.xls,.xlsx,.pdf"
            :http-request="(opt) => handleUpload(opt, row)"
          >
            <el-button type="text" size="small" class="op-upload-btn">
              Upload
            </el-button>
          </el-upload>
        </template>
      </el-table-column>
    </el-table>

    <div class="file_pager">
      <el-button
        class="pager_arrow"
        icon="el-icon-arrow-left"
        :disabled="filePage.pageIndex <= 1"
        @click="handleFileCurrentChange(filePage.pageIndex - 1)"
      />
      <span class="page_hint">
        Page {{ filePage.pageIndex }} of {{ totalPages }}
      </span>
      <el-button
        class="pager_arrow"
        icon="el-icon-arrow-right"
        :disabled="filePage.pageIndex >= totalPages"
        @click="handleFileCurrentChange(filePage.pageIndex + 1)"
      />
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
const PAGE_SIZE = 10;
const ACCEPTED_EXT = /\.(pdf|doc|docx|xls|xlsx)$/i;

const mapFileRow = (item, index) => ({
  fileNo: index + 1,
  templateFileId:
    item.template_file_id ||
    item.templateFileId ||
    item.attachment_id ||
    item.attachmentId ||
    item.id ||
    null,
  fileName:
    item.file_name ||
    item.fileName ||
    item.file ||
    item.name ||
    "",
  relevantCriteria:
    item.relevant_criteria ||
    item.relevantCriteria ||
    item.cc_criteria ||
    item.ccCriteria ||
    item.relevant_work ||
    item.relevantWork ||
    "",
  fileUrl: item.file_url || item.fileUrl || item.url || "",
  raw: item,
});

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
    requestMasterId: {
      type: [String, Number],
      default: "",
    },
  },
  data() {
    return {
      fileData: [],
      filePage: {
        pageIndex: 1,
        pageSize: PAGE_SIZE,
        total: PAGE_SIZE,
      },
      criteriaFilter: "",
      loading: false,
      uploading: false,
      downloading: false,
      viewing: false,
    };
  },
  computed: {
    totalPages() {
      return Math.max(
        1,
        Math.ceil(this.filePage.total / this.filePage.pageSize) || 1,
      );
    },
    displayRows() {
      const rows = this.fileData.map((item, index) => mapFileRow(item, index));
      const minSlots = Math.max(PAGE_SIZE, rows.length);
      const padded = [...rows];
      while (padded.length < minSlots) {
        padded.push({
          fileNo: padded.length + 1,
          templateFileId: null,
          fileName: "",
          relevantCriteria: "",
          fileUrl: "",
          raw: null,
        });
      }
      return padded;
    },
    pagedRows() {
      const start = (this.filePage.pageIndex - 1) * this.filePage.pageSize;
      return this.displayRows.slice(start, start + this.filePage.pageSize);
    },
  },
  watch: {
    visible(val) {
      if (val) {
        this.filePage.pageIndex = 1;
        this.criteriaFilter = "";
        this.loadFiles();
      }
    },
    requestMasterId() {
      if (this.visible) this.loadFiles();
    },
  },
  methods: {
    isNeutralCriteria(text) {
      const lower = String(text || "").toLowerCase();
      return (
        lower.includes("unrelevant") ||
        lower.includes("irrelevant") ||
        lower.includes("pending")
      );
    },
    syncPagerTotal() {
      this.filePage.total = Math.max(PAGE_SIZE, this.displayRows.length);
      if (this.filePage.pageIndex > this.totalPages) {
        this.filePage.pageIndex = this.totalPages;
      }
    },
    handleFilter() {
      this.filePage.pageIndex = 1;
      this.loadFiles();
    },
    filterByCriteria(criteria) {
      this.criteriaFilter = String(criteria || "").trim();
      this.handleFilter();
    },
    async loadFiles() {
      if (!this.requestMasterId) {
        this.fileData = [];
        this.syncPagerTotal();
        return;
      }
      this.loading = true;
      try {
        const params = {};
        if (this.criteriaFilter) {
          params.relevantCriteria = this.criteriaFilter;
        }
        const res = await this.$api.requestMasterTemplateFiles(
          this.requestMasterId,
          params,
        );
        if (res && Number(res.code) === 0) {
          const list = Array.isArray(res.data)
            ? res.data
            : (res.data && (res.data.list || res.data.records)) || [];
          this.fileData = list;
        } else {
          this.fileData = [];
          if (res && res.message) {
            this.$message.warning(res.message);
          }
        }
      } catch (e) {
        this.fileData = [];
        this.$message.error((e && e.message) || "Load files failed");
      } finally {
        this.loading = false;
        this.syncPagerTotal();
      }
    },
    handleFileCurrentChange(page) {
      const next = Math.min(Math.max(1, page), this.totalPages);
      this.filePage.pageIndex = next;
    },
    triggerBlobDownload(blob, filename) {
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename || "download";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    },
    resolveBlob(res) {
      if (res instanceof Blob) return res;
      if (res && res.data instanceof Blob) return res.data;
      return null;
    },
    async handleDownloadTemplate() {
      this.downloading = true;
      try {
        const res = await this.$api.requestMasterDownloadTemplate({});
        const blob = this.resolveBlob(res);
        if (!blob) {
          this.$message.warning(
            (res && res.message) || "Download template failed",
          );
          return;
        }
        this.triggerBlobDownload(blob, "request-master-template.xlsx");
      } catch (e) {
        this.$message.error((e && e.message) || "Download template failed");
      } finally {
        this.downloading = false;
      }
    },
    async handleView(row) {
      if (!this.requestMasterId || !row.templateFileId) {
        this.$message.warning("Missing file id");
        return;
      }
      this.viewing = true;
      try {
        // GET /request-master/{id}/template-files/{templateFileId}/download
        const res = await this.$api.requestMasterDownloadTemplateFile(
          this.requestMasterId,
          row.templateFileId,
        );
        const blob = this.resolveBlob(res);
        if (!blob) {
          this.$message.warning((res && res.message) || "Download failed");
          return;
        }
        this.triggerBlobDownload(blob, row.fileName || "template-file");
      } catch (e) {
        this.$message.error((e && e.message) || "Download failed");
      } finally {
        this.viewing = false;
      }
    },
    async resolveUploadCriteria(row) {
      if (row && row.relevantCriteria) {
        return String(row.relevantCriteria).trim();
      }
      try {
        const { value } = await this.$prompt(
          "Enter relevant criteria (e.g. CC1.1)",
          "Upload",
          {
            confirmButtonText: "Confirm",
            cancelButtonText: "Cancel",
            inputPattern: /\S+/,
            inputErrorMessage: "Relevant criteria is required",
            inputValue: this.criteriaFilter || "",
          },
        );
        return String(value || "").trim();
      } catch (e) {
        return "";
      }
    },
    async handleUpload({ file }, row) {
      if (!this.requestMasterId) {
        this.$message.warning("Missing request master id");
        return;
      }
      if (!ACCEPTED_EXT.test(file.name || "")) {
        this.$message.warning("Word/Excel/Pdf Only");
        return;
      }
      const relevantCriteria = await this.resolveUploadCriteria(row);
      if (!relevantCriteria) return;

      this.uploading = true;
      try {
        const fd = new FormData();
        fd.append("file", file);
        fd.append("relevantCriteria", relevantCriteria);
        const res = await this.$api.requestMasterUploadTemplate(
          this.requestMasterId,
          fd,
        );
        if (res && Number(res.code) === 0) {
          this.$message.success("Uploaded successfully");
          await this.loadFiles();
        } else {
          this.$message.warning((res && res.message) || "Upload failed");
        }
      } catch (e) {
        this.$message.error((e && e.message) || "Upload failed");
      } finally {
        this.uploading = false;
      }
    },
    handleDelete(row) {
      if (!row.templateFileId) {
        this.$message.warning("Missing file id");
        return;
      }
      this.$confirm("Confirm delete this file?", "Tip", {
        confirmButtonText: "OK",
        cancelButtonText: "Cancel",
        type: "warning",
      })
        .then(async () => {
          if (!this.requestMasterId) {
            this.fileData = this.fileData.filter((item, idx) => {
              const mapped = mapFileRow(item, idx);
              return mapped.templateFileId !== row.templateFileId;
            });
            this.syncPagerTotal();
            this.$message.success("Deleted successfully");
            return;
          }
          try {
            const res = await this.$api.requestMasterDeleteTemplate(
              this.requestMasterId,
              row.templateFileId,
            );
            if (res && Number(res.code) === 0) {
              this.$message.success("Deleted successfully");
              await this.loadFiles();
            } else {
              this.$message.warning((res && res.message) || "Delete failed");
            }
          } catch (e) {
            this.$message.error((e && e.message) || "Delete failed");
          }
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
.file_toolbar {
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.criteria_filter {
  width: 320px;
  max-width: 100%;
}

.btn-download {
  background-color: #2563eb !important;
  border-color: #2563eb !important;
}

.file_name {
  color: #0f172a;
  font-size: 13px;
}

.file_placeholder {
  color: #94a3b8;
  font-size: 13px;
}

.criteria_link {
  color: #2563eb;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
}

.criteria_link.muted {
  color: #64748b;
  font-weight: 500;
}

.op-view {
  color: #2563eb !important;
  font-weight: 600;
  padding: 0 !important;
}

.op-delete {
  color: #dc2626 !important;
  font-weight: 600;
  padding: 0 !important;
}

.op-sep {
  margin: 0 4px;
  color: #cbd5e1;
}

.op-upload {
  display: inline-block;
}

.op-upload-btn {
  color: #2563eb !important;
  font-weight: 600;
  padding: 0 !important;
}

.file_pager {
  margin-top: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 18px;
}

.pager_arrow {
  width: 36px;
  height: 36px;
  padding: 0 !important;
  border-radius: 8px !important;
  border-color: #cbd5e1 !important;
  color: #64748b !important;
  background: #f8fafc !important;
}

.pager_arrow:disabled {
  opacity: 0.45;
}

.page_hint {
  color: #334155;
  font-size: 14px;
  font-weight: 600;
  min-width: 120px;
  text-align: center;
}

.btn-confirm {
  background-color: #2563eb !important;
  border-color: #2563eb !important;
  min-width: 110px;
}

.btn-cancel-green {
  background: #16a34a !important;
  border-color: #16a34a !important;
  color: #fff !important;
  min-width: 110px;
}
</style>

<style>
.file-mgmt-dialog .el-dialog__title {
  font-weight: 700;
}

.file-mgmt-dialog .el-dialog__footer {
  text-align: center;
}

.file-mgmt-dialog .dialog-footer {
  display: inline-flex;
  gap: 16px;
}
</style>
