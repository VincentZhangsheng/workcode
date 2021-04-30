import PuSubmenu from "../menu/src/submenu";

PuSubmenu.install = function (Vue) {
  Vue.component(PuSubmenu.name, PuSubmenu);
}

export default PuSubmenu;