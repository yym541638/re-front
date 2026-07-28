<template>
  <div class="cm-page">
    <div class="cm-page__body">
      <div class="cm-toolbar">
        <div class="cm-toolbar__left">
          <el-button class="cm-btn-invite" @click="inviteCodeVisible = true">
            Invitation code
          </el-button>
        </div>
      </div>

      <div class="cm-table-panel">
        <Vxetable
          ref="accessTable"
          @currentChange="VoPageListByDto"
          @sizeChange="sizeChange"
          :tablePage="tablePage"
          :tableTitles="tableTitles"
          :tableData="tableData"
          :selection="false"
          operationW="100"
          :isfixed="true"
        >
          <div slot="btn_edit" slot-scope="{ row }" class="cm-op-actions">
            <el-button
              type="text"
              size="small"
              class="cm-op-invite"
              @click="openInvite(row)"
            >
              Invite
            </el-button>
          </div>
        </Vxetable>
      </div>
    </div>

    <!-- Enter invitation code -->
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
        <el-button type="primary" @click="handleRedeemConfirm">Confirm</el-button>
        <el-button class="btn-cancel-green" @click="inviteCodeVisible = false">
          Cancel
        </el-button>
      </div>
    </el-dialog>

    <!-- Create project invitation -->
    <el-dialog
      title="Invite member"
      :visible.sync="createInviteVisible"
      width="420px"
      :close-on-click-modal="false"
      custom-class="invite-code-dialog"
    >
      <div class="invite_create_body">
        <div class="form_item">
          <label>Project</label>
          <el-input :value="inviteTargetName" disabled />
        </div>
        <div class="form_item">
          <label>Role<span class="required">*</span></label>
          <el-select
            v-model="inviteRole"
            placeholder="Select role"
            style="width: 100%"
          >
            <el-option
              v-for="role in roleOptions"
              :key="role.code"
              :label="role.label"
              :value="role.code"
            />
          </el-select>
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
      <div slot="footer" class="invite_footer">
        <el-button
          v-if="!generatedCode"
          type="primary"
          :loading="inviteCreating"
          @click="handleCreateInvite"
        >
          Confirm
        </el-button>
        <el-button
          v-else
          type="primary"
          @click="closeCreateInvite"
        >
          Done
        </el-button>
        <el-button class="btn-cancel-green" @click="closeCreateInvite">
          Cancel
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
const ROLE_COLUMNS = [
  { fieldName: "Administrator", titleName: "Administrator", roleCode: "COMP_ADMIN", width: 130 },
  { fieldName: "ProjectOwner", titleName: "Project Owner", roleCode: "PROJECT_OWNER", width: 130 },
  { fieldName: "DocumentOwner", titleName: "Document Owner", roleCode: "DOCUMENT_OWNER", width: 140 },
  { fieldName: "GeneralUser", titleName: "General User", roleCode: "GENERAL_USER", width: 120 },
  { fieldName: "ManagerTier1", titleName: "Manager tier 1", roleCode: "MANAGER", width: 130 },
  { fieldName: "ManagerTier2", titleName: "Manager tier 2", roleCode: "MANAGER_2", width: 130 },
];

const ROLE_CODE_TO_FIELD = ROLE_COLUMNS.reduce((acc, col) => {
  acc[col.roleCode] = col.fieldName;
  return acc;
}, {});

export default {
  name: "ProjectSettings",
  data() {
    return {
      tableTitles: [
        { fieldName: "project_name", titleName: "Project name", width: 180 },
        ...ROLE_COLUMNS.map(({ fieldName, titleName, width }) => ({
          fieldName,
          titleName,
          width,
        })),
      ],
      tableData: [],
      tablePage: {
        pageIndex: 1,
        pageSize: 20,
        total: 0,
      },
      roleOptions: ROLE_COLUMNS.map((col) => ({
        code: col.roleCode,
        label: col.titleName,
      })),
      inviteCodeVisible: false,
      inviteCode: "",
      createInviteVisible: false,
      inviteTargetId: null,
      inviteTargetName: "",
      inviteRole: "",
      generatedCode: "",
      inviteCreating: false,
    };
  },
  created() {
    this.VoPageListByDto(1);
  },
  methods: {
    mapRoleSlots(roleSlots) {
      const mapped = {};
      ROLE_COLUMNS.forEach((col) => {
        mapped[col.fieldName] = "";
      });
      (roleSlots || []).forEach((slot) => {
        const code = slot.role_code || slot.roleCode || "";
        const field = ROLE_CODE_TO_FIELD[code];
        if (!field) return;
        mapped[field] =
          slot.display_name ||
          slot.displayName ||
          slot.email ||
          "";
      });
      return mapped;
    },
    async VoPageListByDto(page) {
      this.tablePage.pageIndex = page;
      try {
        const res = await this.$api.projectAccessManagement({
          pageSize: this.tablePage.pageSize,
          pageNum: this.tablePage.pageIndex,
        });
        if (res.code == 0) {
          const pageData = res.data || {};
          const list = pageData.list || [];
          this.tableData = list.map((item) => ({
            project_id: item.project_id || item.projectId,
            project_name: item.project_name || item.projectName || "",
            ...this.mapRoleSlots(item.role_slots || item.roleSlots),
          }));
          this.tablePage.total =
            pageData.totalCount || pageData.total || res.total || 0;
        } else {
          this.$message.warning(res.message || "Load access list failed");
        }
      } catch (e) {
        this.$message.error((e && e.message) || "Load access list failed");
      }
    },
    sizeChange(size) {
      this.tablePage.pageSize = size;
      this.VoPageListByDto(1);
    },
    async handleRedeemConfirm() {
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
          this.VoPageListByDto(this.tablePage.pageIndex);
        } else {
          this.$message.error(res.message || "Redeem failed");
        }
      } catch (e) {
        this.$message.error((e && e.message) || "Redeem failed");
      }
    },
    openInvite(row) {
      this.inviteTargetId = row.project_id;
      this.inviteTargetName = row.project_name || "";
      this.inviteRole = "";
      this.generatedCode = "";
      this.createInviteVisible = true;
    },
    closeCreateInvite() {
      this.createInviteVisible = false;
      this.inviteTargetId = null;
      this.inviteTargetName = "";
      this.inviteRole = "";
      this.generatedCode = "";
    },
    async handleCreateInvite() {
      if (!this.inviteTargetId) {
        this.$message.warning("Project is required");
        return;
      }
      if (!this.inviteRole) {
        this.$message.warning("Please select a role");
        return;
      }
      this.inviteCreating = true;
      try {
        const res = await this.$api.invitationCodeCreate({
          projectId: this.inviteTargetId,
          memberRole: this.inviteRole,
        });
        if (res.code == 0) {
          const data = res.data || {};
          this.generatedCode = data.code || "";
          this.$message.success("Invitation code created");
          if (!this.generatedCode) {
            this.closeCreateInvite();
          }
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
  background: #16a34a !important;
  border-color: #16a34a !important;
  color: #fff !important;
  min-width: 130px;
  border-radius: 4px;
  font-weight: 600;
}

.cm-btn-invite:hover,
.cm-btn-invite:focus {
  background: #15803d !important;
  border-color: #15803d !important;
  color: #fff !important;
}

.cm-op-invite.el-button--text {
  color: #2563eb !important;
  font-size: 13px;
  font-weight: 600;
  padding: 0 !important;
  margin: 0 !important;
}

.invite_create_body {
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
.invite-code-dialog .el-dialog__title {
  font-weight: 700;
}
</style>
