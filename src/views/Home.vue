<template>
  <div class="common_body">
    <div
      :class="[isCollapse ? 'common_aside_small' : 'common_aside']"
      v-if="showHead"
    >
      <div class="common_logo">
        <img
          class="brand_logo"
          src="@/assets/brand/complimind-logo.png"
          alt="CompliMind"
        />
        <div class="brand_text" v-if="!isCollapse">
          <span class="brand_name">CompliMind</span>
          <span class="brand_sub">Compliance Hub</span>
        </div>
      </div>
      <div class="home_aside">
        <Aside
          ref="Aside"
          :isCollapse="isCollapse"
          @sendUnit="sendUnit"
          @menuClick="menuClick"
        />
      </div>
      <div class="hamburger_icon" @click="hamburgerChange">
        <i
          :class="[isCollapse ? 'el-icon-s-unfold' : 'el-icon-s-fold']"
        ></i>
      </div>
    </div>
    <div class="common_section">
      <div
        class="common_header"
        :class="{
          common_header_special:
            $route.name == 'olperfexp' || $route.name == 'thermalperfexp',
        }"
      >
        <Header ref="Header" :unitParent="unitParent"></Header>
      </div>
      <div class="checkTab">
        <el-tag
          v-for="(tag, index) in tags"
          :key="tag.id || index"
          :closable="true"
          :effect="tag.name === activeTabName ? 'dark' : 'plain'"
          @click="clickTab(tag.RouterName, tag.name, tag.id)"
          @close="closeTab(tag, index)"
        >
          <div class="condition" v-show="tag.name === activeTabName"></div>
          {{ tag.name }}
        </el-tag>
      </div>
      <router-view
        class="common_parents"
        :class="{
          common_parents_special:
            $route.name == 'olperfexp' || $route.name == 'thermalperfexp',
        }"
      />
    </div>
  </div>
