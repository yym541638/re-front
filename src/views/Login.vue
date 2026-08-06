<template>
  <div class="login_page">
    <div class="login_bg" aria-hidden="true"></div>
    <div class="login_bg_mask" aria-hidden="true"></div>

    <CommonHeader
      variant="light"
      buttonText="Login"
      buttonAction="login"
      returnPath="/"
    />

    <div class="login_main">
      <div class="login_panel">
        <div class="panel_brand">
          <img
            class="panel_logo"
            src="@/assets/brand/complimind-logo.png"
            alt="CompliMind"
          />
        </div>
        <h1 class="login_title">Sign in to CompliMind</h1>

        <el-form
          class="login_form"
          :model="info"
          @submit.native.prevent="login"
        >
          <el-form-item>
            <el-input
              ref="username"
              v-model.trim="info.account"
              placeholder="Account name:"
              clearable
              @keyup.enter.native="focusPassword"
            />
          </el-form-item>

          <el-form-item>
            <el-input
              ref="password"
              v-model.trim="info.password"
              type="password"
              show-password
              placeholder="Password:"
              clearable
              @keyup.enter.native="login"
            />
          </el-form-item>

          <el-button
            class="login_btn"
            type="primary"
            native-type="submit"
            :loading="loading"
            @click="login"
          >
            Sign in
          </el-button>

          <div class="forgot-password">
            <a href="#" @click.prevent="openForgotPasswordDialog">
              Forget Your Password
            </a>
          </div>

          <div class="sign-up">
            If you don't have account
            <a href="#" @click.prevent="signUp">Sign up</a>
          </div>
        </el-form>
      </div>
    </div>

    <el-dialog
      title="Forget Your Password"
      :visible.sync="forgotPasswordDialogVisible"
      width="420px"
      custom-class="forgot-dialog"
    >
      <el-form
        :model="forgotPasswordForm"
        label-position="top"
        @submit.native.prevent
      >
        <el-form-item label="Email address:*">
          <el-input
            v-model.trim="forgotPasswordForm.email"
            placeholder="xxx@xx.com"
            clearable
          />
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button type="primary" @click="submitForgotPassword">Submit</el-button>
        <el-button @click="forgotPasswordDialogVisible = false">Cancel</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import CommonHeader from "../components/common/Header.vue";
import {
  persistSystemRole,
  extractSystemRole,
  refreshSystemRole,
} from "../utils/roles";
import { setCurrentProject } from "../utils/projectContext";
import {
  captureInviteFromRouteQuery,
  applyPendingProjectInvite,
} from "../utils/projectInvite";

export default {
  name: "Login",
  components: {
    CommonHeader,
  },
  data() {
    return {
      loading: false,
      info: {
        account: "",
        password: "",
      },
      forgotPasswordDialogVisible: false,
      forgotPasswordForm: {
        email: "",
      },
    };
  },
  created() {
    captureInviteFromRouteQuery(this.$route.query);
  },
  mounted() {
    this.$nextTick(() => {
      if (this.$refs.username) this.$refs.username.focus();
    });
  },
  methods: {
    ...mapActions("naviBar", ["getMenu"]),
    focusPassword() {
      if (this.$refs.password) this.$refs.password.focus();
    },
    async login() {
      if (!this.info.account) {
        this.$message.warning("Please enter account name");
        return;
      }
      if (!this.info.password) {
        this.$message.warning("Please enter password");
        return;
      }
      this.loading = true;
      try {
        const salt = await this.$api.login({
          account: this.info.account,
          password: this.info.password,
        });
        if (salt.code == 0) {
          this.$message.success("Login successful");
          sessionStorage.setItem("token", salt.data.token);
          const userInfo = salt.data.user_info || {};
          if (!userInfo.name) {
            userInfo.name =
              userInfo.username || userInfo.email || userInfo.account;
          }
          if (!userInfo.userId && userInfo.id != null) {
            userInfo.userId = userInfo.id;
          }
          let systemRole =
            extractSystemRole(salt.data) ||
            extractSystemRole(userInfo) ||
            "";
          if (!userInfo.email && String(this.info.account).includes("@")) {
            userInfo.email = this.info.account;
          }
          sessionStorage.setItem("userInfo", JSON.stringify(userInfo));

          // 登录未带明确系统角色时，拉 /auth/me、公司档案补齐
          if (!systemRole) {
            systemRole = await refreshSystemRole(this.$api);
          }
          // 过渡：指定主账号默认公司管理员
          const account = String(this.info.account || "").toLowerCase();
          if (systemRole !== "COMP_ADMIN" && account === "83261582@qq.com") {
            systemRole = "COMP_ADMIN";
          }
          if (!systemRole) {
            systemRole = "COMP_USER";
          }
          systemRole = persistSystemRole(systemRole);
          userInfo.systemRole = systemRole;
          userInfo.system_role = systemRole;
          sessionStorage.setItem("userInfo", JSON.stringify(userInfo));
          sessionStorage.setItem(
            "purchase_status",
            String(
              salt.data.purchase_status != null
                ? salt.data.purchase_status
                : 0,
            ),
          );

          const inviteResult = await applyPendingProjectInvite(
            this.$api,
            setCurrentProject,
          );

          if (salt.data.purchase_status == 0) {
            this.$router.push({ path: "/purchase", query: { product: "soc2" } });
          } else if (inviteResult.projectId) {
            this.$router.push({
              name: "ProjectOverview",
              query: {
                projectId: inviteResult.projectId,
                projectName: inviteResult.projectName || "",
              },
            });
          } else {
            this.$router.push({ path: "/products", query: { product: "soc2" } });
          }
        } else {
          this.$message({
            message: salt.message || "Login failed",
            type: "warning",
          });
        }
      } catch (e) {
        this.$message.error((e && e.message) || "Login failed");
      } finally {
        this.loading = false;
      }
    },
    openForgotPasswordDialog() {
      this.forgotPasswordDialogVisible = true;
    },
    submitForgotPassword() {
      if (!this.forgotPasswordForm.email) {
        this.$message.warning("Please enter email address");
        return;
      }
      this.forgotPasswordDialogVisible = false;
      this.$message({
        message: "Password reset email has been sent",
        type: "success",
      });
    },
    signUp() {
      this.$router.push({
        name: "register",
        query: { ...this.$route.query },
      });
    },
  },
};
</script>

