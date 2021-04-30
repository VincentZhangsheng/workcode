<script type="text/jsx">
import PuCollapseTransition from "../../transitions/collapse-transition";
import menuMixin from "./menu-mixin";
import Emitter from "../../mixins/emitter";

export default {
  name: "PuSubmenu",

  componentName: "PuSubmenu",

  mixins: [menuMixin, Emitter],

  components: { PuCollapseTransition },

  props: {
    index: {
      type: String,
      required: true
    },
    showTimeout: {
      type: Number,
      default: 300
    },
    hideTimeout: {
      type: Number,
      default: 300
    },
    popperAppendToBody: {
      type: Boolean,
      default: undefined
    }
  },

  data() {
    return {
      timeout: null,
      items: {},
      submenus: {},
      mouseInChild: false
    };
  },
  computed: {
    // popper option
    appendToBody() {
      return this.popperAppendToBody === undefined
        ? this.isFirstLevel
        : this.popperAppendToBody;
    },
    opened() {
      return this.rootMenu.openedMenus.indexOf(this.index) > -1;
    },
    active() {
      let isActive = false;
      const submenus = this.submenus;
      const items = this.items;

      Object.keys(items).forEach(index => {
        if (items[index].active) {
          isActive = true;
        }
      });

      Object.keys(submenus).forEach(index => {
        if (submenus[index].active) {
          isActive = true;
        }
      });

      return isActive;
    },
    backgroundColor() {
      return this.rootMenu.backgroundColor || "";
    },
    activeTextColor() {
      return this.rootMenu.activeTextColor || "";
    },
    textColor() {
      return this.rootMenu.textColor || "";
    },
    mode() {
      return this.rootMenu.mode;
    },
    isFirstLevel() {
      let isFirstLevel = true;
      let parent = this.$parent;
      while (parent && parent !== this.rootMenu) {
        if (["PuSubmenu"].indexOf(parent.$options.componentName) > -1) {
          isFirstLevel = false;
          break;
        } else {
          parent = parent.$parent;
        }
      }
      return isFirstLevel;
    }
  },
  methods: {
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
    handleClick() {
      const { rootMenu } = this;
      if (rootMenu.collapse) {
        return;
      }
      this.dispatch("PuMenu", "submenu-click", this);
    }
  },
  created() {
    this.$on("mouse-enter-child", () => {
      this.mouseInChild = true;
      clearTimeout(this.timeout);
    });
    this.$on("mouse-leave-child", () => {
      this.mouseInChild = false;
      clearTimeout(this.timeout);
    });
  },
  mounted() {
    this.parentMenu.addSubmenu(this);
    this.rootMenu.addSubmenu(this);
  },
  beforeDestroy() {
    this.parentMenu.removeSubmenu(this);
    this.rootMenu.removeSubmenu(this);
  },
  render() {
    const {
      active,
      opened,
      paddingStyle,
      backgroundColor,
      rootMenu,
      $slots
    } = this;

    const inlineMenu = (
      <el-collapse-transition>
        <ul
          role="menu"
          class="pu-menu pu-menu--inline"
          v-show={opened}
          style={{ backgroundColor: rootMenu.backgroundColor || "" }}
        >
          {$slots.default}
        </ul>
      </el-collapse-transition>
    );

    return (
      <li
        class={{
          "pu-submenu": true,
          "is-active": active,
          "is-opened": opened
        }}
        role="menuitem"
        aria-haspopup="true"
        aria-expanded={opened}
      >
        <div
          class="pu-submenu__title"
          ref="submenu-title"
          on-click={this.handleClick}
          style={[paddingStyle, { backgroundColor }]}
        >
          {$slots.title}
        </div>
        {inlineMenu}
      </li>
    );
  }
};
</script>
