<template>
    <div>
        <el-menu default-active="" class="el-menu-vertical-demo" router :collapse="isCollapse">
            <template v-for="item in menuData">
                <el-menu-item v-if="!item.children" :index="item.path" :key="item.name">
                    <i class="el-icon-menu"></i>
                    <span slot="title">导航二</span>
                </el-menu-item>
                <sub-menu v-else :menu-info="item" :key="item.name"></sub-menu>
            </template>
        </el-menu>
    </div>
</template>

<script>
export default {
    components: {
        SubMenu: () => import("./SubMenu"),
    },
    data() {
      return {
        isCollapse: false,
        menuData: this.getMenuData(this.$router.options.routes),
      };
    },
    methods: {
        getMenuData(routes) {
            const menuData = [];
            routes.forEach(item => {
                if(item.name && !item.hideInMenu) {
                    const newItem = {...item};
                    delete newItem.children;
                    if(!item.hideChildrenMenu && item.children) {
                        newItem.children = this.getMenuData(item.children)
                    }
                    menuData.push(newItem)
                } else if(!item.hideInMenu && !item.hideChildrenMenu && item.children) {
                    menuData.push(...this.getMenuData(item.children))
                }
            })
            console.log(menuData)
            return menuData
        }
    }
}
</script>

<style lang="scss" scoped>
.el-menu{
    text-align: left;
}
</style>

