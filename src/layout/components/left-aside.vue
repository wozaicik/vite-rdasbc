<template>
    <el-row justify="center" align="middle">
        <el-col :span="24">
            <el-icon class="elicon" :size="18">
                    <Expand v-if="layout.isLeftCollapse" @click="toggle(false)" />
                    <Fold v-else @click="toggle(true)"/>
            </el-icon>
        </el-col>
    </el-row>
    <el-menu
        active-text-color="#ffd04b"
        background-color="#545c64"
        text-color="#fff"
        :collapse=isLeftCollapse
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
import { layoutStore } from '@/store/layoutStore.js'
import { storeToRefs } from 'pinia'

const layout = layoutStore()

const { isLeftCollapse } = storeToRefs(layout)
const toggle = (isCollapse) => {
  layout.isLeftCollapse = isCollapse
}

</script>

<style lang="scss" scoped>
.el-row{
    .el-col{
        height: 25px;
        display: flex;
        justify-content:center;
        align-items:center;
        background-color: #545c64;
    }
}

.elicon{
    color: aliceblue;
    background-color: #545c64;
}
.el-menu{
    border: 0;
    width: 100%;
    height: 100%;
}
</style>
