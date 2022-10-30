<template>
    <div class="common-layout">
      <el-container>
        <el-aside   class="left-aside" :class="{leftcollapse:isLeftCollapse}">
            <LeftAside></LeftAside>
        </el-aside>
        <el-container>
          <el-main>
            <MainViewer></MainViewer>
          </el-main>
          <el-footer v-if="layout.isFooterOpen"  id="Footer">
          </el-footer>
        </el-container>
        <el-aside width="200px" v-if="layout.isRightCollapse" class="right-aside">Aside</el-aside>
      </el-container>
    </div>
  </template>

<script setup>

import LeftAside from './components/left-aside.vue'
import MainViewer from './components/main-viewer.vue'
import { layoutStore } from '@/store/layoutStore.js'
import { storeToRefs } from 'pinia'

// 主要存储界面是否加载完毕和控制菜单栏、底部的出现
const layout = layoutStore()

const { isLeftCollapse } = storeToRefs(layout)

</script>

<style scoped lang="scss">
.common-layout{
    padding: 0;
    margin: 0;
    overflow: hidden;
    .el-container{
        padding: 0;
        margin: 0;
        width: 100vw;
        height: 100vh;
        .left-aside{
            width:200px;
            padding: 0;
            margin: 0;
            overflow: hidden;
        }
        .leftcollapse{
              width:64px;
        }
        .el-main{
            width: 100%;
            height: 100%;
            position: relative;
            padding: 0;
            margin: 0;
            border: 0;
            overflow: hidden;
        }
        .el-footer{
            border: 0;
            padding: 0;
            margin: 0;
            width: 100%;
            height: 300px;
            overflow: hidden;
            background-color: fff;
            div{
              border: 0;
              padding: 0;
              margin: 0;
              width: 100%;
              height: 300px;
              overflow: hidden;
            }
        }
        .right-aside{
            padding: 0;
            margin: 0;
            overflow: hidden;
        }
    }
}

</style>
