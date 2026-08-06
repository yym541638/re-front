<template>
  <div class="header" :class="'header--' + variant">
    <div class="logo_area" @click="$router.push('/')">
      <img
        class="brand_logo"
        src="@/assets/brand/complimind-logo.png"
        alt="CompliMind"
      />
      <div class="brand_copy">
        <span class="brand_name">CompliMind</span>
        <span class="brand_sub">Enterprise GRC</span>
      </div>
    </div>
    <div class="nav_menu">
      <el-dropdown
        class="nav_item"
        trigger="hover"
        @command="handleDropdownCommand"
        transition="dropdown-fade"
      >
        <span class="dropdown-toggle">
          Products
          <i class="el-icon-caret-bottom"></i>
        </span>
        <el-dropdown-menu slot="dropdown" class="custom-dropdown-menu">
          <el-dropdown-item command="soc2"
            >SOC2 <i class="el-icon-right"></i
          ></el-dropdown-item>
          <el-dropdown-item command="iso"
            >ISO <i class="el-icon-right"></i
          ></el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <el-dropdown class="nav_item" trigger="hover">
        <span class="dropdown-toggle">
          Solutions
          <i class="el-icon-caret-bottom"></i>
        </span>
        <el-dropdown-menu slot="dropdown" class="custom-dropdown-menu">
        </el-dropdown-menu>
      </el-dropdown>
      <el-dropdown class="nav_item" trigger="hover">
        <span class="dropdown-toggle">
          Company
          <i class="el-icon-caret-bottom"></i>
        </span>
        <el-dropdown-menu slot="dropdown" class="custom-dropdown-menu">
        </el-dropdown-menu>
      </el-dropdown>

      <template v-if="isLoggedIn">
        <el-dropdown class="nav_item user_dropdown" trigger="hover" @command="handleDropdownCommand">
          <span class="user_info">
            {{ userName }}
            <i class="el-icon-caret-bottom"></i>
          </span>
          <el-dropdown-menu slot="dropdown" class="custom-dropdown-menu">
            <el-dropdown-item command="profile">Personal Profile</el-dropdown-item>
            <el-dropdown-item command="logout">Log out</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </template>
      <template v-else>
        <div class="nav_item login_btn" @click="handleAction">
          {{ displayButtonText }}
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import { clearCurrentProject } from "../../utils/projectContext";

export default {
  name: "CommonHeader",
  props: {
    buttonText: {
      type: String,
      default: "Login",
    },
    buttonAction: {
      type: String,
      default: "login",
    },
    returnPath: {
      type: String,
      default: "/",
    },
    /** dark: 深色着陆页；light: 登录/注册等白底页 */
    variant: {
      type: String,
      default: "dark",
    },
  },
  data() {
    return {
      isLoggedIn: false,
      userName: "",
    };
  },
  computed: {
    // 计算属性，根据当前路由和登录状态确定显示的按钮文本
    displayButtonText() {
      if (this.isLoggedIn) {
        return this.userName;
      }
      return this.buttonText || "Login";
    },
  },
  mounted() {
    this.checkLoginStatus();
    // 监听路由变化，更新登录状态
    this.$router.beforeEach((to, from, next) => {
      this.checkLoginStatus();
      next();
    });
  },
  methods: {
    checkLoginStatus() {
      const userInfo = sessionStorage.getItem("userInfo");
      if (userInfo) {
        try {
          const parsedUserInfo = JSON.parse(userInfo);
          this.isLoggedIn = true;
          this.userName = parsedUserInfo.name || parsedUserInfo.account;
        } catch (error) {
          console.error("Failed to parse user info:", error);
          this.isLoggedIn = false;
          this.userName = "";
        }
      } else {
        this.isLoggedIn = false;
        this.userName = "";
      }
    },
    handleAction() {
      const currentRoute = this.$route.name;
      if (currentRoute === "login") {
        // 已在登录页，点击 Login 不再跳转
        return;
      }
      if (this.buttonAction === "back") {
        this.$router.push({ path: this.returnPath || "/" });
        return;
      }
      this.$router.push({ name: "login" });
    },
    handleDropdownCommand(command) {
      if (command === "soc2" || command === "iso") {
        const product = command;
        // 未登录：进入产品介绍/购买前流程（避免停在登录页无反馈）
        if (!this.isLoggedIn) {
          if (product === "iso") {
            this.$message.info("ISO product is coming soon");
            return;
          }
          // SOC2 可先看购买页；未登录也可浏览，下单时再登录
          this.$router.push({
            path: "/purchase",
            query: { product: "soc2" },
          });
          return;
        }

        // 已登录：按是否已购服务分流
        let purchaseStatus = 0;
        try {
          const raw = sessionStorage.getItem("userInfo");
          const info = raw ? JSON.parse(raw) : {};
          // login 返回的 purchase_status 可能存在独立字段，兜底从 session 读取
          const stored = sessionStorage.getItem("purchase_status");
          purchaseStatus =
            stored != null
              ? Number(stored)
              : Number(info.purchase_status || 0);
        } catch (e) {
          purchaseStatus = 0;
        }

        if (product === "iso") {
          this.$message.info("ISO product is coming soon");
          return;
        }

        if (purchaseStatus > 0) {
          this.$router.push({
            path: "/products",
            query: { product: "soc2" },
          });
        } else {
          this.$router.push({
            path: "/purchase",
            query: { product: "soc2" },
          });
        }
        return;
      }

      if (command === "logout") {
        this.handleLogout();
        return;
      }
      if (command === "profile") {
        this.handleProfile();
      }
    },
    handleLogout() {
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("userInfo");
      sessionStorage.removeItem("purchase_status");
      sessionStorage.removeItem("system_role");
      localStorage.removeItem("account");
      sessionStorage.removeItem("tags");
      clearCurrentProject();
      this.$store.commit("UPDATE_TAGS", [
        {
          name: "ProjectOverview",
          RouterName: "ProjectOverview",
          id: "1228549913133977602",
        },
      ]);
      this.isLoggedIn = false;
      this.userName = "";
      this.$router.push({ name: "login" });
    },
    handleProfile() {
      // 跳转到用户个人资料页面
      console.log("Go to profile page");
      // 这里可以添加跳转到个人资料页面的逻辑
    },
  },
};
</script>

