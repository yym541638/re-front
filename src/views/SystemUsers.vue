<template>
  <div class="cm-page">
    <div class="cm-page__body">
      <div class="cm-toolbar">
        <div class="cm-toolbar__left">
          <el-button
            class="cm-btn-invite"
            type="primary"
            @click="openCompanyInvite"
          >
            Company invite
          </el-button>
        </div>
      </div>

      <div class="cm-table-panel">
        <Vxetable
          ref="usersTable"
          @currentChange="loadUsers"
          @sizeChange="sizeChange"
          :tablePage="tablePage"
          :tableTitles="tableTitles"
          :tableData="tableData"
          :selection="false"
          operationW="120"
          :isfixed="true"
        >
          <div slot="btn_edit" slot-scope="{ row }" class="cm-op-actions">
            <el-button
              type="text"
              size="small"
              class="cm-op-edit"
              @click="openEditRole(row)"
            >
              Edit role
            </el-button>
          </div>
        </Vxetable>
      </div>
    </div>

    <el-dialog
      title="Edit system role"
      :visible.sync="editVisible"
      width="420px"
      :close-on-click-modal="false"
    >
      <div class="form_stack">
        <div class="form_item">
          <label>User</label>
          <el-input :value="editTargetName" disabled />
        </div>
        <div class="form_item">
          <label>System role<span class="required">*</span></label>
          <el-select v-model="editRole" style="width: 100%">
            <el-option
              v-for="role in systemRoles"
              :key="role.code"
              :label="role.label"
              :value="role.code"
            >
              <div class="role_option">
                <span class="role_option_title">{{ role.label }}</span>
                <span class="role_option_desc">{{ role.description }}</span>
              </div>
            </el-option>
          </el-select>
          <p class="role_hint" v-if="editRoleHint">{{ editRoleHint }}</p>
        </div>
      </div>
      <div slot="footer" class="dialog_footer">
        <el-button type="primary" :loading="saving" @click="saveRole">
          Save
        </el-button>
        <el-button @click="editVisible = false">Cancel</el-button>
      </div>
    </el-dialog>

    <el-dialog
      title="Company invitation code"
      :visible.sync="inviteVisible"
      width="420px"
      :close-on-click-modal="false"
    >
      <div class="form_stack">
        <div class="form_item">
          <label>Invite as<span class="required">*</span></label>
          <el-select v-model="inviteRole" style="width: 100%">
            <el-option
              v-for="role in systemRoles"
              :key="role.code"
              :label="role.label"
              :value="role.code"
            >
              <div class="role_option">
                <span class="role_option_title">{{ role.label }}</span>
                <span class="role_option_desc">{{ role.description }}</span>
              </div>
            </el-option>
          </el-select>
          <p class="role_hint" v-if="inviteRoleHint">{{ inviteRoleHint }}</p>
        </div>
        <div class="form_item" v-if="generatedCode">
          <label>Invitation code</label>
          <el-input :value="generatedCode" readonly>
            <el-button
              slot="append"
              icon="el-icon-document-copy"
              @click="copyCode"
            />
          </el-input>
        </div>
      </div>
      <div slot="footer" class="dialog_footer">
        <el-button
          v-if="!generatedCode"
          type="primary"
          :loading="inviteCreating"
          @click="createCompanyInvite"
        >
          Generate
        </el-button>
        <el-button v-else type="primary" @click="inviteVisible = false">
          Done
        </el-button>
        <el-button @click="inviteVisible = false">Cancel</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  SYSTEM_ROLES,
  isCompAdmin,
  normalizeSystemRole,
  systemRoleLabel,
  systemRoleDescription,
} from "../utils/roles";