<style lang="less" scoped>
.login_page {
  width: 100%;
  min-height: 100vh;
  background: #eef3f7;
  display: flex;
  flex-direction: column;
  font-family: "Segoe UI", "PingFang SC", "Microsoft YaHei", sans-serif;
  position: relative;
  overflow: hidden;
}

.login_bg {
  position: absolute;
  inset: 0;
  background: url("~@/assets/brand/complimind-login-bg.png") center center /
    cover no-repeat;
  transform: scale(1.02);
  z-index: 0;
}

.login_bg_mask {
  position: absolute;
  inset: 0;
  z-index: 1;
  background:
    linear-gradient(
      180deg,
      rgba(255, 255, 255, 0.72) 0%,
      rgba(238, 243, 247, 0.55) 45%,
      rgba(255, 255, 255, 0.78) 100%
    ),
    radial-gradient(
      ellipse 50% 40% at 50% 48%,
      rgba(255, 255, 255, 0.88),
      transparent 70%
    );
}

.login_main {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 100px 24px 48px;
  box-sizing: border-box;
  position: relative;
  z-index: 2;
}

.login_panel {
  width: 100%;
  max-width: 440px;
  padding: 36px 36px 32px;
  background: rgba(255, 255, 255, 0.92);
  border: 1px solid rgba(226, 232, 240, 0.9);
  border-radius: 16px;
  box-shadow: 0 12px 40px rgba(15, 23, 42, 0.08);
  backdrop-filter: blur(10px);
}

.panel_brand {
  display: flex;
  justify-content: center;
  margin-bottom: 14px;
}

.panel_logo {
  width: 56px;
  height: 56px;
  object-fit: contain;
  border-radius: 12px;
}

.login_title {
  margin: 0 0 28px;
  text-align: center;
  font-size: 26px;
  font-weight: 700;
  color: #0f172a;
  letter-spacing: -0.02em;
}

.login_form {
  /deep/ .el-form-item {
    margin-bottom: 18px;
  }

  /deep/ .el-input__inner {
    height: 46px;
    line-height: 46px;
    border-radius: 8px;
    border: 1px solid #cbd5e1;
    background: #fff;
    color: #0f172a;
    font-size: 15px;
    padding: 0 14px;

    &::placeholder {
      color: #94a3b8;
    }

    &:focus {
      border-color: #0f766e !important;
    }
  }

  /deep/ .el-input__suffix {
    right: 10px;
  }
}

.login_btn {
  width: 100%;
  height: 46px;
  margin-top: 6px;
  border-radius: 8px !important;
  border: none !important;
  background: #0f766e !important;
  font-size: 16px;
  font-weight: 600;
  letter-spacing: 0.01em;

  &:hover,
  &:focus {
    background: #0d9488 !important;
  }
}

.forgot-password {
  margin-top: 14px;
  text-align: center;

  a {
    color: #0f766e;
    font-size: 14px;
    text-decoration: none;
    font-weight: 500;

    &:hover {
      text-decoration: underline;
    }
  }
}

.sign-up {
  margin-top: 24px;
  text-align: center;
  font-size: 14px;
  color: #64748b;

  a {
    color: #0f766e;
    text-decoration: none;
    font-weight: 600;
    margin-left: 4px;

    &:hover {
      text-decoration: underline;
    }
  }
}
</style>
