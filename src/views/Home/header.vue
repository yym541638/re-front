<template>
  <div class="header">
    <div class="header_left">
      <el-breadcrumb>
        <el-breadcrumb-item></el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <div class="header_right">
      <div class="user_admin">
        <el-avatar class="user_avatar" :src="avatarSrc"></el-avatar>
        <el-dropdown @command="handleDropdownCommand">
          <span class="el-dropdown-link">
            {{ userName }}
            <i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="profile">Profile</el-dropdown-item>
            <el-dropdown-item v-if="isAdmin" command="systemUsers">
              System Users
            </el-dropdown-item>
            <el-dropdown-item command="logout">Log out</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>

    <el-dialog
      :visible.sync="profileDialogVisible"
      width="860px"
      custom-class="profile-dialog"
      :close-on-click-modal="false"
      :show-close="true"
      @open="loadProfiles"
    >
      <div class="profile_container">
        <aside class="profile_tabs">
          <div class="tabs_brand">
            <img src="@/assets/brand/complimind-logo.png" alt="" />
            <div>
              <strong>Profile Center</strong>
              <span>Account settings</span>
            </div>
          </div>
          <div
            class="tab_item"
            :class="{ active: activeTab === 'user' }"
            @click="activeTab = 'user'"
          >
            User Profile
          </div>
          <div
            v-if="isAdmin"
            class="tab_item"
            :class="{ active: activeTab === 'company' }"
            @click="activeTab = 'company'"
          >
            Company Profile
            <small>(Administrator Only)</small>
          </div>
        </aside>

        <section class="profile_content">
          <div v-if="activeTab === 'user'" class="panel">
            <div class="panel_head">
              <h3>User Profile</h3>
              <p class="panel_desc">
                Update your personal information for CompliMind.
              </p>
            </div>

            <div class="form_stack">
              <div class="form_item">
                <label>Display Name *</label>
                <el-input
                  v-model.trim="userForm.displayName"
                  placeholder="Display name"
                />
              </div>

              <div class="form_item">
                <label>Email address *</label>
                <el-input
                  v-model.trim="userForm.email"
                  placeholder="name@company.com"
                />
              </div>

              <div class="form_row">
                <div class="form_item">
                  <label>Phone NO. *</label>
                  <el-input
                    v-model.trim="userForm.phone"
                    placeholder="Phone number"
                  />
                </div>
                <div class="form_item">
                  <label>Job Title</label>
                  <el-input
                    v-model.trim="userForm.jobTitle"
                    placeholder="Job title"
                  />
                </div>
              </div>

              <div class="form_item">
                <label>Role</label>
                <el-input :value="userForm.role || '-'" disabled />
              </div>
            </div>

            <div class="form_footer">
              <el-button @click="profileDialogVisible = false">Close</el-button>
              <el-button
                class="save_btn"
                type="primary"
                :loading="savingUser"
                @click="saveUserProfile"
              >
                Save
              </el-button>
            </div>
          </div>

          <div v-else class="panel">
            <div class="panel_head">
              <h3>Company Profile</h3>
              <p class="panel_desc">
                Manage company details. Only administrators can edit this
                section.
              </p>
            </div>

            <div class="form_stack">
              <div class="form_item">
                <label>Company name *</label>
                <el-input
                  v-model.trim="companyForm.companyName"
                  placeholder="Company Name"
                />
              </div>

              <div class="form_row">
                <div class="form_item">
                  <label>Company code</label>
                  <el-input
                    v-model.trim="companyForm.companyCode"
                    placeholder="Company code"
                  />
                </div>
                <div class="form_item">
                  <label>Industry</label>
                  <el-input
                    v-model.trim="companyForm.industry"
                    placeholder="Industry"
                  />
                </div>
              </div>

              <div class="form_item">
                <label>Website</label>
                <el-input
                  v-model.trim="companyForm.website"
                  placeholder="https://"
                />
              </div>

              <div class="form_row">
                <div class="form_item">
                  <label>Contact name</label>
                  <el-input
                    v-model.trim="companyForm.contactName"
                    placeholder="Contact name"
                  />
                </div>
                <div class="form_item">
                  <label>Contact phone</label>
                  <el-input
                    v-model.trim="companyForm.contactPhone"
                    placeholder="Contact phone"
                  />
                </div>
              </div>

              <div class="form_item">
                <label>Address</label>
                <el-input
                  v-model.trim="companyForm.address"
                  type="textarea"
                  :rows="3"
                  placeholder="Company address"
                />
              </div>

              <div class="form_item">
                <label>Admin Role</label>
                <el-select
                  v-model="companyForm.adminRole"
                  disabled
                  class="full_select"
                >
                  <el-option
                    label="Administrator (Only 1 account)"
                    value="administrator"
                  />
                </el-select>
              </div>
            </div>

            <div class="form_footer">
              <el-button @click="profileDialogVisible = false">Close</el-button>
              <el-button
                class="save_btn"
                type="primary"
                :loading="savingCompany"
                @click="saveCompanyProfile"
              >
                Save
              </el-button>
            </div>
          </div>
        </section>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { isCompAdmin, persistSystemRole } from "../../utils/roles";

