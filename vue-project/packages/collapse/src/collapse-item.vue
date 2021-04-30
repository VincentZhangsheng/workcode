<template>
  <div class="pu-collapse-item"
    :class="{'is-active': isActive, 'is-disabled': disabled }">
    <div
      role="tab"
      :aria-expanded="isActive"
      :aria-controls="`pu-collapse-content-${id}`"
      :aria-describedby ="`pu-collapse-content-${id}`"
    >
      <div
        class="pu-collapse-item__header"
        @click="handleHeaderClick"
        role="button"
        :id="`pu-collapse-head-${id}`"
        :tabindex="disabled ? undefined : 0"
        @keyup.space.enter.stop="handleEnterClick"
        :class="{
          'focusing': focusing,
          'is-active': isActive
        }"
        @focus="handleFocus"
        @blur="focusing = false"
      >
        <slot name="title">{{title}}</slot>
        <i
          class="el-collapse-item__arrow el-icon-arrow-right"
          :class="{'is-active': isActive}">
        </i>
      </div>
    </div>
    <pu-collapse-transition>
      <div
        class="pu-collapse-item__wrap"
        v-show="isActive"
        role="tabpanel"
        :aria-hidden="!isActive"
        :aria-labelledby="`pu-collapse-head-${id}`"
        :id="`pu-collapse-content-${id}`"
      >
        <div class="pu-collapse-item__content">
          <slot></slot>
        </div>
      </div>
    </pu-collapse-transition>
  </div>
</template>
<script>
  import PuCollapseTransition from "../../transitions/collapse-transition";
  import Emitter from "../../mixins/emitter";
  import { generateId } from "../../utils/util";

  export default {
    name: 'PuCollapseItem',

    componentName: 'PuCollapseItem',

    mixins: [Emitter],

    components: { PuCollapseTransition },

    data() {
      return {
        contentWrapStyle: {
          height: 'auto',
          display: 'block'
        },
        contentHeight: 0,
        focusing: false,
        isClick: false,
        id: generateId()
      };
    },

    inject: ['collapse'],

    props: {
      title: String,
      name: {
        type: [String, Number],
        default() {
          return this._uid;
        }
      },
      disabled: Boolean
    },

    computed: {
      isActive() {
        return this.collapse.activeNames.indexOf(this.name) > -1;
      }
    },

    methods: {
      handleFocus() {
        setTimeout(() => {
          if (!this.isClick) {
            this.focusing = true;
          } else {
            this.isClick = false;
          }
        }, 50);
      },
      handleHeaderClick() {
        if (this.disabled) return;
        this.dispatch('PuCollapse', 'item-click', this);
        this.focusing = false;
        this.isClick = true;
      },
      handleEnterClick() {
        this.dispatch('PuCollapse', 'item-click', this);
      }
    }
  };
</script>
