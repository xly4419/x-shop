import router from "./index";
import store from "../store";
import { getToken, removeToken, removeUserName } from "../utils/app.js";

const whiteRouter = ["/login"]; //白名单  indexOf如果不存在返回 -1

//路由守卫
router.beforeEach((to, from, next) => {
    if (getToken()) {
        // console.log("token 存在");
        //判断用户登陆后是否又返回登陆页面
        if (to.path === "/login") {     //返回了 清除Vuex和cookie里面的值
            removeToken();
            removeUserName();
            store.commit("app/SET_TOKEN", "");
            store.commit("app/SET_USERNAME", "");
            next();
        } else {
            //跳转页面
            //获取用户角色  动态分配路由权限
            /**
             * 1、什么时候处理动态路由
             * 2、以什么条件处理
             * role[]
             */
            if (store.getters["app/role"].length === 0) {
                store.dispatch("permission/getRoles").then(response => {
                    let role = response.role;
                    let btnPerm = response.btnPerm;
                    store.commit("app/SET_ROLES", role);
                    store.commit("app/SET_BUTTON", btnPerm);
                    store.dispatch("permission/creatRouter", role).then(response => {
                        // console.log(response);
                        let addRouters = store.getters["permission/addRouters"];
                        let allRouters = store.getters["permission/allRouters"];
                        // 路由更新
                        router.options.routes = allRouters;
                        // 添加动态路由
                        router.addRoutes(addRouters);
                        next({ ...to, replace: true });
                        // es6扩展运算符   防止内容发生变化的情况
                        // replace: true 不被记录历史纪录
                    });
                });
            } else {
                next();
            }

        }
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