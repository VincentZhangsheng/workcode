<template>
  <div :class="[
    type === 'textarea' ? 'pu-textarea' : 'pu-input',
    inputSize ? 'pu-input--' + inputSize : '',
    {
      'is-disabled': inputDisabled,
      'is-exceed': inputExceed,
      'pu-input-group': $slots.prepend || $slots.append,
      'pu-input-group--append': $slots.append,
      'pu-input-group--prepend': $slots.prepend,
      'pu-input--prefix': $slots.prefix || prefixIcon,
      'pu-input--suffix': $slots.suffix || suffixIcon || clearable || showPassword
    }
    ]"
    @mouseenter="hovering = true"
    @mouseleave="hovering = false"
  >
  </div>
</template>
<script>
export default {
  name: "PuInput",

  componentName: "PuInput"
};
</script>
