const state = {
    qiniuUrl: "http://www-xuliny-com-qiniu.xuliny.com/"
}
const getters = {
    qiniuUrl: state => state.qiniuUrl
}
export default {
    namespaced: true,
    state,
    getters
}