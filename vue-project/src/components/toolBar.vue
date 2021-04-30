<template>
  <div class="toolbar-container">
    
    <slot name="tooltip" />
  </div>
</template>
<script>
export default {
  name: "ToolBar",
  methods: {
    addTableItem() {
      this.$emit("add-item");
    }
  }
};
</script>
<style lang="scss" scoped>
.toolbar-container {
  display: flex;
  align-items: center;
  padding-left: 15px;
  box-sizing: border-box;
  width: 100%;
  height: 40px;
  background: #ddeafd;
  border: 1px solid #99bae7;
  border-top: none;
  .tool-item {
    cursor: pointer;
    & + .tool-item {
      margin-left: 6px;
    }
  }
}
</style>