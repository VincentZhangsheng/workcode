import PuMenu from "./src/menu";

PuMenu.install = function (Vue) {
  Vue.component(PuMenu.name, PuMenu);
}

export default PuMenu;