import Vue from "vue";
import VueCompositionApi from "@vue/composition-api";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import "./router/premit.js"
// 自定义全局组件
import "./icons";
// 引入按钮权限
import { buttonPermission } from "./utils/buttonPermission";
Vue.prototype.btnPerm = buttonPermission;
//引用自定义指令
import "./utils/buttonPerm";

Vue.use(VueCompositionApi);
Vue.use(ElementUI);
Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
