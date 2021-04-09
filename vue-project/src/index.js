import Menu from '../packages/menu/index.js';
import Submenu from '../packages/submenu/index.js';
import PuMenuItem from "../packages/menu-item/index.js";

const components = [Menu,Submenu,PuMenuItem]

const install = function(Vue) {
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
    PuMenuItem
} 