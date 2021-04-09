import clickOutside from "./click-outside";

/**
 * @directive 注册全局指令
 * **/
export default {
  install: Vue => {
    Vue.directive("click-outside", clickOutside);
  }
};
