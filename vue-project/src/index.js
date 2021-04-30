import Menu from '../packages/menu/index.js';
import Submenu from '../packages/submenu/index.js';
import PuMenuItem from "../packages/menu-item/index.js";
import Button from '../packages/button/index.js';
import Collapse from '../packages/collapse/index.js';
import CollapseItem from '../packages/collapse-item/index.js';

const components = [
  Menu, 
  Submenu, 
  PuMenuItem, 
  Button,
  Collapse,
  CollapseItem,
]

const install = function (Vue) {
  components.forEach(component => {
    Vue.component(component.name, component);
  });
}

if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue);
}

export default {
  install,
  Menu,
  Submenu,
  PuMenuItem,
  Button,
  Collapse,
  CollapseItem
}