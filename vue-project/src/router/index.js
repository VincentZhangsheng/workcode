import Vue from 'vue'
import VueRouter from 'vue-router'
import findLast from "lodash/findLast"
import {checkAuthority, isLogin} from "../utils/auth"

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    meta: {auth: ["user","admin"]},
    component: () => import('../layout/index.vue'),
    children: [
      {
        path: "/",
        redirect: "/dashboard/analysis",
      },
      {
        path: "/material",
        name: "material",
        meta: {title: "物料", auth: ["user","admin"]},
        component: () => import('../views/About.vue'),
      },
      {
        path: "/dashboard",
        name: "dashboard",
        meta: {title: "导航一", auth: ["user","admin"]},
        component: {render:h => h("router-view")},
        children: [
          {
            path: "/dashboard/analysis",
            name: "analysis",
            meta: {title: "分析页"},
            component: () => import('../views/About.vue'),
          },
          {
            path: "/dashboard/detail",
            name: "analysisDetail",
            meta: {title: "详情"},
            component: () => import('../views/About.vue'),
          }
        ]
      },
      {
        path: "/supplier",
        name: "supplier",
        meta: {title: "导航二", auth: ["user"]},
        component: {render:h => h("router-view")},
        children: [
          {
            path: "/supplier",
            redirect: "/supplier/config",
          },
          {
            path: "/supplier/config",
            name: "config",
            meta: {title: "配置"},
            component: () => import('../views/About.vue'),
          },
          {
            path: "/supplier/list",
            name: "supplierList",
            meta: {title: "列表"},
            component: () => import('../views/About.vue'),
            children: [
              {
                path: "/supplier/list/list1",
                name: "list1",
                meta: {title: "list1"},
                component: () => import('../views/About.vue'),
              },
              {
                path: "/supplier/list/list2",
                name: "list2",
                meta: {title: "list2"},
                component: () => import('../views/About.vue'),
              }
            ]
          }
        ]
      }
    ]
  },
  {
    path: "/user",
    hideInMenu: true,
    component: {render:h => h("router-view")},
    children: [
      {
        path: "/user/login",
        name: "login",
        component: () => import('../views/About.vue')
      },
      {
        path: "/user/register",
        name: "register",
        component: () => import('../views/About.vue')
      }
    ]
  }
]

const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  const record = findLast(to.matched, record => record.meta.auth);
  if(record && !checkAuthority(record.meta.auth)) {
    if(!isLogin() && to.path !== "/user/login") {
      next({
        path: "/user/login"
      })
    } else if(to.path !== "/403") {
      next({
        path: "/403"
      })
    }
  }
  next();
})

router.afterEach(() => {

})

export default router
