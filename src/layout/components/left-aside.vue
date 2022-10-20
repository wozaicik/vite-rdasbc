<template>
    <el-menu
        active-text-color="#ffd04b"
        background-color="#545c64"
        class="el-menu-vertical-demo"
        default-active="2"
        text-color="#fff"
    >
        <el-sub-menu index="1">
            <template #title>
                <el-icon><location /></el-icon>
                <span>Navigator One</span>
            </template>
            <el-menu-item index="1-1">item one</el-menu-item>
            <el-menu-item index="1-2">item two</el-menu-item>
        </el-sub-menu>
    </el-menu>
</template>

<script>

</script>

<style lang="scss" scoped>
.el-menu{
    .el-sub-menu{
        height: 100%;
        width: 200px;
    }
}
</style>