export default {
  data() {
    return {
      avatarSrc: require("@/assets/home/People.png"),
      userName: "",
      profileDialogVisible: false,
      activeTab: "user",
      savingUser: false,
      savingCompany: false,
      userForm: {
        displayName: "",
        email: "",
        phone: "",
        jobTitle: "",
        role: "",
        avatarUrl: "",
      },
      companyForm: {
        companyName: "",
        companyCode: "",
        industry: "",
        website: "",
        contactName: "",
        contactPhone: "",
        address: "",
        adminRole: "administrator",
      },
    };
  },
  computed: {
    isAdmin() {
      return isCompAdmin();
    },
  },
  created() {
    this.getUserInfo();
  },
  mounted() {
    this.$router.beforeEach((to, from, next) => {
      this.getUserInfo();
      next();
    });
  },
  methods: {
    getUserInfo() {
      const raw = sessionStorage.getItem("userInfo");
      if (!raw) {
        this.userName = "";
        return;
      }
      try {
        const info = JSON.parse(raw);
        this.userName =
          info.name || info.username || info.displayName || info.account || "User";
        if (info.avatar_url) this.avatarSrc = info.avatar_url;
        if (info.systemRole || info.system_role || info.permissionCode) {
          persistSystemRole(
            info.systemRole || info.system_role || info.permissionCode,
          );
        }
      } catch (e) {
        this.userName = "";
      }
    },
    handleDropdownCommand(command) {
      if (command === "logout") this.handleLogout();
      if (command === "profile") this.handleProfile();
      if (command === "systemUsers") {
        this.$router.push({ name: "SystemUsers" });
      }
    },
    handleLogout() {
      [
        "asideId",
        "asideParentId",
        "unitId",
        "equId",
        "user_id",
        "user_name",
        "user_level",
        "token",
        "userInfo",
        "tags",
        "purchase_status",
        "system_role",
      ].forEach((k) => sessionStorage.removeItem(k));
      this.$store.commit("UPDATE_TAGS", [
        {
          name: "ProjectOverview",
          RouterName: "ProjectOverview",
          id: "1228549913133977602",
        },
      ]);
      localStorage.removeItem("account");
      this.$router.push({ path: "/" });
    },
    handleProfile() {
      this.activeTab = "user";
      this.profileDialogVisible = true;
    },
    async loadProfiles() {
      await Promise.all([this.loadUserProfile(), this.loadCompanyProfile()]);
    },
    async loadUserProfile() {
      try {
        const res = await this.$api.profileMe({});
        if (res.code == 0 && res.data) {
          const d = res.data;
          this.userForm = {
            displayName: d.username || d.displayName || this.userName || "",
            email: d.email || "",
            phone: d.phone || "",
            jobTitle: d.job_title || d.jobTitle || "",
            role: d.role || "",
            avatarUrl: d.avatar_url || "",
          };
          if (d.avatar_url) this.avatarSrc = d.avatar_url;
          return;
        }
      } catch (e) {
        /* fallback session */
      }
      const raw = sessionStorage.getItem("userInfo");
      if (!raw) return;
      try {
        const info = JSON.parse(raw);
        this.userForm = {
          displayName: info.username || info.name || "",
          email: info.email || "",
          phone: info.phone || "",
          jobTitle: info.job_title || "",
          role: info.role || info.user_type || "",
          avatarUrl: info.avatar_url || "",
        };
      } catch (e) {
        /* ignore */
      }
    },
    async loadCompanyProfile() {
      try {
        const res = await this.$api.profileCompany({});
        if (res.code == 0 && res.data) {
          const d = res.data;
          this.companyForm = {
            companyName: d.company_name || "",
            companyCode: d.company_code || "",
            industry: d.industry || "",
            website: d.website || "",
            contactName: d.contact_name || "",
            contactPhone: d.contact_phone || "",
            address: d.address || "",
            adminRole: "administrator",
          };
          if (this.companyForm.companyName) {
            sessionStorage.setItem("companyName", this.companyForm.companyName);
            window.dispatchEvent(
              new CustomEvent("company-name-updated", {
                detail: { companyName: this.companyForm.companyName },
              }),
            );
          }
          return;
        }
      } catch (e) {
        /* fallback */
      }
      const raw = sessionStorage.getItem("userInfo");
      if (!raw) return;
      try {
        const info = JSON.parse(raw);
        this.companyForm.companyName = info.company_name || "";
        this.companyForm.adminRole = "administrator";
      } catch (e) {
        /* ignore */
      }
    },
    async saveUserProfile() {
      if (!this.userForm.displayName || !this.userForm.email || !this.userForm.phone) {
        this.$message.warning("Display name, email and phone are required");
        return;
      }
      this.savingUser = true;
      try {
        const res = await this.$api.updateProfileMe({
          displayName: this.userForm.displayName,
          email: this.userForm.email,
          phone: this.userForm.phone,
          jobTitle: this.userForm.jobTitle || "",
          avatarUrl: this.userForm.avatarUrl || "",
        });
        if (res.code == 0) {
          this.$message.success("User profile saved");
          const raw = sessionStorage.getItem("userInfo");
          const info = raw ? JSON.parse(raw) : {};
          info.name = this.userForm.displayName;
          info.username = this.userForm.displayName;
          info.email = this.userForm.email;
          info.phone = this.userForm.phone;
          sessionStorage.setItem("userInfo", JSON.stringify(info));
          this.getUserInfo();
        } else {
          this.$message.warning(res.message || "Save failed");
        }
      } catch (e) {
        this.$message.error((e && e.message) || "Save failed");
      } finally {
        this.savingUser = false;
      }
    },
    async saveCompanyProfile() {
      if (!this.companyForm.companyName) {
        this.$message.warning("Company name is required");
        return;
      }
      this.savingCompany = true;
      try {
        const res = await this.$api.updateProfileCompany({
          companyName: this.companyForm.companyName,
          companyCode: this.companyForm.companyCode || "",
          industry: this.companyForm.industry || "",
          website: this.companyForm.website || "",
          contactName: this.companyForm.contactName || "",
          contactPhone: this.companyForm.contactPhone || "",
          address: this.companyForm.address || "",
        });
        if (res.code == 0) {
          this.$message.success("Company profile saved");
          sessionStorage.setItem("companyName", this.companyForm.companyName);
          try {
            const info = JSON.parse(sessionStorage.getItem("userInfo") || "{}");
            info.company_name = this.companyForm.companyName;
            info.companyName = this.companyForm.companyName;
            sessionStorage.setItem("userInfo", JSON.stringify(info));
          } catch (e) {
            /* ignore */
          }
          window.dispatchEvent(
            new CustomEvent("company-name-updated", {
              detail: { companyName: this.companyForm.companyName },
            }),
          );
        } else {
          this.$message.warning(res.message || "Save failed");
        }
      } catch (e) {
        this.$message.error((e && e.message) || "Save failed");
      } finally {
        this.savingCompany = false;
      }
    },
  },
};
</script>

