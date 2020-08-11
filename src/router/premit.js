import router from "./index";
import store from "../store";
import { getToken, removeToken, removeUserName } from "../utils/app.js";

const whiteRouter = ["/login"]; //白名单  indexOf如果不存在返回 -1

//路由守卫
router.beforeEach((to, from, next) => {
    if (getToken()) {
        //判断用户登陆后是否又返回登陆页面
        if (to.path === "/login") {     //返回了 清除Vuex和cookie里面的值
            removeToken();
            removeUserName();
            store.commit("app/SET_TOKEN", "");
            store.commit("app/SET_USERNAME","");
            next();
        } else {
            next();
        }
        //动态路由 分配菜单 每个角色分配不同的菜单
        //获取用户角色  动态分配路由权限
        // console.log("存在");
    } else {
        // console.log("不存在");
        if (whiteRouter.indexOf(to.path) !== -1) {
            //是/login 在白名单内
            next();
        } else {
            next("/login");
            // alert("请先登录");  可以弹一个警告框
        }
    }

});