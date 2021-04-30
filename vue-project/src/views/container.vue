<template>
  <div id="wrapper">
    <!--代码容器-->
    <section
      id="appContainer"
      v-if="type === 1"
    ></section>

    <!--页面模板容器-->
    <page-template
      :pageData="pageData"
      :template="options"
      :permissions="permissions"
      v-if="type === 2"
    />

    <!--弹框容器-->
    <!-- <section id="dialogContainer"></section> -->

    <!-- 导出弹窗 -->
    <!-- <export-modal
      v-if="popupwindow"
      :transmitData="transmitData"
    ></export-modal> -->

  </div>
</template>

<script>
import Vue from "vue";
// import NProgress from "nprogress";
import { mapGetters } from "vuex";
// import { getMenuDetail2 } from "@/api/index";
import { render } from "../render";
import templates from "../templates/index.js";
import util from "./util.js";
// import exportModal from "@/components/ExportModal";

export default {
  name: "AppContainer",
  data() {
    return {
      vm: null, // render vue实例
      pageId: "", //页面id
      options: {}, //页面模板初始化配置
      type: 1, // 1：代码、 2：模板
      permissions: [], // 用户权限
      queryParam: {}, // 页面传递参数
      pageData: {},
      popupwindow: false
    };
  },
  components: {
    // "export-modal": exportModal
  },
  computed: {
    ...mapGetters(["activePage"])
  },
  created() {
    let { query } = this.$route;
    let { pageId } = query;
    this.getPageData(pageId);
  },
  mounted() {
    // this.$bus.$on("openExportModal", data => {
    //   this.popupwindow = true;
    //   this.transmitData = data;
    // });
    // this.$bus.$on("closeExportModal", () => {
    //   this.popupwindow = false;
    // });
  },
  methods: {
    /**
     * @function 请求页面内容
     * @param {String} pageId
     * **/
    async getPageData(pageId) {
      let _query = pageId.split("@@@");

      // 判断参数是否改变
      // 获取上一级传递过来的动态参数
      let queryParam = this.$common.getQueryParamByPageId(_query[1]);

      // 获取上一级传递过来的自定义静态参数
      let queryStaticParam = this.$common.getQueryParamByPageId(
        `__static__${_query[1]}`
      );

      let menuDetail = await this.$http.get(`/api/user/outer/page/getByAppVersionAndPageCode/${_query[0]}/${_query[1]}`,{});
      console.log(menuDetail);

      if (menuDetail.code === 200 && menuDetail.data) {
        const pageData = menuDetail.data;
        this.pageData = pageData;
        const { layout, permission } = pageData.pages;
        const _layout = _.cloneDeep(layout);
        const json = JSON.parse(_layout.json);
        this.permissions = permission;
        if (_layout.type === "template") {
          this.type = 2;
          Vue.component("page-template", templates[json.templateCode]);
          this.options = json;
          this.pageId = pageId;
        } else {
          this.type = 1;

          this.queryParam = queryParam;
          this.pageId = pageId;

          _layout.json = json;
          _layout.dom = document.getElementById("appContainer");
          let params = {
            title: this.activePage.title,
            version: _query[0],
            pageId: _query[1],
            query: queryParam,
            queryStatic: queryStaticParam,
            permission: permission
          };
          let vm = new render(_layout, params);
          console.log(vm)
          this.vm = vm;

          util.saveContainerData({ pageId, queryParam });
        }
      }
    }
  },
  activated() {
    // 请求页面数据
    console.log("111111");
    let { query } = this.$route;
    let { pageId } = query;
    this.getPageData(pageId);
  },
  deactivated() {
    // 根据tags-view已打开的页面决定是否销毁页面
    // if (
    //   !this.$common.isExistPageByTagsView({
    //     pageId: this.pageId,
    //     menu: this.menu
    //   })
    // ) {
    //   this.$destroy();
    //   if (this.vm) {
    //     this.vm.$destroy();
    //   }
    // }
  }
};
</script>

<style lang="scss" scoped>
#wrapper {
  height: 100%;
}
</style>