<style lang="less" scoped>
.header_left {
  flex: 1;
  display: flex;
}

.header_right {
  width: max-content;
  display: flex;
  align-items: center;
}

.user_admin {
  height: 36px;
  background-color: #f1f5f9;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--app-font) !important;
  width: auto;
  font-weight: 600;
  padding: 0 10px 0 6px;
  box-sizing: border-box;
  border-radius: 999px;
  border: 1px solid #e2e8f0;
  transition: border-color 0.2s ease, background 0.2s ease;

  &:hover {
    border-color: #99f6e4;
    background: #f0fdfa;
  }

  /deep/.el-dropdown {
    font-size: 13px !important;
    color: #0f172a !important;
  }

  .el-dropdown-link {
    color: #0f172a;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
  }

  .user_avatar {
    width: 24px;
    height: 24px;
    margin-right: 8px;
    border-radius: 50% !important;
    overflow: hidden;
  }
}

.header {
  width: 100%;
  height: 52px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-right: 0;
}

.profile_container {
  display: flex;
  min-height: 560px;
  margin: -12px -16px -8px;
  border-radius: 8px;
  overflow: hidden;
}

.profile_tabs {
  width: 200px;
  flex-shrink: 0;
  background: #f8fafc;
  border-right: 1px solid #e2e8f0;
  padding: 16px 12px;
}

