<template functional>
    <el-submenu :key="props.menuInfo.name" :index="props.menuInfo.path">
        <template slot="title">
            <i class="el-icon-location"></i>
            <span slot="title">导航一</span>
        </template>
        <template v-for="item in props.menuInfo.children">
            <el-menu-item v-if="!item.children" :index="item.path" :key="item.name">
                <i class="el-icon-menu"></i>
                <span slot="title">导航二</span>
            </el-menu-item>
            <sub-menu v-else :menu-info="item" :key="item.name"></sub-menu>
        </template>
    </el-submenu>
</template>

<script>
export default {
    props: ["menuInfo"]
}
</script>