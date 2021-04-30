import PuInput from './src/input';
import "../styles/input.scss";

/* istanbul ignore next */
PuInput.install = function(Vue) {
  Vue.component(PuInput.name, PuInput);
};

export default PuInput;