export default {
  inject: ['rootMenu'],
  computed: {
    indexPath() {
      const path = [this.index];
      let parent = this.$parent;
      while (parent.$options.componentName !== 'PuMenu') {
        if (parent.index) {
          path.unshift(parent.index);
        }
        parent = parent.$parent;
      }
      return path;
    },
    parentMenu() {
      let parent = this.$parent;
      while (
        parent && ['PuMenu', 'PuSubmenu'].indexOf(parent.$options.componentName) === -1
      ) {
        parent = parent.$parent;
      }
      return parent;
    },
    paddingStyle() {
      let padding = 15;
      let parent = this.$parent;

      if (this.rootMenu.collapse) {
        padding = 15;
      } else {
        while (parent && parent.$options.componentName !== 'PuMenu') {
          if (parent.$options.componentName === 'PuSubmenu') {
            padding += 15;
          }
          parent = parent.$parent;
        }
      }
      return {
        paddingLeft: padding + 'px'
      };
    }
  }
};