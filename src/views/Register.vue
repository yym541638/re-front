<template>
  <div class="register_page">
    <div class="page_bg" aria-hidden="true"></div>
    <div class="page_bg_mask" aria-hidden="true"></div>

    <CommonHeader variant="light" buttonText="Login" />

    <div class="register_main">
      <div class="register_card">
        <div class="card_brand">
          <img
            class="card_logo"
            src="@/assets/brand/complimind-logo.png"
            alt="CompliMind"
          />
          <h1 class="card_title">Create Account</h1>
          <p class="card_desc">
            Join CompliMind to start your SOC 2 compliance preparation.
          </p>
        </div>

        <el-form
          class="register_form"
          :model="form"
          label-position="top"
          @submit.native.prevent="register"
        >
          <el-form-item label="Name" required>
            <div class="name_row">
              <el-input
                v-model.trim="form.firstName"
                placeholder="First name"
                clearable
              />
              <el-input
                v-model.trim="form.lastName"
                placeholder="Last name"
                clearable
              />
            </div>
          </el-form-item>

          <el-form-item label="Email address" required>
            <el-input
              v-model.trim="form.email"
              placeholder="xxx@xx.com"
              clearable
            />
          </el-form-item>

          <el-form-item label="Password" required>
            <el-input
              v-model.trim="form.password"
              type="password"
              show-password
              placeholder="Password"
              clearable
            />
          </el-form-item>

          <el-form-item label="Phone NO." required>
            <el-input
              v-model.trim="form.phone"
              placeholder="Phone number"
              clearable
            />
          </el-form-item>

          <el-form-item label="Invitation Code">
            <el-input
              v-model.trim="form.invitationCode"
              placeholder="Optional invitation code"
              clearable
            />
          </el-form-item>

          <el-form-item label="Company name" required>
            <el-input
              v-model.trim="form.companyName"
              placeholder="Company Name"
              clearable
            />
          </el-form-item>

          <div class="select_row">
            <el-form-item label="Business Identity" required>
              <el-select v-model="form.role" placeholder="Select identity">
                <el-option
                  v-for="item in businessIdentities"
                  :key="item.code"
                  :label="item.label"
                  :value="item.code"
                />
              </el-select>
            </el-form-item>

            <el-form-item label="System Role" required>
              <el-select v-model="form.systemRole" placeholder="Select system role">
                <el-option
                  v-for="item in systemRoles"
                  :key="item.code"
                  :label="item.label"
                  :value="item.code"
                >
                  <div class="role_option">
                    <span class="role_option_title">{{ item.label }}</span>
                    <span class="role_option_desc">{{ item.description }}</span>
                  </div>
                </el-option>
              </el-select>
              <p class="role_hint" v-if="systemRoleHint">
                {{ systemRoleHint }}
              </p>
            </el-form-item>
          </div>

          <el-button
            class="register_btn"
            type="primary"
            native-type="submit"
            :loading="loading"
            @click="register"
          >
            Create Account
          </el-button>

          <div class="login_link">
            Already have an account?
            <a href="#" @click.prevent="goToLogin">Sign in</a>
          </div>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import CommonHeader from "../components/common/Header.vue";
import { BUSINESS_IDENTITIES, SYSTEM_ROLES, systemRoleDescription } from "../utils/roles";
import {
  captureInviteFromRouteQuery,
  parseProjectIdFromInviteCode,
} from "../utils/projectInvite";

