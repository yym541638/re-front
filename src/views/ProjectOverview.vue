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
              Detail
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

        <div class="form_item">
          <label>Project User management:</label>
          <div class="user_table_container">
            <table class="user_table">
              <thead>
                <tr>
                  <th>Role</th>
                  <th>Name</th>
                  <th>Operation</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(user, index) in formData.users" :key="index">
                  <td>{{ user.role }}</td>
                  <td>{{ user.name || "-" }}</td>
                  <td>
                    <el-button
                      class="edit_link"
                      type="text"
                      :disabled="specMode === 'view'"
                      @click="openUserInvites(user.role)"
                    >
                      edit
                    </el-button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
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

    <!-- User Invites ?? -->
    <el-dialog
      title="User Invites"
      :visible.sync="userInvitesVisible"
      width="800px"
      :close-on-click-modal="false"
    >
      <div class="invites_container">
        <div class="invites_column">
          <el-input
            v-model="searchKeyword"
            placeholder="user search"
            class="search_input"
            suffix-icon="el-icon-search"
          />
          <div class="user_list">
            <div
              v-for="user in availableUsers"
              :key="user.user_id"
              class="user_item"
            >
              <span class="user_name">{{ user.username }}</span>
              <button
                class="add_btn"
                :class="{ disabled: isUserSelected(user.user_id) }"
                @click="addToSelected(user)"
                :disabled="isUserSelected(user.user_id)"
              >
                +
              </button>
            </div>
          </div>
        </div>

        <div class="invites_arrow">
          <div class="arrow_item">?</div>
          <div class="arrow_item">?</div>
          <div class="arrow_item">?</div>
        </div>

        <div class="invites_column">
          <button class="invite_link_btn">Invite Link</button>
          <div class="user_list">
            <div
              v-for="user in selectedUsers"
              :key="user.user_id"
              class="user_item"
            >
              <span class="user_name">{{ user.username }}</span>
              <button class="remove_btn" @click="removeFromSelected(user)">
                -
              </button>
            </div>
          </div>
        </div>
      </div>

      <div slot="footer" class="invites_footer">
        <el-button type="primary" @click="handleInvitesConfirm">Confirm</el-button>
        <el-button class="btn-cancel-green" @click="handleInvitesCancel">
          Cancel
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { isCompAdmin } from "../utils/roles";

const defaultUsers = () => [
  { role: "Project Owner", roleCode: "PROJECT_OWNER", name: "", userId: "" },
  { role: "Document Owner", roleCode: "DOCUMENT_OWNER", name: "", userId: "" },
  { role: "General User", roleCode: "GENERAL_USER", name: "", userId: "" },
  { role: "Manager tier 1", roleCode: "MANAGER", name: "", userId: "" },
  { role: "Manager tier 2", roleCode: "MANAGER_2", name: "", userId: "" },
];

const emptyForm = () => ({
  projectName: "",
  projectInfo: "",
  startDate: "",
  endDate: "",
  users: defaultUsers(),
  pictureFile: [],
});

