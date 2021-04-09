/**
 * @directive 点击元素自身之外触发事件指令
 * **/
const clickOutside = {
  bind(el, binding) {
    function clickHandler(e) {
      // 这里判断点击的元素是否是本身，是本身，则返回
      if (el.contains(e.target)) {
        return false;
      }

      // 判断指令中是否绑定了函数
      if (binding.expression) {
        binding.value(e);
      }
    }

    el.__vueClickOutside__ = clickHandler;
    document.addEventListener("click", clickHandler);
  },
  update() {},
  unbind(el) {
    document.removeEventListener("click", el.__vueClickOutside__);
    delete el.__vueClickOutside__;
  }
};

export default {
  install: Vue => {
    Vue.directive("click-outside", clickOutside);
  }
};
