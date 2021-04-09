<script type="text/jsx">
import emitter from "./emitter";
export default {
  name: "PuMenu",
  componentName: "PuMenu",
  mixins: [emitter],
  render() {
    return (
      <ul
        role="menubar"
        class="pu-menu"
        style={{ backgroundColor: this.backgroundColor || "" }}
      >
        {this.$slots.default}
      </ul>
    );
  },
  provide() {
    return {
      rootMenu: this
    };
  },
  props: {
    defaultActive: {
      type: String,
      default: ""
    },
    defaultOpeneds: Array,
    uniqueOpened: Boolean,
    router: Boolean,
    menuTrigger: {
      type: String,
      default: "hover"
    },
    collapse: Boolean,
    backgroundColor: String,
    textColor: String,
    activeTextColor: String
  },
  data() {
    return {
      activeIndex: this.defaultActive,
      openedMenus:
        this.defaultOpeneds && !this.collapse
          ? this.defaultOpeneds.slice(0)
          : [],
      items: {},
      submenus: {}
    };
  },
  computed: {},
  watch: {
    defaultActive(value) {
      if (!this.items[value]) {
        this.activeIndex = null;
      }
      this.updateActiveIndex(value);
    },
    defaultOpeneds(value) {
      if (!this.collapse) {
        this.openedMenus = value;
      }
    },
    collapse(value) {
      if (value) this.openedMenus = [];
    }
  },
  methods: {
    updateActiveIndex(val) {
      const item =
        this.items[val] ||
        this.items[this.activeIndex] ||
        this.items[this.defaultActive];
      if (item) {
        this.activeIndex = item.index;
        this.initOpenedMenu();
      } else {
        this.activeIndex = null;
      }
    },
    addItem(item) {
      this.$set(this.items, item.index, item);
    },
    removeItem(item) {
      delete this.items[item.index];
    },
    addSubmenu(item) {
      this.$set(this.submenus, item.index, item);
    },
    removeSubmenu(item) {
      delete this.submenus[item.index];
    },
    openMenu(index, indexPath) {
      let openedMenus = this.openedMenus;
      if (openedMenus.indexOf(index) !== -1) return;
      if (this.uniqueOpened) {
        this.openedMenus = openedMenus.filter(index => {
          return indexPath.indexOf(index) !== -1;
        });
      }
      this.openedMenus.push(index);
    },
    closeMenu(index) {
      const i = this.openedMenus.indexOf(index);
      if (i !== -1) {
        this.openedMenus.splice(i, 1);
      }
    },
    initOpenedMenu() {
      const index = this.activeIndex;
      const activeItem = this.items[index];
      if (!activeItem || this.collapse) return;
      let indexPath = activeItem.indexPath;
      indexPath.forEach(index => {
        let submenu = this.submenus[index];
        submenu && this.openMenu(index, submenu.indexPath);
      });
    },
    handleSubmenuClick(submenu) {
      const { index, indexPath } = submenu;
      let isOpened = this.openedMenus.indexOf(index) !== -1;

      if (isOpened) {
        this.closeMenu(index);
        this.$emit("close", index, indexPath);
      } else {
        this.openMenu(index, indexPath);
        this.$emit("open", index, indexPath);
      }
    },
    handleItemClick(item) {
      const { index, indexPath } = item;
      const oldActiveIndex = this.activeIndex;
      const hasIndex = item.index !== null;
      if (hasIndex) {
        this.activeIndex = item.index;
      }
      this.$emit("select", index, indexPath, item);
      if (this.collapse) {
        this.openedMenus = [];
      }
      if (this.router && hasIndex) {
        this.routeToItem(item, error => {
          this.activeIndex = oldActiveIndex;
          if (error) {
            if (error.name === "NavigationDuplicated") return;
            console.error(error);
          }
        });
      }
    },
    routeToItem(item, onError) {
      let route = item.route || item.index;
      try {
        this.$router.push(route, () => {}, onError);
      } catch (e) {
        console.error(e);
      }
    },
    open(index) {
      const { indexPath } = this.submenus[index.toString()];
      indexPath.forEach(i => this.openMenu(i, indexPath));
    },
    close(index) {
      this.closeMenu(index);
    }
  },
  mounted() {
    this.initOpenedMenu();
    this.$on("item-click", this.handleItemClick);
    this.$on("submenu-click", this.handleSubmenuClick);
    this.$watch("items", this.updateActiveIndex);
  }
};
</script>