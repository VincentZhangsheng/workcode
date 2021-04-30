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
        redirect: "/warehouse-config/main-data",
      },
      {
        path: "/base-config",
        name: "baseConfig",
        meta: {title: "基础配置", auth: ["user","admin"]},
        component: {render:h => h("router-view")},
        children: [
          {
            path: "/warehouse-config",
            name: "warehouseConfig",
            meta: {title: "仓库配置", auth: ["user","admin"]},
            component: {render:h => h("router-view")},
            children: [
              {
                path: "/warehouse-config/main-data",
                name: "mainData",
                meta: {title: "仓库主数据"},
                component: () => import('../views/baseConfig/warehouse/companyAffiliation.vue'),
              },
              {
                path: "/warehouse-config/company-affiliation",
                name: "companyAffiliation",
                meta: {title: "所属公司"},
                component: () => import('../views/baseConfig/warehouse/companyAffiliation.vue'),
              },
              {
                path: "/warehouse-config/business-customer",
                name: "businessCustomer",
                meta: {title: "企业客户"},
                component: () => import('../views/baseConfig/warehouse/businessCustomer.vue'),
              },
              {
                path: "/warehouse-config/location-type",
                name: "whLocationType",
                meta: {title: "仓库库位类型"},
                component: () => import('../views/baseConfig/warehouse/locationType.vue'),
              },
              {
                path: "/warehouse-config/area",
                name: "warehouseArea",
                meta: {title: "库区主数据"},
                component: () => import('../views/baseConfig/warehouse/warehouseArea.vue'),
              },
              {
                path: "/warehouse-config/type",
                name: "warehouseType",
                meta: {title: "仓库类型"},
                component: () => import('../views/baseConfig/warehouse/warehouseType.vue'),
              },
            ]
          },
          {
            path: "/material-config",
            name: "materialConfig",
            meta: {title: "物料配置"},
            component: {render:h => h("router-view")},
            children: [
              {
                path: "/material-config/main-data",
                name: "materialMainData",
                meta: {title: "物料主数据"},
                component: () => import('../views/About.vue'),
              },
              {
                path: "/material-config/size-group",
                name: "materialSizeGroup",
                meta: {title: "物料尺码组"},
                component: () => import('../views/About.vue'),
              },
              {
                path: "/material-config/category",
                name: "materialCategory",
                meta: {title: "品类角色"},
                component: () => import('../views/About.vue'),
              },
            ]
          },
          {
            path: "/supplier-config",
            name: "supplierConfig",
            meta: {title: "供应商配置", auth: ["user","admin"]},
            component: {render:h => h("router-view")},
            children: [
              {
                path: "/supplier-config/main-data",
                name: "supplierMainData",
                meta: {title: "供应商主数据"},
                component: () => import('../views/About.vue'),
              },
              {
                path: "/supplier-config/type",
                name: "supplierType",
                meta: {title: "供应商类型"},
                hideInMenu: true,
                component: () => import('../views/About.vue'),
              },
              {
                path: "/supplier-config/account",
                name: "supplierAccount",
                meta: {title: "供应商账户组"},
                hideInMenu: true,
                component: () => import('../views/About.vue'),
              }
            ]
          },
        ]
      },
      {
        path: "/procurement-execution-plan",
        name: "ProcurementExecutionPlan",
        meta: {title: "采购执行计划", auth: ["user","admin"]},
        component: {render:h => h("router-view")},
        children: [
          {
            path: "/reserve-order",
            name: "reserveOrder",
            meta: {title: "预留单", auth: ["user","admin"]},
            component: {render:h => h("router-view")},
            children: [
              {
                path: "/reserve-order/list",
                name: "reserveOrderList",
                meta: {title: "预留单"},
                component: () => import('../views/About.vue'),
                hideChildrenMenu: true,
                children: [
                  {
                    path: "/reserve-order/add",
                    name: "reserveOrderAdd",
                    meta: {title: "新增预留单", auth: ["user","admin"]},
                    component: () => import('../views/About.vue'),
                  }
                ]
              },
              {
                path: "/reserve-order/type",
                name: "reservedOrderType",
                meta: {title: "预留单类型"},
                component: () => import('../views/About.vue'),
              },
              {
                path: "/reserve-order/code-range",
                name: "reservedOrderCodeRange",
                meta: {title: "预留单号码范围"},
                component: () => import('../views/About.vue'),
              },
              {
                path: "/reserve-order/move-type",
                name: "reservedOrderMoveType",
                meta: {title: "预留单允许的移动类型"},
                component: () => import('../views/About.vue'),
              },
            ]
          },
          {
            path: "/invoice-add",
            name: "invoiceAdd",
            meta: {title: "新增发票"},
            component: () => import('../views/procurementPlan/invoice/edit.vue'),
          },
          {
            path: "/credentials-flow",
            name: "credentialsFlow",
            meta: {title: "凭证流配置"},
            component: () => import('../views/About.vue'),
          },
          {
            path: "/delivery-order",
            name: "deliveryOrder",
            meta: {title: "交货业务", auth: ["user","admin"]},
            component: {render:h => h("router-view")},
            children: [
              {
                path: "/delivery-order/source",
                name: "defineSourceTaxonomy",
                meta: {title: "定义源单分类"},
                component: () => import('../views/About.vue'),
              },
              {
                path: "/delivery-order/mode",
                name: "deliveryOrderMode",
                meta: {title: "交货方式"},
                hideInMenu: true,
                component: () => import('../views/About.vue'),
              }
            ]
          },
          {
            path: "/purchase",
            name: "purchase",
            meta: {title: "采购业务", auth: ["user","admin"]},
            component: {render:h => h("router-view")},
            children: [
              {
                path: "/purchase",
                redirect: "/purchase/info-record",
              },
              {
                path: "/purchase/info-record",
                name: "purchaseInfoRecord",
                meta: {title: "采购信息记录"},
                component: () => import('../views/About.vue'),
                children: [
                  {
                    path: "/purchase/info-record/list",
                    name: "recordList",
                    meta: {title: "采购信息记录"},
                    component: () => import('../views/About.vue'),
                  },
                  {
                    path: "/purchase/info-record/code-range",
                    name: "recordCodeRange",
                    meta: {title: "采购信息记录编号范围"},
                    component: () => import('../views/About.vue'),
                  },
                  {
                    path: "/purchase/info-record/type",
                    name: "recordCodeType",
                    meta: {title: "采购信息记录类型"},
                    component: () => import('../views/About.vue'),
                  },
                  {
                    path: "/purchase/info-record/pick-strategy",
                    name: "recordPickStrategy",
                    meta: {title: "采购信息记录取值策略"},
                    component: () => import('../views/About.vue'),
                  },
                ]
              }
            ]
          }
        ]
      },
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