export default {
  name: "ProjectOverview",
  data() {
    return {
      tableTitles: [
        { fieldName: "project_id", titleName: "Project ID" },
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
      userInvitesVisible: false,
      currentEditingRole: "",
      searchKeyword: "",
      availableUsers: [],
      selectedUsers: [],
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
    buildMembersPayload(users) {
      const members = [];
      (users || []).forEach((user) => {
        if (!user.name || !user.userId) return;
        const ids = String(user.userId)
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean);
        const names = String(user.name)
          .split(",")
          .map((s) => s.trim());
        ids.forEach((id, idx) => {
          const userId = Number(id);
          if (!userId) return;
          members.push({
            userId,
            memberRole: user.roleCode || user.role,
            displayName: names[idx] || names[0] || "",
          });
        });
      });
      return members;
    },
    mapRoleSlotsToUsers(roleSlots, members) {
      const users = defaultUsers();
      const source = ((roleSlots && roleSlots.length ? roleSlots : null) || [])
        .filter((slot) => {
          const code = slot.role_code || slot.roleCode || "";
          return code !== "COMP_ADMIN" && code !== "administrator";
        });
      if (source.length) {
        return source.map((slot) => ({
          role: slot.role_name || slot.roleName || slot.role_code || "General User",
          roleCode: slot.role_code || slot.roleCode || "",
          name: slot.display_name || "",
          userId: slot.user_id || "",
          email: slot.email || "",
        }));
      }
      if (members && members.length) {
        members.forEach((m) => {
          const hit = users.find((u) => u.role === m.memberRole && !u.name);
          if (hit) {
            hit.name = m.displayName || m.email || "";
            hit.userId = m.userId || "";
          } else {
            users.push({
              role: m.memberRole || "Internal User",
              name: m.displayName || "",
              userId: m.userId || "",
            });
          }
        });
      }
      return users;
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
        try {
          const slotRes = await this.$api.projectRoleSlots({});
          if (slotRes.code == 0 && Array.isArray(slotRes.data)) {
            this.formData.users = this.mapRoleSlotsToUsers(slotRes.data);
          }
        } catch (e) {
          /* ignore */
        }
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
          users: this.mapRoleSlotsToUsers(detail.roleSlots, detail.members),
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
      const payload = {
        projectName: formData.projectName,
        projectInfo: formData.projectInfo || "",
        startDate: formData.startDate,
        endDate: formData.endDate || null,
        members: this.buildMembersPayload(formData.users),
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
    async openUserInvites(role) {
      this.currentEditingRole = role;
      this.selectedUsers = [];
      this.userInvitesVisible = true;
      try {
        let companyName = "Demo Company";
        try {
          const info = JSON.parse(sessionStorage.getItem("userInfo") || "{}");
          companyName = info.company_name || info.companyName || companyName;
        } catch (e) {
          /* ignore */
        }
        const res = await this.$api.companyUsers({ companyName });
        if (res.code == 0) {
          this.availableUsers = res.data || [];
        } else {
          this.$message.warning(res.message || "Load users failed");
        }
      } catch (e) {
        this.$message.error((e && e.message) || "Load users failed");
      }
    },
    isUserSelected(userId) {
      return this.selectedUsers.some((user) => user.user_id === userId);
    },
    addToSelected(user) {
      if (!this.isUserSelected(user.user_id)) {
        this.selectedUsers.push({ ...user });
      }
    },
    removeFromSelected(user) {
      this.selectedUsers = this.selectedUsers.filter(
        (u) => u.user_id !== user.user_id,
      );
    },
    handleInvitesConfirm() {
      if (this.selectedUsers.length > 0 && this.currentEditingRole) {
        const selectedNames = this.selectedUsers.map((user) => user.username);
        const selectedIds = this.selectedUsers.map((user) => user.user_id);
        const combinedName = selectedNames.join(", ");
        const combinedIds = selectedIds.join(", ");
        const target = this.formData.users.find(
          (user) => user.role === this.currentEditingRole && !user.name,
        );
        if (target) {
          target.name = combinedName;
          target.userId = combinedIds;
        } else {
          this.formData.users.push({
            role: this.currentEditingRole,
            name: combinedName,
            userId: combinedIds,
          });
        }
      }
      this.$message.success("User invites updated");
      this.userInvitesVisible = false;
    },
    handleInvitesCancel() {
      this.userInvitesVisible = false;
    },
    Enter(row) {
      const projectName = row.project_name || row.projectName;
      const projectId = row.project_id || row.projectId;
      if (projectId) {
        sessionStorage.setItem("currentProjectId", String(projectId));
      }
      if (projectName) {
        sessionStorage.setItem("currentProjectName", projectName);
      }
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
        path: "/RequestMaster",
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

.user_table_container {
  overflow: auto;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
}

.user_table {
  width: 100%;
  border-collapse: collapse;

  th,
  td {
    padding: 8px 10px;
    text-align: left;
    border-bottom: 1px solid #eef2f7;
    font-size: 12px;
  }

  th {
    background: #f8fafc;
    font-weight: 600;
    color: #475569;
  }

  .edit_link {
    color: #2563eb !important;
    padding: 0 !important;
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

.invites_container {
  display: flex;
  gap: 16px;
  height: 400px;
}

.invites_column {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.search_input {
  margin-bottom: 10px;
}

.invite_link_btn {
  background-color: #2563eb;
  color: #fff;
  border: none;
  padding: 6px 12px;
  border-radius: 4px;
  align-self: flex-end;
  margin-bottom: 10px;
  cursor: pointer;
}

.user_list {
  flex: 1;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  overflow-y: auto;
}

.user_item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  border-bottom: 1px solid #f1f5f9;

  &:last-child {
    border-bottom: none;
  }
}

.add_btn,
.remove_btn {
  width: 24px;
  height: 24px;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  font-size: 16px;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #2563eb;
  color: #fff;
}

.add_btn.disabled {
  background-color: #cbd5e1;
  cursor: not-allowed;
}

.invites_arrow {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 10px;

  .arrow_item {
    font-size: 18px;
    color: #2563eb;
    text-align: center;
  }
}

.invites_footer,
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
