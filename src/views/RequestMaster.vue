<template>
  <div class="cm-page">
    <div class="cm-page__body">
    <div class="cm-toolbar">
      <div class="cm-toolbar__left">
        <el-button class="cm-btn-primary" type="primary" @click="openSpec('create')">
          New
        </el-button>
      </div>
    </div>

    <div class="cm-table-panel">
      <Vxetable
        ref="requestMasterTable"
        :tablePage="tablePage"
        :tableTitles="tableTitles"
        :tableData="pagedData"
        :selection="false"
        :tablePageState="true"
        operationW="200"
        :isfixed="true"
        @currentChange="onPageChange"
        @sizeChange="onSizeChange"
      >
        <div slot="btn_edit" slot-scope="{ row }" class="cm-op-actions">
          <el-button
            type="text"
            size="small"
            class="cm-op-link"
            @click="openSpec('edit', row)"
          >
            Edit
          </el-button>
          <span class="cm-op-sep">|</span>
          <el-button
            type="text"
            size="small"
            class="cm-op-link"
            @click="enterRequest(row)"
          >
            Enter request
          </el-button>
        </div>
      </Vxetable>
    </div>
    </div>

    <el-drawer
      title="Request master specification"
      :visible.sync="drawerVisible"
      direction="rtl"
      size="420px"
      :wrapper-closable="false"
      custom-class="rm-spec-drawer"
    >
      <div class="spec_body">
        <div class="form_item">
          <label>
            Requestmaster name
            <span class="required">*</span>
          </label>
          <el-input
            v-model.trim="formData.requestMasterName"
            placeholder="Enter request master name"
            :disabled="isReadonly"
          />
        </div>

        <div class="form_item">
          <label>create date</label>
          <el-input :value="formData.createDateDisplay" disabled />
        </div>

        <div class="form_item">
          <label>RequestMasterStatus</label>
          <el-select
            v-model="formData.requestMasterStatus"
            placeholder="Select status"
            style="width: 100%"
            :disabled="isReadonly"
          >
            <el-option
              v-for="opt in statusOptions"
              :key="opt.value"
              :label="opt.label"
              :value="opt.value"
            />
          </el-select>
        </div>
      </div>

      <div class="spec_footer">
        <template v-if="specMode === 'create'">
          <el-button
            type="primary"
            class="cm-btn-primary btn-create"
            :loading="saving"
            @click="handleCreate"
          >
            Create
          </el-button>
          <el-button class="cm-btn-secondary" @click="drawerVisible = false">Cancel</el-button>
        </template>
        <template v-else>
          <el-button
            type="primary"
            class="cm-btn-primary btn-create"
            :loading="saving"
            :disabled="isReadonly"
            @click="handleUpdate"
          >
            Save
          </el-button>
          <el-button
            type="danger"
            class="btn-delete"
            :loading="deleting"
            @click="handleDelete"
          >
            Delete
          </el-button>
          <el-button @click="drawerVisible = false">Cancel</el-button>
        </template>
      </div>
    </el-drawer>
  </div>
</template>

<script>
import { setCurrentProject } from "../utils/projectContext";

const DEFAULT_STATUS_OPTIONS = [
  { value: "COMPLETED", label: "Completed" },
  { value: "CANCELLED", label: "Cancelled" },
  { value: "ACTIVE", label: "Active" },
  { value: "INACTIVE", label: "Inactive" },
];

const STATUS_SHORT = {
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
  ACTIVE: "Active",
  INACTIVE: "Inactive",
};

const emptyForm = () => ({
  requestMasterId: null,
  requestMasterName: "",
  createDate: "",
  createDateDisplay: "-",
  requestMasterStatus: "INACTIVE",
});