<style lang="less" scoped>
.header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  width: 100%;
  font-family: "Segoe UI", "PingFang SC", "Microsoft YaHei", sans-serif;
  height: 72px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 48px;
  box-sizing: border-box;
  border-bottom: 1px solid transparent;

  .logo_area {
    display: flex;
    align-items: center;
    gap: 12px;
    cursor: pointer;
    min-width: 220px;

    .brand_logo {
      width: 40px;
      height: 40px;
      object-fit: contain;
      border-radius: 8px;
      background: #fff;
      flex-shrink: 0;
    }

    .brand_copy {
      display: flex;
      flex-direction: column;
      line-height: 1.15;
    }

    .brand_name {
      font-size: 16px;
      font-weight: 700;
      letter-spacing: 0.02em;
    }

    .brand_sub {
      font-size: 10px;
      font-weight: 600;
      letter-spacing: 0.04em;
      opacity: 0.75;
    }
  }

  .nav_menu {
    display: flex;
    align-items: center;

    .nav_item {
      margin-left: 28px;
      font-size: 15px;
      cursor: pointer;
      display: flex;
      align-items: center;
      font-weight: 500;

      i {
        margin-left: 5px;
        font-size: 12px;
        transition: transform 0.25s ease;
      }

      .dropdown-toggle {
        display: flex;
        align-items: center;
      }

      &:hover i {
        transform: rotate(180deg);
      }
    }

    .login_btn {
      padding: 7px 16px;
      border-radius: 4px;
      font-size: 14px;
      font-weight: 600;
    }

    .user_dropdown .user_info {
      display: flex;
      align-items: center;
      cursor: pointer;
      padding: 6px 10px;
      border-radius: 4px;
    }
  }

  &--dark {
    background: rgba(17, 17, 61, 0.92);
    backdrop-filter: blur(10px);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.25);
    color: #fff;

    .brand_name,
    .brand_sub,
    .nav_item {
      color: #fff;
    }

    .nav_item:hover {
      color: #93c5fd;
    }

    .login_btn {
      color: #fff;
      background: #2563eb;
      border: 1px solid #2563eb;
    }
  }

  &--light {
    background: rgba(255, 255, 255, 0.88);
    border-bottom-color: rgba(226, 232, 240, 0.9);
    box-shadow: none;
    color: #111827;
    backdrop-filter: blur(12px);

    .brand_name {
      color: #111827;
    }

    .brand_sub {
      color: #0f766e;
      opacity: 1;
    }

    .nav_item {
      color: #111827;
      position: relative;
      padding: 0 8px;
      height: 72px;

      &::before,
      &::after {
        content: "";
        position: absolute;
        top: 18px;
        bottom: 18px;
        width: 1px;
        background: #d1d5db;
      }

      &::before {
        left: -14px;
      }

      &::after {
        display: none;
      }

      &:hover {
        color: #2563eb;
      }
    }

    .login_btn {
      color: #111827;
      background: transparent;
      border: none;
      margin-left: 20px;
      height: 72px;
      display: flex;
      align-items: center;
      padding: 0 12px;

      &::before {
        content: "";
        position: absolute;
        left: -10px;
        top: 18px;
        bottom: 18px;
        width: 1px;
        background: #d1d5db;
      }

      &:hover {
        color: #2563eb;
      }
    }
  }
}
</style>
<style lang="less">
.custom-dropdown-menu {
  width: auto !important;
  min-width: 180px;
  margin-top: 8px;
  border-radius: 6px;
  box-shadow: 0 8px 24px rgba(15, 23, 42, 0.12);
  background-color: #ffffff;
  border: 1px solid #e5e7eb;
}

.custom-dropdown-menu .el-dropdown-menu__item {
  font-size: 14px !important;
  color: #111827;
  font-family: "Segoe UI", "PingFang SC", sans-serif !important;
  font-weight: 500 !important;
  padding: 10px 20px !important;
  border-bottom: 1px solid #f3f4f6 !important;
}

.custom-dropdown-menu .el-dropdown-menu__item:not(.is-disabled):hover {
  color: #2563eb !important;
  background-color: #eff6ff !important;
}

.custom-dropdown-menu .el-dropdown-menu__item:last-child {
  border-bottom: none !important;
}

.custom-dropdown-menu .el-icon-right {
  color: #9ca3af !important;
  margin-left: 8px;
}

.dropdown-fade-enter-active,
.dropdown-fade-leave-active {
  transition: opacity 0.25s, transform 0.25s;
}

.dropdown-fade-enter,
.dropdown-fade-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
