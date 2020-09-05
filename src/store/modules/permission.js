import { GetUserRole } from "@/api/login";
import { defaultRouterMap, asyncRouterMap } from "@/router/index";

const state = {
    addRouters: [],
    allRouters: defaultRouterMap   //整体路由
};
const getters = {
    addRouters: state => state.addRouters,
    allRouters: state => state.allRouters,
};
const mutations = {
    SET_ROUTER(state, value) {
        state.addRouters = value
        state.allRouters = defaultRouterMap.concat(value);
    },
};
const actions = {
    /**
     * 获取用户角色
     * @param {*} param0 
     * @param {*} resquestData 
     */
    getRoles({ commit }, resquestData) {
        return new Promise((resolve, reject) => {
            GetUserRole().then(response => {
                let responseData = response.data.data;
                // commit("SET_ROLES", role);
                resolve(responseData);
            }).catch(error => {
                reject(error);
            });
        })
    },
    /**
     * 创建动态路由
     */
    creatRouter({ commit }, resquestData) {
        return new Promise((resolve, reject) => {
            let role = resquestData;
            let addRouters = [];
            if (role.includes("admin")) {   //超级管理员
                addRouters = asyncRouterMap;
            } else {    //普通管理员
                addRouters = asyncRouterMap.filter(item => {
                    // ES6 数组中是否存在includes
                    if (role.includes(item.meta.system)) {
                        return item;
                    }
                });
            }
            // 更新路由
            commit("SET_ROUTER", addRouters);
            resolve();
        })
    }
}

export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions
};
