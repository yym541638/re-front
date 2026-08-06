<template>
  <div class="cm-page">
    <div class="cm-page__body">
      <div class="cm-toolbar">
        <div class="cm-toolbar__left">
          <el-button
            v-if="canCreateProject"
            class="cm-btn-primary"
            type="primary"
            @click="openSpec('create')"
          >
            New
          </el-button>
          <el-button class="cm-btn-secondary" @click="inviteCodeVisible = true">
            Invitation code
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
          operationW="260"
          :isfixed="true"
        >
          <div slot="btn_edit" slot-scope="{ row }" class="cm-op-actions">
            <el-button
              type="text"
              size="small"
              class="cm-op-link"
              @click="openSpec('view', row)"
            >
              View
            </el-button>
            <span class="cm-op-sep">|</span>
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
              class="cm-op-link cm-op-danger"
              @click="confirmDelete(row)"
            >
              Delete
            </el-button>
            <span class="cm-op-sep">|</span>
            <el-button
              type="text"
              size="small"
              class="cm-op-link"
              @click="Enter(row)"
            >
              Enter project
            </el-button>
          </div>
        </Vxetable>
      </div>
    </div>

    <!-- Project specification ???? -->
    <el-drawer
      :title="specTitle"
      :visible.sync="drawerVisible"
      direction="rtl"
      size="420px"
      :wrapper-closable="false"
      custom-class="spec-drawer"
    >
      <div class="spec_body">
        <div class="form_item">
          <label>Project name<span class="required">*</span></label>
          <el-input
            v-model="formData.projectName"
            placeholder="Enter project name"
            :disabled="specMode === 'view'"
          />
        </div>

        <div class="form_item">
          <label>Project Info</label>
          <el-input
            v-model="formData.projectInfo"
            type="textarea"
            :rows="4"
            placeholder="Enter project info"
            :disabled="specMode === 'view'"
          />
        </div>

        <div class="form_item">
          <label>Project start date<span class="required">*</span></label>
          <el-date-picker
            v-model="formData.startDate"
            type="datetime"
            value-format="yyyy-MM-dd HH:mm:ss"
            format="yyyy-MM-dd HH:mm:ss"
            placeholder="Select start date"
            style="width: 100%"
            :disabled="specMode === 'view'"
          />
        </div>

        <div class="form_item">
          <label>Project end date</label>
          <el-date-picker
            v-model="formData.endDate"
            type="datetime"
            value-format="yyyy-MM-dd HH:mm:ss"
            format="yyyy-MM-dd HH:mm:ss"
            placeholder="Select end date"
            style="width: 100%"
            :disabled="specMode === 'view'"
          />
        </div>

        <p class="access_hint">
          Manage project members and roles in
          <strong>Access management</strong>.
        </p>
      </div>

      <div class="spec_footer" v-if="specMode !== 'view'">
        <el-button type="primary" @click="handleCheck(formData)">Confirm</el-button>
        <el-button @click="drawerVisible = false">Cancel</el-button>
      </div>
      <div class="spec_footer" v-else>
        <el-button @click="drawerVisible = false">Close</el-button>
      </div>
    </el-drawer>

    <!-- Invitation code ?? -->
    <el-dialog
      title="Enter your code here"
      :visible.sync="inviteCodeVisible"
      width="420px"
      :close-on-click-modal="false"
      custom-class="invite-code-dialog"
    >
      <el-input
        v-model="inviteCode"
        type="textarea"
        :rows="5"
        placeholder="Enter your invitation code"
      />
      <div slot="footer" class="invite_footer">
        <el-button type="primary" @click="handleInviteConfirm">Confirm</el-button>
        <el-button class="btn-cancel-green" @click="inviteCodeVisible = false">
          Cancel
        </el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { isCompAdmin } from "../utils/roles";
import {
  setCurrentProject,
  ensureDefaultProject,
} from "../utils/projectContext";

const emptyForm = () => ({
  projectName: "",
  projectInfo: "",
  startDate: "",
  endDate: "",
  pictureFile: [],
});

