import PuMenuItem from "../menu/src/menu-item";

PuMenuItem.install = function (Vue) {
  Vue.component(PuMenuItem.name, PuMenuItem);
}

export default PuMenuItem;