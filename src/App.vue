<template>
  <div id="app">
    <router-view v-if="isRouterAlive"></router-view>
  </div>
</template>

<script>
export default {
  name: "App",
  provide() {
    return {
      reload: this.reload,
    };
  },
  data() {
    return {
      isRouterAlive: true,
    };
  },
  methods: {
    reload() {
      //123
      this.isRouterAlive = false;
      this.$nextTick(() => {
        this.isRouterAlive = true;
      });
    },
  },
  components: {},
  mounted() {
    // window.addEventListener(
    //   "hashchange",
    //   () => {
    //     var currentPath = window.location.hash.slice(1); // 获取输入的路由
    //       this.$router.push(currentPath); // 动态跳转
    //   },
    //   false
    // );
  },
};
</script>

<style>
#app {
  width: 100%;
  height: 100%;
}
</style>
