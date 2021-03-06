import { Login } from "@/api/login.js";
import { setToken, setUserName, getUserName, removeUserName, removeToken } from "../../utils/app.js"

const state = {
    isCollapse: JSON.parse(sessionStorage.getItem("isCollapse")) || false,
    to_ken: "",
    username: getUserName() || ""
};
const mutations = {
    SET_COLLAPSE(state) {
        state.isCollapse = !state.isCollapse;
        //本地存储
        sessionStorage.setItem("isCollapse", JSON.stringify(state.isCollapse));
    },
    SET_TOKEN(state, value) {
        state.SET_TOKEN = value;
    },
    SET_USERNAME(state, value) {
        state.SET_USERNAME = value;
    }
};
const actions = {
    login(content, resquestData) {
        return new Promise((resolve, reject) => {
            Login(resquestData).then((response) => {
                //把token和username存进
                let data = response.data.data
                content.commit("SET_TOKEN", data.token);
                content.commit("SET_USERNAME", data.username);
                setToken(data.token);
                setUserName(data.username)
                resolve(response);
            }).catch(error => {
                reject(error);
            })
        });
    },
    exit({ commit }) {
        return new Promise((resolve, reject) => {
            removeToken();
            removeUserName();
            commit("SET_TOKEN", "");
            commit("SET_USERNAME", "");
            resolve();
        })
    }
}

export default {
    namespaced: true,
    state,
    mutations,
    actions
};
