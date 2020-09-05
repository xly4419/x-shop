import Vue from "vue";
import store from "../store";
// 自定义指令
Vue.directive("btnPerm", {
    // 父节点还未渲染
    bind: function (el, bingind) {     //el:DOM元素  bingind: 属性及方法
        console.log(bingind);
        // 操作DOM元素
        if (bingind.def.hasBtnPerm(bingind.value)) {
            el.clssName = el.clssName + " show-button";
        };
    },
    // 操作父节点
    inserted: function () {
    },
    update: function () {
    },
    componentUpdated: function () {
    },
    unbind: function () {
    },
    hasBtnPerm: function (permission) {
        const button = store.getters["app/buttonPermission"];
        return button.indexOf(permission) >= 0;
    }
})