import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);
//引入布局组件
import Layout from "../views/Layout/index";

/**
 * 1、系统分配
 * 2、角色分配
 */

/**
 * 1、默认路由
 */
export const defaultRouterMap = [
  {
    path: "/",
    redirect: "login",
    hidden: true,
    meta: {
      name: "主页"
    }
  },
  {
    path: "/login",
    name: "Login",
    hidden: true,
    meta: {
      name: "登录"
    },
    component: () => import("../views/Login/index.vue")
  },
  /**
   * 控制台
   */
  {
    path: "/console",
    name: "Console",
    redirect: "index",
    meta: {
      name: "控制台",
      icon: "console"
    },
    component: Layout,
    children: [{
      path: "/index",
      name: "Index",
      meta: {
        name: "首页"
      },
      component: () => import("../views/Console/index.vue"),
    }]
  }
];
/**
 * 2、动态路由
 * 角色 "业务员,技术员,部门经理"
 */
export const asyncRouterMap = [
  /**
   * 信息管理
   */
  {
    path: "/info",
    name: "Info",
    meta: {
      role: ["业务员", "部门经理"],
      system: "信息功能",
      name: "信息管理",
      icon: "info"
    },
    component: Layout,
    children: [{
      path: "/infoIndex",
      name: "InfoIndex",
      meta: {
        keepAlive: true,
        role: ["业务员", "部门经理"],
        name: "信息列表"
      },
      component: () => import("../views/Info/index.vue"),
    }, {
      path: "/infoCategory",
      name: "InfoCategory",
      meta: {
        keepAlive: true,
        role: ["业务员", "部门经理"],
        name: "信息分类"
      },
      component: () => import("../views/Info/category.vue"),
    }, {
      path: "/infoDetailed",
      name: "InfoDetailed",
      hidden: true,
      meta: {
        keepAlive: true,
        role: ["业务员", "部门经理"],
        name: "信息详情"
      },
      component: () => import("../views/Info/detailed.vue"),
    }]
  },
  /**
  * 用户管理
  */
  {
    path: "/user",
    name: "User",
    meta: {
      role: ["技术员", "部门经理"],
      system: "用户功能",     //自定义属性
      name: "用户管理",
      icon: "user"
    },
    component: Layout,
    children: [{
      path: "/userIndex",
      name: "UserIndex",
      meta: {
        keepAlive: true,
        role: ["技术员", "部门经理"],
        name: "用户列表"
      },
      component: () => import("../views/User/index.vue"),
    }]
  }
];

const router = new VueRouter({
  routes: defaultRouterMap,
});

/**
 * 解决路由重复问题
 */
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

export default router;
