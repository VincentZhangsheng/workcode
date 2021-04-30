import Vue from "vue";
import Vuex from "vuex";
import persistedState from "vuex-persistedstate";
import viewTabs from "./modules/viewTabs";
import getters from "./getters";

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    viewTabs,
  },
  getters,
  plugins: [persistedState({ storage: window.sessionStorage })]
});