export default {
  name: "Register",
  components: {
    CommonHeader,
  },
  data() {
    return {
      loading: false,
      businessIdentities: BUSINESS_IDENTITIES,
      systemRoles: SYSTEM_ROLES,
      form: {
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        phone: "",
        invitationCode: "",
        companyName: "",
        role: "clients",
        systemRole: "COMP_ADMIN",
      },
    };
  },
  computed: {
    systemRoleHint() {
      return systemRoleDescription(this.form.systemRole);
    },
  },
  created() {
    const pending = captureInviteFromRouteQuery(this.$route.query);
    const code = (pending && pending.inviteCode) || "";
    // 公司邀请码可预填；项目级 CM-PROJ-* 留给登录后进项目，不作为公司邀请码
    if (code && !parseProjectIdFromInviteCode(code)) {
      this.form.invitationCode = code;
    }
  },
  watch: {
    "form.invitationCode"(val) {
      // 有公司邀请码 → 普通用户；新建公司 → 默认公司管理员
      this.form.systemRole = val && String(val).trim() ? "COMP_USER" : "COMP_ADMIN";
    },
  },
  methods: {
    goToLogin() {
      this.$router.push({
        name: "login",
        query: { ...this.$route.query },
      });
    },
    validate() {
      if (!this.form.firstName || !this.form.lastName) {
        this.$message.warning("Please enter your name");
        return false;
      }
      if (!this.form.email) {
        this.$message.warning("Please enter email address");
        return false;
      }
      if (!this.form.password) {
        this.$message.warning("Please enter password");
        return false;
      }
      if (!this.form.phone) {
        this.$message.warning("Please enter phone number");
        return false;
      }
      if (!this.form.companyName) {
        this.$message.warning("Please enter company name");
        return false;
      }
      if (!this.form.role) {
        this.$message.warning("Please select business identity");
        return false;
      }
      if (!this.form.systemRole) {
        this.$message.warning("Please select system role");
        return false;
      }
      return true;
    },
    async register() {
      if (!this.validate()) return;
      this.loading = true;
      try {
        const payload = {
          firstName: this.form.firstName,
          lastName: this.form.lastName,
          displayName: `${this.form.firstName} ${this.form.lastName}`.trim(),
          email: this.form.email,
          password: this.form.password,
          phone: this.form.phone,
          invitationCode: this.form.invitationCode,
          companyName: this.form.companyName,
          roleCode: this.form.role,
          systemRole: this.form.systemRole,
          // 兼容旧后端字段
          permissionCode:
            this.form.systemRole === "COMP_ADMIN"
              ? "administrator"
              : "generalUser",
        };
        const res = await this.$api.register(payload);
        if (res.code == 0) {
          this.$message.success("Registration successful");
          this.$router.push({
            name: "login",
            query: { ...this.$route.query },
          });
        } else {
          this.$message({
            message: res.message || "Registration failed",
            type: "warning",
          });
        }
      } catch (e) {
        this.$message.error((e && e.message) || "Registration failed");
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style lang="less" scoped>
.register_page {
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
  background: #eef3f7;
  font-family: "Segoe UI", "PingFang SC", "Microsoft YaHei", sans-serif;
}

.page_bg {
  position: absolute;
  inset: 0;
  background: url("~@/assets/brand/complimind-login-bg.png") center / cover
    no-repeat;
  z-index: 0;
}

.page_bg_mask {
  position: absolute;
  inset: 0;
  z-index: 1;
  background: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0.78) 0%,
    rgba(238, 243, 247, 0.72) 50%,
    rgba(255, 255, 255, 0.88) 100%
  );
}

.register_main {
  position: relative;
  z-index: 2;
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 96px 24px 40px;
  box-sizing: border-box;
  overflow: auto;
}

.register_card {
  width: 100%;
  max-width: 560px;
  padding: 28px 32px 24px;
  background: rgba(255, 255, 255, 0.95);
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  box-shadow: 0 12px 36px rgba(15, 23, 42, 0.08);
  backdrop-filter: blur(8px);
}

.card_brand {
  text-align: center;
  margin-bottom: 18px;
}

.card_logo {
  width: 52px;
  height: 52px;
  object-fit: contain;
  border-radius: 12px;
  margin-bottom: 10px;
  background: #fff;
}

.card_title {
  margin: 0 0 6px;
  font-size: 24px;
  font-weight: 700;
  color: #0f172a;
}

.card_desc {
  margin: 0;
  font-size: 13px;
  color: #64748b;
  line-height: 1.5;
}

.register_form {
  /deep/ .el-form-item {
    margin-bottom: 14px;
  }

  /deep/ .el-form-item__label {
    padding-bottom: 4px;
    line-height: 1.2;
    color: #334155;
    font-weight: 600;
  }

  /deep/ .el-input__inner,
  /deep/ .el-input .el-input__inner {
    height: 40px;
    border-radius: 8px;
    border-color: #cbd5e1;

    &:focus {
      border-color: #0f766e !important;
    }
  }

  /deep/ .el-select {
    width: 100%;
  }
}

.name_row,
.select_row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
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

.register_btn {
  width: 100%;
  height: 44px;
  margin-top: 8px;
  border-radius: 8px !important;
  border: none !important;
  background: #0f766e !important;
  font-size: 15px;
  font-weight: 700;

  &:hover,
  &:focus {
    background: #0d9488 !important;
  }
}

.login_link {
  margin-top: 16px;
  text-align: center;
  font-size: 14px;
  color: #64748b;

  a {
    color: #0f766e;
    font-weight: 600;
    text-decoration: none;
    margin-left: 4px;

    &:hover {
      text-decoration: underline;
    }
  }
}

@media screen and (max-width: 640px) {
  .name_row,
  .select_row {
    grid-template-columns: 1fr;
  }

  .register_card {
    padding: 22px 18px;
  }
}
</style>
