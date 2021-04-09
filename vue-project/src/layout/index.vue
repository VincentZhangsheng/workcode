<template>
  <div class="app-wrapper">
    <Header />
    <div class="main-container">
      <el-container>
        <el-aside :width="isCollapse ? '80px' : '200px'">
          <div v-if="isCollapse" @click="showMenu">aa</div>
          <div v-else class="menu-container">
            <div class="menu-title">
              <span class="title-text">一级导航</span>
              <span class="fold-icon" @click="collapseMenu">折叠</span>
            </div>
            <sider-menu></sider-menu>
          </div>
        </el-aside>
        <el-main>
          <tags-view></tags-view>
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
    TagsView: () => import("./TagsView"),
  },
  data() {
    return {
      isCollapse: false,
      data: [],
    };
  },
  created() {
  },
  methods: {
    collapseMenu() {
      this.isCollapse = true;
    },
    showMenu() {
      this.isCollapse = false;
    }
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
  margin-right: 10px;
  height: 100%;
  border: 1px solid #A8C3E9;
  background-color: #fff;
  color: #333;
  transition: 0.3s width ease-in-out;

  .menu-container{
    width: 100%;
    height: 100%;
    overflow-x: hidden;
    overflow-y: auto;
  }
  .menu-title{
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-sizing: border-box;
    padding: 0 12px;
    width: 100%;
    height: 44px;
    border-bottom: 1px solid #99BAE7;
    background: linear-gradient(180deg, #B6CDEE 0%, #B9CFEE 29%, #C0CBDB 46%, #5286D0 50%, #9FC0EE 73%, #D7E4F5 100%);
    overflow: hidden;

    .title-text{
      flex: 1;
      white-space: nowrap;
      overflow: hidden;
      font-size: 18px;
      color: #333;
    }
    .fold-icon{
      cursor: pointer;
    }
  }
}

.main-container {
  position: relative;
  padding: 50px 10px 20px;
  box-sizing: border-box;
  height: 100vh;
  width: 100%;
  background: #EAF1F6;
}

.el-main{
  padding: 0;
  border: 1px solid #99BAE7;
  background: #fff;
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