</template>
<script>
import { mapState } from "vuex";
import Aside from "./Home/aside.vue";
import Header from "./Home/header.vue";
import { equMenuAll } from "../utils/equMenu";
import { refreshSystemRole, persistSystemRole } from "../utils/roles";
export default {
  data() {
    return {
      // whichName: "状态监测",
      // tags: this.$store.state.tagsArr,
      showHead: true,
      show: false,

      isCollapse: false,
      unitParent: {}, //机组父级
      equMenu: [],
      roleReady: false,
    };
  },
  components: {
    Aside,
    Header,
  },
  computed: {
    ...mapState("naviBar", ["routers", "routeMenu"]),
    tags() {
      return this.$store.state.tagsArr;
    },
    activeTabName() {
      return this.$store.state.whichName;
    },
  },
  async created() {
    this.equMenu = equMenuAll;
    // 进入系统时刷新系统角色，保证 System Users 菜单可见性正确
    try {
      await refreshSystemRole(this.$api);
      // 过渡：当前邮箱账号强制管理员（后端补齐 system_role 后可删）
      const info = JSON.parse(sessionStorage.getItem("userInfo") || "{}");
      const identity = [
        info.email,
        info.account,
        info.username,
        info.name,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      if (identity.includes("83261582@qq.com")) {
        persistSystemRole("COMP_ADMIN");
      }
    } catch (e) {
      /* ignore */
    }
    this.roleReady = true;
    this.$nextTick(() => {
      if (this.$refs.Aside) this.$refs.Aside.$forceUpdate();
    });
    // 初始化页签数据
    if (sessionStorage.getItem("tags")) {
      try {
        const savedTags = JSON.parse(sessionStorage.getItem("tags"));
        this.$store.commit("UPDATE_TAGS", savedTags);
      } catch (e) {
        console.error("sessionStorage tags 解析失败");
      }
    }
    // 只在首次加载时设置激活状态，避免路由跳转时重置
    if (!this.$store.state.tagsArr || this.$store.state.tagsArr.length === 0) {
      if (
        this.$route.name === "RequestMaster" &&
        this.$route.query.projectName
      ) {
        const projectName = this.$route.query.projectName;
        this.$store.commit("SET_ACTIVE_TAB", `${projectName}-RequestMaster`);
      } else {
        this.$store.commit(
          "SET_ACTIVE_TAB",
          this.$route.meta?.name || "ProjectOverview",
        );
      }
    }
  },
  watch: {
    // 监听路由变化，更新标签名称
    $route(to, from) {
      if (to.name === "RequestMaster" && to.query.projectName) {
        const projectName = to.query.projectName;
        const newTagName = `${projectName}-RequestMaster`;
        // 检查标签是否已存在
        const existingTag = this.$store.state.tagsArr.find(
          (tag) => tag.RouterName === "RequestMaster",
        );
        if (existingTag) {
          // 更新现有标签名称
          const updatedTags = this.$store.state.tagsArr.map((tag) => {
            if (tag.RouterName === "RequestMaster") {
              return { ...tag, name: newTagName };
            }
            return tag;
          });
          this.$store.commit("UPDATE_TAGS", updatedTags);
          // 立即更新激活状态
          this.$store.commit("SET_ACTIVE_TAB", newTagName);
        } else {
          // 添加新标签
          const newTab = {
            name: newTagName,
            RouterName: "RequestMaster",
            id: "1428549913133977602",
          };
          this.$store.commit("ADD_TAG", newTab);
          // 立即更新激活状态
          this.$store.commit("SET_ACTIVE_TAB", newTagName);
        }
      } else if (to.name === "RequestMaster" && !to.query.projectName) {
        // 如果没有projectName参数，使用默认标签名称
        this.$store.commit("SET_ACTIVE_TAB", "RequestMaster");
      }
    },
    // 监听标签数组变化，强制更新组件
    tags: {
      handler() {
        this.$nextTick(() => {
          this.$forceUpdate();
        });
      },
      deep: true,
    },
  },
  methods: {
    getEffect(tag) {
      return this.$store.state.whichName === tag.name ? "dark" : "plain";
    },
    hamburgerChange() {
      this.isCollapse = !this.isCollapse;
      this.$emit("hamburgerChange", this.isCollapse);
    },
    menuClick(item) {
      const newTab = {
        name: item.name,
        RouterName: item.RouterName,
        id: item.id,
      };

      // 👇 使用 mutation 添加页签
      this.$store.commit("ADD_TAG", newTab);

      // 👇 更新当前激活页签名称
      this.$store.commit("SET_ACTIVE_TAB", newTab.name);

      // 👇 存入 sessionStorage
      sessionStorage.setItem("asideId", item.id);
    },
    clickTab(url, name, id) {
      const query = {};
      if (url === "RequestMaster") {
        const projectId = sessionStorage.getItem("currentProjectId");
        const projectName = sessionStorage.getItem("currentProjectName");
        if (projectId) query.projectId = projectId;
        if (projectName) query.projectName = projectName;
      }
      if (url === "RequestIndividual") {
        const requestMasterId = sessionStorage.getItem(
          "currentRequestMasterId",
        );
        const masterName = sessionStorage.getItem("currentRequestMasterName");
        const projectId = sessionStorage.getItem("currentProjectId");
        const projectName = sessionStorage.getItem("currentProjectName");
        if (requestMasterId) query.requestMasterId = requestMasterId;
        if (masterName) query.masterName = masterName;
        if (projectId) query.projectId = projectId;
        if (projectName) query.projectName = projectName;
      }
      this.$router.push({ name: url, query });
      this.$store.commit("SET_ACTIVE_TAB", name);
      sessionStorage.setItem("asideId", id);
    },
    closeTab(tab, index1) {
      // 删除 tab
      this.$store.commit("REMOVE_TAG", tab);
      // 如果删除的是当前页签，则跳转到最后一个打开的页签
      if (tab.RouterName === this.$route.name) {
        const lastTab =
          this.$store.state.tagsArr[this.$store.state.tagsArr.length - 1];
        if (lastTab) {
          this.$router.push({ name: lastTab.RouterName });
          this.$store.commit("SET_ACTIVE_TAB", lastTab.name);
          sessionStorage.setItem("asideId", lastTab.id);
        } else {
          // 没有页签时回到默认页
          const defaultTab = {
            name: "ProjectOverview",
            RouterName: "ProjectOverview",
            id: "1228549913133977602",
          };
          this.$store.commit("ADD_TAG", defaultTab);
          this.$router.push({ name: defaultTab.RouterName });
          this.$store.commit("SET_ACTIVE_TAB", defaultTab.name);
          sessionStorage.setItem("asideId", defaultTab.id);
        }
      }
    },
    // 获取机组菜单
    sendUnit(item) {
      this.unitParent = item;
    },
  },
};
</script>
<style lang="less" scoped>
.common_logo {
  position: relative;
  height: 56px !important;
  width: 100%;
  gap: 10px;

  .brand_logo {
    width: 32px;
    height: 32px;
    object-fit: contain;
    border-radius: 8px;
    flex-shrink: 0;
    background: #fff;
  }

  .brand_text {
    display: flex;
    flex-direction: column;
    line-height: 1.15;
    min-width: 0;
  }

  .brand_name {
    font-size: 15px;
    font-weight: 700;
    color: #0f172a;
    letter-spacing: 0.04em;
  }

  .brand_sub {
    font-size: 11px;
    color: #64748b;
    font-weight: 500;
  }
}

.common_header_special {
  height: 0;
  margin: 0;
  padding: 0;
  border: none;
  box-shadow: none;
  overflow: hidden;
}

.common_aside {
  width: 268px;
}

.common_aside_small {
  width: 80px !important;

  .brand_text {
    display: none;
  }

  .common_logo {
    justify-content: center;
    padding: 0;
  }
}

@media screen and (max-width: 1024px) {
  .common_aside_small {
    width: 60px !important;
  }

  .common_section {
    width: calc(100% - 72px) !important;
  }
}

@media screen and (max-width: 768px) {
  .common_aside_small {
    width: 100% !important;
    height: auto !important;
  }
}

.home_aside::-webkit-scrollbar {
  width: 4px;
}

.home_aside {
  width: 100%;
  overflow-y: auto;
  flex: 1;
  height: auto;
  font-family: var(--app-font);
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  color: var(--app-text);
  border-top: none;
  background: transparent;
}

/deep/.el-breadcrumb {
  font-family: var(--app-font) !important;
  font-size: 14px !important;
  font-weight: 400 !important;
  display: flex;
  align-items: center;
}
</style>
<style>
.el-tag {
  margin-right: 8px;
  cursor: pointer;
  font-family: var(--app-font);
  font-weight: 500;
  height: 30px !important;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 999px !important;
  padding: 0 12px !important;
  transition: all 0.2s ease;
}
.el-tag--plain .el-tag__close {
  color: #64748b;
}
.el-tag--dark {
  font-size: 12px;
  border: none !important;
  background-color: #0f766e !important;
  color: #fff !important;
}
.el-tag .el-icon-close {
  font-weight: 500;
  margin-top: 0;
}
.el-tag--plain .el-tag__close:hover,
.el-tag--dark .el-tag__close:hover {
  color: #fff;
  background-color: rgba(15, 118, 110, 0.85);
  font-weight: 500 !important;
}

.el-tag--plain {
  border: 1px solid #d0d7e2 !important;
  background-color: #fff !important;
  color: #334155 !important;
  font-size: 12px;
}

.el-tag--plain:hover {
  border-color: #0f766e !important;
  color: #0f766e !important;
}

.el-popover {
  color: #0f172a;
  height: auto;
  min-height: 100px;
  max-width: 360px;
  padding: 20px 0 30px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
}
.el-popper[x-placement^="left"] .popper__arrow::after {
  border-left-color: rgba(0, 0, 0, 0.5);
}

.el-dropdown-menu__item:not(.is-disabled):hover {
  color: #0f766e !important;
  background: rgba(15, 118, 110, 0.08) !important;
}
.el-dropdown-menu__item {
  color: #0f172a !important;
  font-family: var(--app-font) !important;
  font-size: 14px !important;
  font-style: normal !important;
  font-weight: 400 !important;
}

.common_parents_special {
  padding: 0;
  height: 100%;
  overflow-y: hidden !important;
}

.checkTab {
  width: 100%;
  min-height: 40px;
  margin-bottom: 10px !important;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 6px 0;
  padding: 4px 6px;
  box-sizing: border-box;
  background: rgba(255, 255, 255, 0.55);
  border: 1px solid var(--app-border, #e2e8f0);
  border-radius: 10px;
}
.condition {
  width: 7px;
  height: 7px;
  background-color: #ffffff;
  border-radius: 50%;
  margin-right: 6px;
}
</style>
