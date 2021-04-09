<template>
  <div class="tags-view-container">
    <el-scrollbar class="scrollbar-wrapper">
      <draggable
        class="tags-view-draggable"
        v-model="viewTabs"
        handle=".tags-view-item"
        forceFallback="true"
        group="cloumnSort"
        animation="500"
        @start="onStart"
        @end="onEnd"
      >
        <div
          v-click-outside="clickOutside"
          v-for="(item, index) in viewTabs"
          :key="index"
          class="tags-view-item"
          :class="{ active: item.active }"
          @click="triggerRouter(item)"
          @contextmenu.prevent="handleMenu(item, $event, index)"
        >
          <ul
            v-if="rightMenuShow(index)"
            class="rightMenu"
            :style="{ left: left + 'px', top: top + 'px' }"
          >
            <li class="rightItem" @click.stop="triggerClose(item)">
              关闭当前页签
            </li>
            <li class="rightItem" @click="closeOtherTab(item)">
              关闭其他页签
            </li>
            <li class="rightItem" @click="closeAllTab()">关闭所有页签</li>
          </ul>
          <span class="tags-view-title">{{ item.title }}</span>
          <template v-if="item.path != '/home'">
            <img
              class="tags-view-close"
              src="https://resource.pureh2b.com/SaaS/application/common/tags-view-close.png"
              alt="close"
              @click.stop="triggerClose(item)"
            />
          </template>
        </div>
      </draggable>
    </el-scrollbar>
  </div>
</template>

<script>
// import { mapGetters } from "vuex";
import _ from "lodash";

export default {
  name: "TagsView",
  components: {
    draggable: () => import("vuedraggable"),
  },
  computed: {
    // ...mapGetters(["viewTabs"]),
    viewTabs: {
      get() {
        return this.$store.getters.viewTabs;
      },
      set(value) {
        this.$store.dispatch("viewTabs/delVisitedView", value);
      },
    },
  },
  data() {
    return {
      left: 0,
      top: 0,
      home: { id: "0", title: "首页", path: "/" },
      rightMenuShowIndex: -1,
    };
  },
  methods: {
    clickOutside() {
      this.rightMenuShowIndex = -1;
    },
    rightMenuShow(index) {
      return this.rightMenuShowIndex == index;
    },
    closeAllTab() {
      this.rightMenuShowIndex = -1;
      this.$store.dispatch("viewTabs/delVisitedView", []);
    },

    closeOtherTab(tab) {
      this.rightMenuShowIndex = -1;
      let viewTabs = _.cloneDeep(this.viewTabs);
      let _index = viewTabs.findIndex(item => item.path == tab.path)
      if(viewTabs.length > 1 && !tab.active) {
        this.$router.push({ path: tab.path });
      }
      
      viewTabs.splice(0, viewTabs.length, tab)
      this.$store.dispatch("viewTabs/delVisitedView", viewTabs);
    },
    handleMenu(item, e, index) {
      this.rightMenuShowIndex = index;
      this.left = e.clientX + 5;
      this.top = e.clientY;
    },
    /**
     * @function draggable 开始拖拽事件
     * **/
    onStart() {},
    /**
     * @function draggable 拖拽结束事件
     * **/
    onEnd() {},
    /**
     * @function 触发跳转路由
     * **/
    triggerRouter(item) {
      if (item.active) return;
      this.$router.push({ path: item.path });
    },

    /**
     * @function 关闭
     * **/
    triggerClose(tab) {
      // console.log(`关闭:`, item);
      let viewTabs = _.cloneDeep(this.viewTabs);
      let _index = viewTabs.findIndex(item => item.path == tab.path)
      if(tab.active && viewTabs.length !== 1) {
        let activeTab;
        if(_index == viewTabs.length - 1) {
          activeTab = viewTabs[viewTabs.length - 2]
        } else {
          activeTab = viewTabs[_index + 1]
        }
        this.$router.push({ path: activeTab.path });
      }
      
      viewTabs.splice(_index, 1)
      this.$store.dispatch("viewTabs/delVisitedView", viewTabs);
    },
  },
};
</script>

<style lang="scss" scoped>
.tags-view-container {
  padding: 6px 10px 0;
  box-sizing: border-box;
  width: 100%;
  height: 30px;
  background: linear-gradient(180deg, #C8DDFF 0%, #0F448D 100%);
  border-bottom: 1px solid #99BAE7;
  overflow: hidden;

  /*draggable*/
  .tags-view-draggable {
    display: flex;
    justify-content: flex-start;
    flex-wrap: nowrap;
    .rightMenu {
      position: fixed;
      list-style: none;
      padding: 0;
      box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
      border-radius: 4px;
      border: 1px solid #ebeef5;
      z-index: 2;
      .rightItem {
        z-index: 10;
        text-align: left;
        line-height: 20px;
        background: white;
        color: #999999;
        padding: 8px 16px;
        cursor: pointer;
        &:hover {
          color: #16428B;
        }
      }
    }
  }

  /**导航标签**/
  .tags-view-item {
    position: relative;
    display: inline-block;
    padding-left: 22px;
    padding-right: 22px;
    box-sizing: border-box;
    height: 24px;
    line-height: 24px;
    border-radius: 6px 6px 0 0;
    background: linear-gradient(180deg, #F6FBFF 0%, #C0D6F0 50%, #DDEAFD 100%);
    border: 1px solid #e1e2e2;

    font-size: 12px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #426AA3;
    text-align: center;
    text-decoration: none;
    white-space: nowrap;

    &:hover {
      background: linear-gradient(180deg, #F6FBFF 0%, #C0D6F0 50%, #DDEAFD 100%);
      cursor: pointer;
      .tags-view-title {
        color: #16428B;
      }
    }
  }

  /*导航标题*/

  /**激活状态**/
  .active {
    background: linear-gradient(180deg, #A9CAF4 0%, #DDEDFF 100%);
    color: #16428B;
  }

  /**收藏按钮**/
  .tags-view-collection {
    width: 12px;
    height: 12px;
    overflow: hidden;
    margin-left: 10px;
    cursor: pointer;
  }

  /**关闭按钮**/
  .tags-view-close {
    position: absolute;
    top: 3px;
    right: 3px;
    width: 10px;
    height: 10px;
    overflow: hidden;
    cursor: pointer;
  }
}
</style>
