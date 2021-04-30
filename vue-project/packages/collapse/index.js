import PuCollapse from './src/collapse';

/* istanbul ignore next */
PuCollapse.install = function(Vue) {
  Vue.component(PuCollapse.name, PuCollapse);
};

export default PuCollapse;

