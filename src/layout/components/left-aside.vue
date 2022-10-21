<template>
    <el-menu
        active-text-color="#ffd04b"
        background-color="#545c64"
        class="el-menu-vertical-demo"
        default-active="2"
        text-color="#fff"
        unique-opened
        router
    >
        <el-sub-menu v-for="sub in leftAsideOptions" :key="sub.id" :index="sub.id">
            <template #title>
                <el-icon><component :is="sub.icon" /></el-icon>
                <span>{{sub.name}}</span>
            </template>
            <el-menu-item v-for="item in sub.children" :key="item.id" :index="item.path">
                <el-icon><component :is="item.icon" /></el-icon>
                <span>{{item.name}}</span>
            </el-menu-item>
        </el-sub-menu>
    </el-menu>
</template>

<script setup>
import { leftAsideOptions } from '@/api/constants.js'
</script>

<style lang="scss" scoped>
.el-menu{
    border: 0;
    height: 100%;
}
</style>