export default {
  name: "ProjectOverview",
  data() {
    return {
      tableTitles: [
        { fieldName: "project_name", titleName: "Project Name" },
        { fieldName: "project_info", titleName: "Project Info" },
        { fieldName: "start_date", titleName: "Start Date" },
        { fieldName: "end_date", titleName: "End Date" },
        { fieldName: "last_modified_date", titleName: "Last Modified" },
      ],
      tableData: [],
      tablePage: {
        pageIndex: 1,
        pageSize: 20,
        total: 0,
      },
      drawerVisible: false,
      specMode: "create",
      editingProjectId: null,
      formData: emptyForm(),
      inviteCodeVisible: false,
      inviteCode: "",
    };
  },
  computed: {
    specTitle() {
      return "Project specification";
    },
    canCreateProject() {
      return isCompAdmin();
    },
  },
  created() {
    this.VoPageListByDto(1);
  },
  methods: {
    formatDate(value) {
      if (!value) return "-";
      const text = String(value).trim();
      if (text.length >= 10) return text.slice(0, 10);
      return text;
    },
    async VoPageListByDto(page) {
      this.tablePage.pageIndex = page;
      try {
        const res = await this.$api.projectList({
          pageSize: this.tablePage.pageSize,
          pageNum: this.tablePage.pageIndex,
        });
        if (res.code == 0) {
          const pageData = res.data || {};
          const list = pageData.list || [];
          this.tableData = list.map((item) => ({
            ...item,
            start_date: this.formatDate(item.start_date),
            end_date: this.formatDate(item.end_date),
            last_modified_date: this.formatDate(item.last_modified_date),
          }));
          this.tablePage.total =
            pageData.totalCount || pageData.total || res.total || 0;
          // 分页列表可能不完整：当前/上次不在本页时不误选本页第一条
          ensureDefaultProject(this.tableData, {
            allowReplaceMissing: false,
          });
        } else {
          this.$message.warning(res.message || "Load project list failed");
        }
      } catch (e) {
        this.$message.error((e && e.message) || "Load project list failed");
      }
    },
    sizeChange(size) {
      this.tablePage.pageSize = size;
      this.VoPageListByDto(1);
    },
    async openSpec(mode, row) {
      this.specMode = mode;
      this.editingProjectId = null;
      if (mode === "create") {
        if (!isCompAdmin()) {
          this.$message.warning("Only company administrators can create projects");
          return;
        }
        this.formData = emptyForm();
        this.drawerVisible = true;
        return;
      }

      const projectId = row && (row.project_id || row.projectId);
      if (!projectId) {
        this.$message.warning("Missing project id");
        return;
      }
      this.editingProjectId = projectId;
      try {
        const res = await this.$api.projectDetail(projectId);
        if (res.code != 0) {
          this.$message.warning(res.message || "Load project detail failed");
          return;
        }
        const detail = res.data || {};
        const project = detail.project || row;
        this.formData = {
          projectName: project.project_name || "",
          projectInfo: project.project_info || "",
          startDate: project.start_date || "",
          endDate: project.end_date || "",
          pictureFile: [],
          raw: project,
        };
        this.drawerVisible = true;
      } catch (e) {
        this.$message.error((e && e.message) || "Load project detail failed");
      }
    },
    async handleCheck(formData) {
      if (!formData.projectName) {
        this.$message.warning("Project name is required");
        return;
      }
      if (!formData.startDate) {
        this.$message.warning("Project start date is required");
        return;
      }
      // 人员与角色统一在 Access management 管理，创建/编辑项目不再提交 members
      const payload = {
        projectName: formData.projectName,
        projectInfo: formData.projectInfo || "",
        startDate: formData.startDate,
        endDate: formData.endDate || null,
      };
      try {
        let res;
        if (this.specMode === "edit" && this.editingProjectId) {
          res = await this.$api.projectUpdate(this.editingProjectId, payload);
        } else {
          res = await this.$api.projectCreate(payload);
        }
        if (res.code == 0) {
          this.$message.success(
            this.specMode === "edit"
              ? "Project updated successfully"
              : "Project created successfully",
          );
          this.drawerVisible = false;
          this.VoPageListByDto(1);
        } else {
          this.$message.error(res.message || "Save failed");
        }
      } catch (e) {
        this.$message.error((e && e.message) || "Save failed");
      }
    },
    async handleInviteConfirm() {
      if (!this.inviteCode.trim()) {
        this.$message.warning("Please enter invitation code");
        return;
      }
      try {
        const res = await this.$api.invitationCodeRedeem({
          code: this.inviteCode.trim(),
        });
        if (res.code == 0) {
          const data = res.data || {};
          this.$message.success(
            data.message || "Invitation code redeemed successfully",
          );
          this.inviteCodeVisible = false;
          this.inviteCode = "";
          this.VoPageListByDto(1);
        } else {
          this.$message.error(res.message || "Redeem failed");
        }
      } catch (e) {
        this.$message.error((e && e.message) || "Redeem failed");
      }
    },
    Enter(row) {
      const projectName = row.project_name || row.projectName;
      const projectId = row.project_id || row.projectId;
      if (!projectId) {
        this.$message.warning("Missing project id");
        return;
      }
      setCurrentProject(projectId, projectName);
      const newTagName = `${projectName}-RequestMaster`;
      const existingTag = this.$store.state.tagsArr.find(
        (tag) => tag.RouterName === "RequestMaster",
      );
      if (existingTag) {
        const updatedTags = this.$store.state.tagsArr.map((tag) => {
          if (tag.RouterName === "RequestMaster") {
            return { ...tag, name: newTagName };
          }
          return tag;
        });
        this.$store.commit("UPDATE_TAGS", updatedTags);
      } else {
        this.$store.commit("ADD_TAG", {
          name: newTagName,
          RouterName: "RequestMaster",
          id: "1428549913133977602",
        });
      }
      this.$store.commit("SET_ACTIVE_TAB", newTagName);
      this.$router.push({
        name: "RequestMaster",
        query: {
          projectName: projectName,
          projectId: projectId,
        },
      });
    },
    async remove(row) {
      const projectId = row && (row.project_id || row.projectId);
      if (!projectId) {
        this.$message.warning("Missing project id");
        return;
      }
      try {
        const res = await this.$api.projectDelete(projectId);
        if (res.code == 0) {
          this.$message.success("Deleted successfully");
          this.VoPageListByDto(1);
        } else {
          this.$message.error(res.message || "Delete failed");
        }
      } catch (e) {
        this.$message.error((e && e.message) || "Delete failed");
      }
    },
    confirmDelete(row) {
      this.$confirm("Confirm delete this project?", "Tip", {
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
.spec_body {
  padding: 0 20px 80px;
  height: calc(100% - 60px);
  overflow-y: auto;
}

.form_item {
  margin-bottom: 18px;

  label {
    display: block;
    margin-bottom: 8px;
    font-weight: 600;
    color: #0f172a;
    font-size: 13px;
  }

  .required {
    color: #dc2626;
    margin-left: 2px;
  }
}

.access_hint {
  margin: 8px 0 0;
  padding: 10px 12px;
  border-radius: 6px;
  background: #f0fdfa;
  border: 1px solid #ccfbf1;
  color: #0f766e;
  font-size: 12px;
  line-height: 1.5;

  strong {
    font-weight: 700;
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
  text-align: right;
}

.btn-cancel-green {
  background: #16a34a !important;
  border-color: #16a34a !important;
  color: #fff !important;
}

.invite_footer {
  text-align: right;
}
</style>

<style>
.spec-drawer .el-drawer__header {
  margin-bottom: 12px;
  padding: 16px 20px 8px;
  font-weight: 700;
  color: #0f172a;
}

.invite-code-dialog .el-dialog__title {
  font-weight: 700;
}
</style>
