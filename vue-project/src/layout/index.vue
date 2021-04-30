<template>
  <div class="app-wrapper">
    <Header />
    <div class="main-container">
      <el-container>
        <el-aside :width="isCollapse ? '20px' : '200px'">
          <div
            v-if="isCollapse"
            class="unfold-icon"
          >
            <i
              class="el-icon-d-arrow-right"
              @click="showMenu"
            ></i>
          </div>
          <div
            v-else
            class="menu-container"
          >
            <div class="menu-title">
              <span class="title-text">导航</span>
              <span
                class="fold-icon"
                @click="collapseMenu"
              >
                <i class="el-icon-d-arrow-left"></i>
              </span>
            </div>
            <sider-menu></sider-menu>
          </div>
        </el-aside>
        <el-main>
          <tags-view></tags-view>
          <!-- <router-view></router-view> -->
          <div class="app-main">
            <transition name="fade-transform" mode="out-in">
              <keep-alive include="AppContainer">
                <router-view :key="key" />
              </keep-alive>
            </transition>
          </div>
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
    TagsView: () => import("./TagsView")
  },
  data() {
    return {
      isCollapse: false,
      data: []
    };
  },
  created() {},
  methods: {
    collapseMenu() {
      this.isCollapse = true;
    },
    showMenu() {
      this.isCollapse = false;
    }
  },
  computed: {
    key() {
      return this.$route.fullPath;
    },
  },
};
</script>

<style lang="scss">
.app-wrapper {
  width: 100%;
  height: 100%;
  position: relative;
}
.el-container {
  height: 100%;
}
.el-aside {
  margin-right: 10px;
  height: 100%;
  color: $color_3;
  transition: 0.3s width ease-in-out;

  .menu-container {
    width: 200px;
    height: 100%;
    overflow-x: hidden;
    overflow-y: auto;
    border: 1px solid #a8c3e9;
    box-sizing: border-box;
    background-color: #fff;
  }
  .menu-title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-sizing: border-box;
    padding: 0 12px;
    width: 100%;
    height: 44px;
    border-bottom: 1px solid #99bae7;
    background: linear-gradient(
      180deg,
      #b6cdee 0%,
      #b9cfee 29%,
      #c0cbdb 46%,
      #5286d0 50%,
      #9fc0ee 73%,
      #d7e4f5 100%
    );
    overflow: hidden;

    .title-text {
      flex: 1;
      white-space: nowrap;
      overflow: hidden;
      font-size: 18px;
      color: $color_3;
    }
    .fold-icon {
      width: 18px;
      height: 18px;
      background: linear-gradient(180deg, #fcfcfc 2%, #cccccc 100%);
      box-shadow: 0px 1px 3px 0px #ffffff;
      border-radius: 2px;
      border: 1px solid #9bbde9;
      text-align: center;
      line-height: 18px;
      cursor: pointer;
      > i {
        font-size: 14px;
        color: #5584b3;
      }
    }
  }

  .unfold-icon {
    position: fixed;
    left: 4px;
    top: 40px;
    bottom: 0;
    border-left: 1px solid #a8c3e9;
    i {
      display: block;
      position: absolute;
      left: -1px;
      top: 50%;
      margin-top: -20px;
      width: 18px;
      height: 40px;
      text-align: center;
      line-height: 40px;
      background: #eaf1f6;
      border: 1px solid #a8c3e9;
      border-left: none;
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
  background: #eaf1f6;
}

.el-main {
  padding: 0;
  // border: 1px solid #99BAE7;
  // background: #fff;
}

.view-container {
  position: relative;
  box-sizing: border-box;
  height: 100%;
  transition: margin-left 0.28s;
  background: #fff;
}

.table-page {
  box-sizing: border-box;
  height: calc(100% - 30px);
  .table-container {
    padding: 10px;
    height: calc(100% - 40px);
    box-sizing: border-box;
    background: #fff;
    border: 1px solid #99bae7;
    border-top: none;
    ::v-deep .eff-table__body-row.row-add .eff-table__column {
      background: #dde8ce;
    }
    ::v-deep .eff-table__body-row.row-edit .eff-table__column {
      background: #ffe2e2;
    }
    ::v-deep .eff-table__body-row.row-delete .eff-table__column {
      background: #cfcee8;
    }
  }
}
</style>
