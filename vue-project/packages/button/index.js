import PuButton from './src/button';

/* istanbul ignore next */
PuButton.install = function(Vue) {
  Vue.component(PuButton.name, PuButton);
};

export default PuButton;
