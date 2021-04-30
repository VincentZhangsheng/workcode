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
import emitter from "../../mixins/emitter";
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

