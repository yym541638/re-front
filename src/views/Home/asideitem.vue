<template>
  <div class="aside-menu-tree">
    <div v-for="item in routeMenu" :key="item.id" class="menu-block">
      <div v-if="item.dividerBefore" class="menu-divider"></div>

      <div v-if="item.children && item.children.length" class="menu-group">
        <div class="menu-group-title">
          <i :class="['menu-icon', iconClass(item)]" aria-hidden="true"></i>
          <span class="menu-text">{{ item.name }}</span>
        </div>
        <div class="menu-children">
          <div
            v-for="(child, cIndex) in item.children"
            :key="child.id"
            class="menu-leaf"
            :class="{
              'is-active': asideActiveIndex === child.RouterName,
              'is-last': cIndex === item.children.length - 1,
            }"
            @click="menuClick(child)"
          >
            <span class="tree-branch" aria-hidden="true"></span>
            <i
              :class="['menu-icon', 'menu-icon--sm', iconClass(child)]"
              aria-hidden="true"
            ></i>
            <span class="menu-text">{{ child.name }}</span>
            <span
              v-if="child.showStatus"
              class="status-dot"
              :class="{ 'is-on': asideActiveIndex === child.RouterName }"
            ></span>
          </div>
        </div>
      </div>

      <div
        v-else
        class="menu-item"
        :class="[
          levelClass(item),
          { 'is-active': asideActiveIndex === item.RouterName },
        ]"
        @click="menuClick(item)"
      >
        <i :class="['menu-icon', iconClass(item)]" aria-hidden="true"></i>
        <span class="menu-text">{{ item.name }}</span>
      </div>

      <div v-if="item.dividerAfter" class="menu-divider"></div>
    </div>
  </div>
</template>

<script>
const ICON_MAP = {
  ProjectOverview: "el-icon-s-data",
  XxxProject: "el-icon-folder-opened",
  RequestMaster: "el-icon-document",
  ControlTesting: "el-icon-s-check",
  GapAnalysis: "el-icon-data-analysis",
  PassingScores: "el-icon-trophy",
  ProjectSettings: "el-icon-user",
  SystemUsers: "el-icon-s-custom",
  RcmFinal: "el-icon-warning-outline",
  OperationLog: "el-icon-time",
};

export default {
  name: "AsideItem",
  props: {
    routeMenu: {
      type: Array,
      default: () => [],
    },
    asideActiveIndex: {
      type: String,
      default: "",
    },
  },
  methods: {
    iconClass(item) {
      return ICON_MAP[item.RouterName] || "el-icon-menu";
    },
    levelClass(item) {
      return {
        "is-top": item.menuLevel === "top",
        "is-sub": item.menuLevel === "sub",
        "is-group": item.menuLevel === "group",
      };
    },
    menuClick(item) {
      if (!item.RouterName || item.menuLevel === "group") return;
      this.$emit("menuClick", item);
    },
  },
};
</script>

<style lang="less" scoped>
.aside-menu-tree {
  padding: 4px 0 8px;
  color: #0f172a;
  font-family: var(--app-font);
}

.menu-divider {
  height: 1px;
  margin: 10px 8px;
  background: linear-gradient(
    90deg,
    transparent,
    #d7dee8 20%,
    #d7dee8 80%,
    transparent
  );
}

.menu-item,
.menu-group-title,
.menu-leaf {
  display: flex;
  align-items: center;
  min-height: 40px;
  padding: 0 10px;
  cursor: pointer;
  user-select: none;
  box-sizing: border-box;
  border-radius: 8px;
  transition: background 0.18s ease, color 0.18s ease;
}

.menu-item.is-top {
  font-weight: 700;
  font-size: 14px;
  letter-spacing: 0.01em;
}

.menu-item.is-sub {
  padding-left: 12px;
  font-size: 13px;
  font-weight: 500;
  color: #334155;
}

.menu-item.is-active,
.menu-leaf.is-active {
  background: rgba(15, 118, 110, 0.1);
  color: #0f766e;
}

.menu-item:hover,
.menu-leaf:hover {
  background: #f1f5f9;
}

.menu-group {
  margin: 2px 0;
}

.menu-group-title {
  padding-left: 12px;
  cursor: default;
  font-size: 13px;
  font-weight: 600;
  color: #475569;

  &:hover {
    background: transparent;
  }
}

.menu-children {
  position: relative;
  margin-left: 22px;
  padding-left: 12px;

  &::before {
    content: "";
    position: absolute;
    left: 0;
    top: 4px;
    bottom: 18px;
    width: 1px;
    background: #cbd5e1;
  }
}

.menu-leaf {
  position: relative;
  min-height: 36px;
  padding-left: 8px;
  padding-right: 8px;
  font-size: 13px;
  font-weight: 500;
  color: #334155;

  .tree-branch {
    position: absolute;
    left: -12px;
    top: 50%;
    width: 12px;
    height: 1px;
    background: #cbd5e1;
  }

  &.is-active {
    font-weight: 600;
  }
}

.menu-icon {
  flex-shrink: 0;
  width: 20px;
  margin-right: 10px;
  font-size: 16px;
  color: #64748b;
  text-align: center;
  line-height: 1;

  &--sm {
    width: 16px;
    margin-right: 8px;
    font-size: 14px;
  }
}

.menu-item.is-active .menu-icon,
.menu-leaf.is-active .menu-icon {
  color: #0f766e;
}

.menu-text {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  line-height: 1.3;
}

.status-dot {
  flex-shrink: 0;
  width: 8px;
  height: 8px;
  margin-left: 8px;
  border: 1.5px solid #94a3b8;
  border-radius: 50%;
  box-sizing: border-box;
  background: #fff;
  transition: all 0.18s ease;

  &.is-on {
    border-color: #0f766e;
    background: #0f766e;
    box-shadow: 0 0 0 3px rgba(15, 118, 110, 0.16);
  }
}
</style>
