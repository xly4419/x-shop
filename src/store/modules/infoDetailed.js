const state = {
    id: "" || sessionStorage.getItem("infoId"),
};
const getters = {

};
const mutations = {
    UPDATE_STATE_VALUE(state, params) {
        for (let key in params) {
            state[key] = params[key].value;
            //是否存储 session
            if (params[key].session) { 
                sessionStorage.setItem(params[key].sessionKey, params[key].value);
            }
        }
    },
};
const actions = {

};
export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions
}