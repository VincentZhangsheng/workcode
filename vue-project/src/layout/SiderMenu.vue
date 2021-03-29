<template>
    <div>
        <el-menu :default-active="activeKey" :default-openeds="openKeys" class="el-menu-vertical-demo" router :collapse="isCollapse">
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
import {checkAuthority} from "../utils/auth"
export default {
    components: {
        SubMenu: () => import("./SubMenu"),
    },
    data() {
        this.openKeysMap = {};
        this.activeKeyMap = {};
        return {
            isCollapse: false,
            menuData: this.getMenuData(this.$router.options.routes),
            activeKey: this.activeKeyMap[this.$route.path],
            openKeys: this.isCollapse ? [] : this.openKeysMap[this.$route.path],
        };
    },
    methods: {
        getMenuData(routes = [], parentKeys = [], selectedKey) {
            const menuData = [];
            for(let item of routes) {
                if(item.meta && item.meta.auth && !checkAuthority(item.meta.auth)) break;
                if(item.name && !item.hideInMenu) {
                    this.openKeysMap[item.path] = parentKeys;
                    this.activeKeyMap[item.path] = item.path || selectedKey;
                    const newItem = {...item};
                    delete newItem.children;
                    if(!item.hideChildrenMenu && item.children) {
                        newItem.children = this.getMenuData(item.children, [...parentKeys, item.path])
                    } else {
                        this.getMenuData(
                            item.children, 
                            selectedKey ? parentKeys : [...parentKeys, item.path],
                            selectedKey || item.path
                        )
                    } 
                    menuData.push(newItem)
                } else if(!item.hideInMenu && !item.hideChildrenMenu && item.children) {
                    menuData.push(...this.getMenuData(item.children, [...parentKeys, item.path]))
                }
            }
            return menuData
        }
    },
    watch: {
        "$route.path": function(val) {
            this.activeKey = this.activeKeyMap[val];
            this.openKeys = this.isCollapse ? [] : this.openKeysMap[val]
        }
    }
}
</script>

<style lang="scss" scoped>
.el-menu{
    text-align: left;
}
</style>

