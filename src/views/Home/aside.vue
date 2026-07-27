<template>
  <div class="nav_boxs">
    <div class="left_navbar">
      <AsideItem
        :asideActiveIndex="asideActiveIndex"
        :routeMenu="displayRouteMenu"
        @menuClick="menuClick"
      />
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import { routes } from "../../router";
import AsideItem from "./asideitem";
import { unitMenuAll } from "../../utils/unitMenu";

export default {
  name: "Aside",
  props: {
    isCollapse: {
      type: Boolean,
      default: () => false,
    },
  },
  data() {
    return {
      userInfo: {},
      companyName: "",
      asideActiveIndex: "",
      defaultOpend: [],
      routes: routes[0].children,
    };
  },
  components: { AsideItem },
  computed: {
    ...mapState("naviBar", ["routers", "routeMenu"]),
    displayRouteMenu() {
      const company =
        this.companyName ||
        this.readCompanyName() ||
        "Company project";
      return (this.routeMenu || []).map((item) => {
        if (item.RouterName === "XxxProject" || item.name === "XXX project") {
          return { ...item, name: company };
        }
        return item;
      });
    },
  },
  watch: {
    routeMenu(val) {
      if (val && val.length > 0) {
        let asideId = sessionStorage.getItem("asideId");
        if (asideId) {
          this.getPermissionVoTreeActive(val, asideId);
        }
      }
    },
    $route(val) {
      let that = this;
      if (val.meta.parentName && !val.meta.parentParentName) {
        this.asideActiveIndex = val.meta.parentName;
      } else if (val.meta.parentParentName) {
        this.asideActiveIndex = val.meta.parentParentName;
      } else {
        this.asideActiveIndex = val.name;
      }
      let deep = function (data) {
        data.map((item) => {
          if (item.children) {
            deep(item.children);
          } else {
            if (item.RouterName == val.name) {
              that.menuClick(item);
            }
          }
        });
      };
      deep(that.routeMenu);
    },
    deep: true,
  },
  created() {
    if (sessionStorage.getItem("userInfo")) {
      this.userInfo = JSON.parse(sessionStorage.getItem("userInfo"));
    }
    this.companyName = this.readCompanyName();
    this.loadCompanyName();
    window.addEventListener("company-name-updated", this.onCompanyNameUpdated);
    if (this.$route.meta.parentName && !this.$route.meta.parentParentName) {
      this.asideActiveIndex = this.$route.meta.parentName;
    } else if (this.$route.meta.parentParentName) {
      this.asideActiveIndex = this.$route.meta.parentParentName;
    } else {
      this.asideActiveIndex = this.$route.name;
    }
  },
  beforeDestroy() {
    window.removeEventListener(
      "company-name-updated",
      this.onCompanyNameUpdated,
    );
  },
  methods: {
    ...mapActions("naviBar", ["getMenu", "getBtns", "sendUnit", "sendEqu"]),
    readCompanyName() {
      try {
        const info = JSON.parse(sessionStorage.getItem("userInfo") || "{}");
        return (
          info.company_name ||
          info.companyName ||
          info.company ||
          sessionStorage.getItem("companyName") ||
          ""
        );
      } catch (e) {
        return sessionStorage.getItem("companyName") || "";
      }
    },
    async loadCompanyName() {
      const cached = this.readCompanyName();
      if (cached) {
        this.companyName = cached;
      }
      try {
        if (this.$api && this.$api.profileCompany) {
          const res = await this.$api.profileCompany({});
          if (res && res.code == 0 && res.data) {
            const name =
              res.data.company_name ||
              res.data.companyName ||
              res.data.name ||
              "";
            if (name) {
              this.applyCompanyName(name);
              return;
            }
          }
        }
      } catch (e) {
        /* ignore */
      }
      try {
        if (this.$api && this.$api.profileMe) {
          const me = await this.$api.profileMe({});
          if (me && me.code == 0 && me.data) {
            const name =
              me.data.company_name ||
              me.data.companyName ||
              "";
            if (name) this.applyCompanyName(name);
          }
        }
      } catch (e) {
        /* keep cached / fallback */
      }
    },
    applyCompanyName(name) {
      if (!name) return;
      this.companyName = name;
      sessionStorage.setItem("companyName", name);
      try {
        const info = JSON.parse(sessionStorage.getItem("userInfo") || "{}");
        info.company_name = name;
        info.companyName = name;
        sessionStorage.setItem("userInfo", JSON.stringify(info));
      } catch (e) {
        /* ignore */
      }
    },
    onCompanyNameUpdated(event) {
      const name =
        (event && event.detail && event.detail.companyName) ||
        this.readCompanyName();
      if (name) this.companyName = name;
    },
    async menuClick(item) {
      if (!item || !item.RouterName || item.menuLevel === "group") return;
      sessionStorage.setItem("asideId", item.id);
      sessionStorage.setItem("asideParentId", item.parentId);
      sessionStorage.removeItem("unitId");
      sessionStorage.removeItem("equId");
      this.getPermissionVoTreeType4(item);
      this.asideActiveIndex = item.RouterName;
      this.$emit("menuClick", item);
    },
    async getPermissionVoTreeType4(item) {
      let res = JSON.parse(JSON.stringify(unitMenuAll)),
        tempData = [];
      res.data.map((unit) => {
        if (unit.parentId == item.id) {
          tempData.push(unit);
        }
      });
      res.data = tempData;
      if (res.code == "0") {
        if (res.data && res.data.length > 0) {
          this.sendUnit(res.data);
        } else {
          this.$router.push({ name: item.RouterName });
          this.sendUnit([]);
        }
      }
    },
    getPermissionVoTreeActive(arr, id) {
      if (!arr) return true;
      arr.map((item) => {
        if (item.children) {
          this.getPermissionVoTreeActive(item.children, id);
        }
        if (item.id == id) {
          this.asideActiveIndex = item.RouterName;
          this.getPermissionVoTreeType4(item);
        }
      });
    },
  },
};
</script>

<style lang="less" scoped>
.nav_boxs {
  width: 100%;
  height: 100%;
  padding: 8px 8px 4px;
  background: transparent;
  border: none;
  box-shadow: none;
  box-sizing: border-box;
  overflow: auto;

  .left_navbar {
    width: 100%;
  }
}
</style>
