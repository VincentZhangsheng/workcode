<template functional>
    <pu-submenu :key="props.menuInfo.name" :index="props.menuInfo.path">
        <template slot="title">
            <i class="el-icon-caret-right pu-submenu__icon-arrow"></i>
            <span slot="title">{{props.menuInfo.meta.title}}</span>
        </template>
        <template v-for="item in props.menuInfo.children">
            <pu-menu-item v-if="!item.children" :index="item.path" :key="item.name">
                <span slot="title">{{props.menuInfo.meta.title}}</span>
            </pu-menu-item>
            <sub-menu v-else :menu-info="item" :key="item.name"></sub-menu>
        </template>
    </pu-submenu>
</template>

<script>
export default {
    props: ["menuInfo"]
}
</script>