<template>
  <button
    class="pu-button"
    @click="handleClick"
    :disabled="buttonDisabled"
    :autofocus="autofocus"
    :type="nativeType"
    :class="[
      type ? 'pu-button--' + type : '',
      buttonSize ? 'pu-button--' + buttonSize : '',
      buttonDisabled ? 'is-disabled' : ''
    ]"
  >
    <i :class="icon" v-if="icon"></i>
    <span v-if="$slots.default"><slot></slot></span>
  </button>
</template>
<script>
  export default {
    name: 'PuButton',

    props: {
      type: {
        type: String,
        default: 'default'
      },
      size: String,
      icon: {
        type: String,
        default: ''
      },
      nativeType: {
        type: String,
        default: 'button'
      },
      disabled: Boolean,
      autofocus: Boolean,
    },

    computed: {
      buttonSize() {
        return this.size;
      },
      buttonDisabled() {
        return this.disabled;
      }
    },

    methods: {
      handleClick(evt) {
        this.$emit('click', evt);
      }
    }
  };
</script>
