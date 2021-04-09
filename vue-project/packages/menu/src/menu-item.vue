<template>
    <li
        class="pu-menu-item"
        role="menuitem"
        tabindex="-1"
        :class="{'is-active': active}"
        :style="[paddingStyle]"
        @click="handleClick"
    >
        <template>
            <slot></slot>
            <slot name="title"></slot>
        </template>
    </li>
</template>
<script>
import emitter from "./emitter";
import Menu from "./menu-mixin";
export default {
  name: "PuMenuItem",
  componentName: "PuMenuItem",
  mixins: [emitter, Menu],
  props: {
    index: {
      default: null,
      validator: val => typeof val === "string" || val === null
    },
    route: [String, Object]
  },
  computed: {
    active() {
      return this.index === this.rootMenu.activeIndex;
    }
  },
  methods: {
    handleClick() {
      this.dispatch("PuMenu", "item-click", this);
      this.$emit("click", this);
    }
  },
  mounted() {
    this.parentMenu.addItem(this);
    this.rootMenu.addItem(this);
  },
  beforeDestroy() {
    this.parentMenu.removeItem(this);
    this.rootMenu.removeItem(this);
  }
};
</script>

<style lang="scss">
.pu-menu {
  list-style: none;
  position: relative;
  margin: 0;
  padding-left: 0;
  text-align: left;
  background-color: #fff;
  > li {
    border-bottom: 1px solid #ababab;
    background: #A8C3E9;
    &.is-opened{
      background: rgba(168,195,233,.6)
    }
  }
}
.pu-menu::after,
.pu-menu::before {
  display: table;
  content: "";
}
.pu-menu::after {
  clear: both;
}
.pu-menu-item,
.pu-submenu__title {
  height: 38px;
  line-height: 38px;
  list-style: none;
  position: relative;
  white-space: nowrap;
}
.pu-menu-item {
  font-size: 12px;
  color: #333333;
  padding: 0 20px;
  cursor: pointer;
  -webkit-transition: border-color 0.3s, background-color 0.3s, color 0.3s;
  transition: border-color 0.3s, background-color 0.3s, color 0.3s;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
}
.pu-menu-item * {
  vertical-align: middle;
}
.pu-menu-item i {
  color: #000000;
}
.pu-menu-item:focus,
.pu-menu-item:hover {
  outline: 0;
  background-color: rgba(168,195,233,.6);
}
.pu-menu-item [class^="el-icon-"] {
  margin-right: 5px;
  width: 24px;
  text-align: center;
  font-size: 18px;
  vertical-align: middle;
}
.pu-menu-item.is-active {
  color: #409eff;
}
.pu-menu-item.is-active i {
  color: inherit;
}
.pu-submenu {
  list-style: none;
  margin: 0;
  padding-left: 0;
  .pu-menu > li {
    border-bottom: none;
    background: #fff;
  }
}
.collapse-transition {
  -webkit-transition: 0.3s height ease-in-out, 0.3s padding-top ease-in-out,
    0.3s padding-bottom ease-in-out;
  transition: 0.3s height ease-in-out, 0.3s padding-top ease-in-out,
    0.3s padding-bottom ease-in-out;
}
.pu-submenu__title {
  font-size: 12px;
  color: #303133;
  padding: 0 20px;
  cursor: pointer;
  -webkit-transition: border-color 0.3s, background-color 0.3s, color 0.3s;
  transition: border-color 0.3s, background-color 0.3s, color 0.3s;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
}
.pu-submenu__title * {
  vertical-align: middle;
}
.pu-submenu__title i {
  color: #000;
}
.pu-submenu__title:focus,
.pu-submenu__title:hover {
  outline: 0;
  background-color: #ecf5ff;
}
.pu-submenu__title:hover {
  background-color: #ecf5ff;
}
.pu-submenu .pu-menu-item {
  height: 38px;
  line-height: 38px;
}
.pu-submenu__icon-arrow {
  -webkit-transition: -webkit-transform 0.3s;
  transition: -webkit-transform 0.3s;
  transition: transform 0.3s;
  transition: transform 0.3s, -webkit-transform 0.3s;
  font-size: 12px;
}
.pu-submenu.is-active .pu-submenu__title {
  border-bottom-color: #409eff;
}
.pu-submenu.is-opened > .pu-submenu__title .pu-submenu__icon-arrow {
  -webkit-transform: rotateZ(90deg);
  transform: rotateZ(90deg);
}
.pu-submenu [class^="el-icon-"] {
  vertical-align: middle;
  margin-right: 5px;
  width: 24px;
  text-align: center;
  font-size: 18px;
}
</style>

