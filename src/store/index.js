import Vue from "vue";
import Vuex from "vuex";
Vue.use(Vuex);

import app from "./modules/app.js";
import infoDetailed from "./modules/infoDetailed.js";
import common from "./modules/common";
import permission from "./modules/permission";
export default new Vuex.Store({
  modules: {
    app,
    infoDetailed,
    common,
    permission
  }
});