.tabs_brand {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 4px 8px 14px;
  margin-bottom: 8px;
  border-bottom: 1px solid #e2e8f0;

  img {
    width: 32px;
    height: 32px;
    border-radius: 8px;
  }

  strong {
    display: block;
    font-size: 13px;
    color: #0f172a;
  }

  span {
    font-size: 11px;
    color: #94a3b8;
  }
}

.tab_item {
  padding: 12px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  color: #475569;
  margin-bottom: 6px;
  transition: all 0.15s ease;

  small {
    display: block;
    margin-top: 2px;
    font-size: 11px;
    font-weight: 500;
    color: #94a3b8;
  }

  &:hover {
    background: rgba(15, 118, 110, 0.06);
    color: #0f766e;
  }

  &.active {
    background: rgba(15, 118, 110, 0.1);
    color: #0f766e;
    box-shadow: inset 3px 0 0 #0f766e;
  }
}

.profile_content {
  flex: 1;
  min-width: 0;
  padding: 24px 28px;
  background: #fff;
  display: flex;
  flex-direction: column;
}

.panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
}

.panel_head {
  margin-bottom: 20px;

  h3 {
    margin: 0 0 6px;
    font-size: 20px;
    font-weight: 700;
    color: #0f172a;
  }
}

.panel_desc {
  margin: 0;
  font-size: 13px;
  line-height: 1.5;
  color: #64748b;
}

.form_stack {
  display: flex;
  flex-direction: column;
  gap: 16px;
  flex: 1;
}

.form_row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.form_item {
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 0;

  label {
    font-size: 13px;
    font-weight: 600;
    color: #334155;
    line-height: 1.2;
  }

  /deep/ .el-input,
  /deep/ .el-select,
  /deep/ .el-textarea {
    width: 100%;
  }

  /deep/ .el-input__inner,
  /deep/ .el-textarea__inner {
    width: 100%;
    height: 40px;
    border-radius: 8px;
    border: 1px solid #d0d7e2;
    box-sizing: border-box;

    &:focus {
      border-color: #0f766e !important;
    }
  }

  /deep/ .el-textarea__inner {
    height: auto;
    min-height: 84px;
    padding-top: 10px;
  }
}

.full_select {
  width: 100%;
}

.form_footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 28px;
  padding-top: 16px;
  border-top: 1px solid #e2e8f0;
}

.save_btn {
  min-width: 96px;
  background: #0f766e !important;
  border-color: #0f766e !important;

  &:hover,
  &:focus {
    background: #0d9488 !important;
    border-color: #0d9488 !important;
  }
}
</style>

<style>
.profile-dialog {
  border-radius: 12px !important;
  overflow: hidden;
}

.profile-dialog .el-dialog__header {
  padding: 10px 16px 0;
}

.profile-dialog .el-dialog__body {
  padding: 8px 16px 16px;
}

.el-avatar {
  background: #ccfbf1;
}

.el-avatar--circle {
  border-radius: 50% !important;
}
</style>
