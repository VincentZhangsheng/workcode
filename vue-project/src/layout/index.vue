<template>
  <div class="app-wrapper">
    <Header />
    <div class="main-container">
      <el-container>
        <el-aside width="200px">
          <sider-menu></sider-menu>
        </el-aside>
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </div>
  </div>
</template>

<script>

export default {
  name: "Layout",
  components: {
    Header: () => import("./Header"),
    SiderMenu: () => import("./SiderMenu"),
  },
  data() {
    return {
      data: [],
    };
  },
  created() {
  },
  methods: {
  }
};
</script>

<style lang="scss" scoped>
.app-wrapper {
  width: 100%;
  height: 100%;
  position: relative;
}
.el-container{
  height: 100%;
}
.el-aside {
  height: 100%;
  background-color: #D3DCE6;
  color: #333;
  overflow-y: scroll;
}

.main-container {
  position: relative;
  padding: 50px 10px 20px;
  box-sizing: border-box;
  height: 100vh;
  width: 100%;
  // background: #a2cfee;
}

.view-container {
  position: relative;
  box-sizing: border-box;
  height: 100%;
  transition: margin-left 0.28s;
  background: #fff;
}

// .main-active {
//   margin-left: 71px !important;
// }
</style>