export default {
  name: "SystemUsers",
  data() {
    return {
      systemRoles: SYSTEM_ROLES,
      tableTitles: [
        { fieldName: "display_name", titleName: "Name", width: 160 },
        { fieldName: "email", titleName: "Email", width: 200 },
        { fieldName: "system_role_label", titleName: "System role", width: 180 },
        { fieldName: "business_identity", titleName: "Business identity", width: 140 },
        { fieldName: "status_label", titleName: "Status", width: 100 },
      ],
      tableData: [],
      tablePage: {
        pageIndex: 1,
        pageSize: 20,
        total: 0,
      },
      editVisible: false,
      editTargetId: null,
      editTargetName: "",
      editRole: "COMP_USER",
      saving: false,
      inviteVisible: false,
      inviteRole: "COMP_USER",
      generatedCode: "",
      inviteCreating: false,
    };
  },
  computed: {
    editRoleHint() {
      return systemRoleDescription(this.editRole);
    },
    inviteRoleHint() {
      return systemRoleDescription(this.inviteRole);
    },
  },
  created() {
    if (!isCompAdmin()) {
      this.$message.warning("Only company administrators can access System Users");
      this.$router.replace({ name: "ProjectOverview" });
      return;
    }
    this.loadUsers(1);
  },
  methods: {
    normalizeUser(item) {
      const systemRole = normalizeSystemRole(
        item.system_role ||
          item.systemRole ||
          item.permission_code ||
          item.permissionCode,
      );
      const name =
        item.display_name ||
        item.displayName ||
        item.username ||
        item.name ||
        "-";
      return {
        user_id: item.user_id || item.userId || item.id,
        display_name: name,
        email: item.email || "-",
        system_role: systemRole,
        system_role_label: systemRoleLabel(systemRole),
        business_identity:
          item.role_code || item.roleCode || item.business_identity || "-",
        status_label:
          item.status === 0 || item.enabled === false ? "Disabled" : "Active",
      };
    },
    async loadUsers(page) {
      this.tablePage.pageIndex = page || this.tablePage.pageIndex;
      try {
        let res = await this.$api.companyUsers({
          pageSize: this.tablePage.pageSize,
          pageNum: this.tablePage.pageIndex,
        });
        if (res.code != 0 && this.$api.userList) {
          res = await this.$api.userList({
            pageSize: this.tablePage.pageSize,
            pageNum: this.tablePage.pageIndex,
          });
        }
        if (res.code == 0) {
          const data = res.data;
          const list = Array.isArray(data)
            ? data
            : (data && (data.list || data.records)) || [];
          this.tableData = list.map((item) => this.normalizeUser(item));
          this.tablePage.total =
            (data && (data.totalCount || data.total)) ||
            res.total ||
            list.length;
        } else {
          this.$message.warning(res.message || "Load users failed");
        }
      } catch (e) {
        this.$message.error((e && e.message) || "Load users failed");
      }
    },
    sizeChange(size) {
      this.tablePage.pageSize = size;
      this.loadUsers(1);
    },
    openEditRole(row) {
      this.editTargetId = row.user_id;
      this.editTargetName = row.display_name;
      this.editRole = row.system_role || "COMP_USER";
      this.editVisible = true;
    },
    async saveRole() {
      if (!this.editTargetId) return;
      this.saving = true;
      try {
        const res = await this.$api.updateUserSystemRole(this.editTargetId, {
          systemRole: this.editRole,
        });
        if (res.code == 0) {
          this.$message.success("System role updated");
          this.editVisible = false;
          this.loadUsers(this.tablePage.pageIndex);
        } else {
          this.$message.error(res.message || "Update failed");
        }
      } catch (e) {
        this.$message.error((e && e.message) || "Update failed");
      } finally {
        this.saving = false;
      }
    },
    openCompanyInvite() {
      this.inviteRole = "COMP_USER";
      this.generatedCode = "";
      this.inviteVisible = true;
    },
    async createCompanyInvite() {
      this.inviteCreating = true;
      try {
        const res = await this.$api.companyInvitationCreate({
          systemRole: this.inviteRole,
        });
        if (res.code == 0) {
          const data = res.data || {};
          this.generatedCode = data.code || "";
          this.$message.success("Invitation code created");
          if (!this.generatedCode) this.inviteVisible = false;
        } else {
          this.$message.error(res.message || "Create invitation failed");
        }
      } catch (e) {
        this.$message.error((e && e.message) || "Create invitation failed");
      } finally {
        this.inviteCreating = false;
      }
    },
    async copyCode() {
      if (!this.generatedCode) return;
      try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          await navigator.clipboard.writeText(this.generatedCode);
        } else {
          const input = document.createElement("textarea");
          input.value = this.generatedCode;
          document.body.appendChild(input);
          input.select();
          document.execCommand("copy");
          document.body.removeChild(input);
        }
        this.$message.success("Copied");
      } catch (e) {
        this.$message.error("Copy failed");
      }
    },
  },
};
</script>

<style lang="less" scoped>
.cm-btn-invite {
  background: #0f766e !important;
  border-color: #0f766e !important;
  color: #fff !important;
  min-width: 130px;
  border-radius: 4px;
  font-weight: 600;
}

.cm-op-edit.el-button--text {
  color: #2563eb !important;
  font-size: 13px;
  font-weight: 600;
  padding: 0 !important;
  margin: 0 !important;
}

.form_stack {
  .form_item {
    margin-bottom: 16px;

    label {
      display: block;
      margin-bottom: 8px;
      color: #475569;
      font-weight: 600;
      font-size: 13px;
    }

    .required {
      color: #dc2626;
      margin-left: 2px;
    }
  }
}

.dialog_footer {
  text-align: right;
}

.role_option {
  display: flex;
  flex-direction: column;
  line-height: 1.3;
  padding: 4px 0;
}

.role_option_title {
  font-size: 13px;
  color: #111827;
  font-weight: 600;
}

.role_option_desc {
  font-size: 11px;
  color: #64748b;
  white-space: normal;
}

.role_hint {
  margin: 8px 0 0;
  font-size: 12px;
  color: #64748b;
  line-height: 1.45;
}
</style>