const nowDateTime = () => {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, "0");
  return (
    `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ` +
    `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
  );
};

export default {
  name: "RequestMaster",
  data() {
    return {
      tableTitles: [
        { fieldName: "requestId", titleName: "request ID" },
        { fieldName: "requestMasterName", titleName: "request master name" },
        {
          fieldName: "createDateDisplay",
          titleName: "request master create date",
        },
        {
          fieldName: "statusLabel",
          titleName: "RequestMasterStatus",
        },
      ],
      tableData: [],
      tablePage: {
        pageIndex: 1,
        pageSize: 20,
        total: 0,
      },
      drawerVisible: false,
      specMode: "create",
      formData: emptyForm(),
      statusOptions: DEFAULT_STATUS_OPTIONS,
      saving: false,
      deleting: false,
      resolvedProjectId: "",
      resolvedProjectName: "",
    };
  },
  computed: {
    projectId() {
      return (
        this.$route.query.projectId ||
        sessionStorage.getItem("currentProjectId") ||
        this.resolvedProjectId ||
        ""
      );
    },
    projectName() {
      return (
        this.$route.query.projectName ||
        sessionStorage.getItem("currentProjectName") ||
        this.resolvedProjectName ||
        ""
      );
    },
    pagedData() {
      const start = (this.tablePage.pageIndex - 1) * this.tablePage.pageSize;
      const end = start + this.tablePage.pageSize;
      return this.tableData.slice(start, end);
    },
    isReadonly() {
      const status = this.formData.requestMasterStatus;
      return status === "COMPLETED" || status === "CANCELLED";
    },
  },
  watch: {
    "$route.query.projectId"(val) {
      if (val) {
        this.resolvedProjectId = String(val);
        sessionStorage.setItem("currentProjectId", String(val));
      }
      this.loadList();
    },
  },
  async created() {
    await this.ensureProjectContext();
    this.loadStatusOptions();
    this.loadList();
  },
  methods: {
    persistProjectContext(projectId, projectName) {
      if (projectId) {
        this.resolvedProjectId = String(projectId);
      }
      if (projectName) {
        this.resolvedProjectName = projectName;
      }
      setCurrentProject(
        projectId || this.resolvedProjectId,
        projectName || this.resolvedProjectName,
      );
    },
    async ensureProjectContext() {
      const fromRoute = this.$route.query.projectId;
      const fromName = this.$route.query.projectName;
      if (fromRoute) {
        this.persistProjectContext(fromRoute, fromName);
        return String(fromRoute);
      }
      const cached = sessionStorage.getItem("currentProjectId");
      if (cached) {
        this.resolvedProjectId = cached;
        this.resolvedProjectName =
          sessionStorage.getItem("currentProjectName") || "";
        return cached;
      }
      // 不再默认选中第一个项目，必须从 Project overview 进入
      this.$message.warning("Please select a project first");
      this.$router.replace({ name: "ProjectOverview" });
      return "";
    },
    formatDateTime(value) {
      if (!value) return "-";
      const text = String(value).replace("T", " ").trim();
      if (text.length >= 19) return text.slice(0, 19);
      return text;
    },
    statusLabel(code) {
      if (!code) return "-";
      const key = String(code).toUpperCase();
      if (STATUS_SHORT[key]) return STATUS_SHORT[key];
      const hit = this.statusOptions.find((o) => o.value === code);
      if (!hit) return code;
      // strip "Status - explanation" to short name only
      const raw = String(hit.label || code);
      return raw.split(" - ")[0].trim() || code;
    },
    toShortStatusOptions(list) {
      return (list || []).map((item) => {
        const value = item.status || item.value || item.code;
        const key = String(value || "").toUpperCase();
        return {
          value,
          label: STATUS_SHORT[key] || String(item.label || value).split(" - ")[0].trim(),
        };
      });
    },
    mapRow(item) {
      const status =
        item.request_master_status ||
        item.requestMasterStatus ||
        item.status ||
        "";
      const createDate =
        item.request_master_create_date ||
        item.create_date ||
        item.createDate ||
        "";
      return {
        ...item,
        requestMasterId:
          item.request_master_id || item.requestMasterId || item.id,
        requestId: item.request_id || item.requestId || "-",
        requestMasterName:
          item.request_master_name || item.requestMasterName || "-",
        createDate,
        createDateDisplay: this.formatDateTime(createDate),
        requestMasterStatus: status,
        statusLabel: this.statusLabel(status),
      };
    },
    async loadStatusOptions() {
      try {
        const res = await this.$api.requestMasterStatusOptions({});
        if (res.code == 0 && Array.isArray(res.data) && res.data.length) {
          this.statusOptions = this.toShortStatusOptions(res.data);
        }
      } catch (e) {
        /* keep defaults */
      }
    },
    async loadList() {
      if (!this.projectId) {
        this.tableData = [];
        this.tablePage.total = 0;
        return;
      }
      try {
        const params = { projectId: this.projectId };
        const res = await this.$api.requestMasterList(params);
        if (res.code == 0) {
          const list = Array.isArray(res.data)
            ? res.data
            : (res.data && res.data.list) || [];
          this.tableData = list.map((item) => this.mapRow(item));
          this.tablePage.total = this.tableData.length;
          this.tablePage.pageIndex = 1;
        } else {
          this.$message.warning(res.message || "Load request master failed");
        }
      } catch (e) {
        this.$message.error((e && e.message) || "Load request master failed");
      }
    },
    onPageChange(page) {
      this.tablePage.pageIndex = page;
    },
    onSizeChange(size) {
      this.tablePage.pageSize = size;
      this.tablePage.pageIndex = 1;
    },
    openSpec(mode, row) {
      this.specMode = mode;
      if (mode === "create") {
        const now = nowDateTime();
        this.formData = emptyForm();
        this.formData.createDate = now;
        this.formData.createDateDisplay = now;
        this.drawerVisible = true;
        return;
      }
      this.formData = {
        requestMasterId: row.requestMasterId,
        requestMasterName:
          row.requestMasterName === "-" ? "" : row.requestMasterName,
        createDate: row.createDate,
        createDateDisplay: row.createDateDisplay || "-",
        requestMasterStatus: row.requestMasterStatus || "INACTIVE",
      };
      this.drawerVisible = true;
    },
    enterRequest(row) {
      const requestMasterId = row.requestMasterId;
      if (!requestMasterId) {
        this.$message.warning("Missing request master id");
        return;
      }
      const masterName =
        row.requestMasterName && row.requestMasterName !== "-"
          ? row.requestMasterName
          : "Request individual";
      sessionStorage.setItem("currentRequestMasterId", String(requestMasterId));
      sessionStorage.setItem("currentRequestMasterName", masterName);
      if (this.projectId) {
        sessionStorage.setItem("currentProjectId", String(this.projectId));
      }

      const tagName = `${masterName}-Individual`;
      const existingTag = this.$store.state.tagsArr.find(
        (tag) => tag.RouterName === "RequestIndividual",
      );
      if (existingTag) {
        const updatedTags = this.$store.state.tagsArr.map((tag) => {
          if (tag.RouterName === "RequestIndividual") {
            return { ...tag, name: tagName };
          }
          return tag;
        });
        this.$store.commit("UPDATE_TAGS", updatedTags);
      } else {
        this.$store.commit("ADD_TAG", {
          name: tagName,
          RouterName: "RequestIndividual",
          id: "1328549913133977602",
        });
      }
      this.$store.commit("SET_ACTIVE_TAB", tagName);
      this.$router.push({
        path: "/RequestIndividual",
        query: {
          requestMasterId,
          projectId: this.projectId || "",
          projectName: this.projectName || "",
          masterName,
        },
      });
    },
    async handleCreate() {
      if (!this.formData.requestMasterName) {
        this.$message.warning("Requestmaster name is required");
        return;
      }
      const projectId = await this.ensureProjectContext();
      if (!projectId) {
        this.$message.warning(
          "No project found. Please create a project in Project overview first.",
        );
        return;
      }
      this.saving = true;
      try {
        const res = await this.$api.requestMasterCreate({
          projectId: Number(projectId),
          requestMasterName: this.formData.requestMasterName,
          requestMasterStatus: this.formData.requestMasterStatus || "INACTIVE",
        });
        if (res.code == 0) {
          this.$message.success("Created successfully");
          this.drawerVisible = false;
          this.loadList();
        } else {
          this.$message.error(res.message || "Create failed");
        }
      } catch (e) {
        this.$message.error((e && e.message) || "Create failed");
      } finally {
        this.saving = false;
      }
    },
    async handleUpdate() {
      if (!this.formData.requestMasterName) {
        this.$message.warning("Requestmaster name is required");
        return;
      }
      if (this.isReadonly) {
        this.$message.warning("This status cannot be modified");
        return;
      }
      this.saving = true;
      try {
        const res = await this.$api.requestMasterUpdate(
          this.formData.requestMasterId,
          {
            requestMasterName: this.formData.requestMasterName,
            requestMasterStatus: this.formData.requestMasterStatus,
          },
        );
        if (res.code == 0) {
          this.$message.success("Saved successfully");
          this.drawerVisible = false;
          this.loadList();
        } else {
          this.$message.error(res.message || "Save failed");
        }
      } catch (e) {
        this.$message.error((e && e.message) || "Save failed");
      } finally {
        this.saving = false;
      }
    },
    handleDelete() {
      this.$confirm("Confirm delete this request master?", "Tip", {
        confirmButtonText: "OK",
        cancelButtonText: "Cancel",
        type: "warning",
      })
        .then(async () => {
          this.deleting = true;
          try {
            const res = await this.$api.requestMasterDelete(
              this.formData.requestMasterId,
            );
            if (res.code == 0) {
              this.$message.success("Deleted successfully");
              this.drawerVisible = false;
              this.loadList();
            } else {
              this.$message.error(res.message || "Delete failed");
            }
          } catch (e) {
            this.$message.error((e && e.message) || "Delete failed");
          } finally {
            this.deleting = false;
          }
        })
        .catch(() => {});
    },
  },
};
</script>

<style lang="less" scoped>
.spec_body {
  padding: 0 20px 90px;
  height: calc(100% - 60px);
  overflow-y: auto;
}

.form_item {
  margin-bottom: 18px;

  label {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 8px;
    font-weight: 600;
    color: #0f172a;
    font-size: 13px;
  }

  .required {
    color: #dc2626;
  }

  .hint {
    font-size: 11px;
    font-weight: 500;
    color: #94a3b8;
  }

  /deep/ .el-input__inner,
  /deep/ .el-textarea__inner {
    border-radius: 8px;
  }
}

.spec_footer {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 12px 20px;
  background: #fff;
  border-top: 1px solid #e2e8f0;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.btn-create {
  min-width: 88px;
}

.btn-delete {
  min-width: 88px;
}
</style>

<style>
.rm-spec-drawer .el-drawer__header {
  margin-bottom: 12px;
  padding: 16px 20px 8px;
  font-weight: 700;
  color: #0f172a;
}
</style>
