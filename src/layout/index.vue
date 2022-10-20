<template>
    <div class="common-layout">
      <el-container>
        <el-aside width="200px">
            <LeftAside></LeftAside>
        </el-aside>
        <el-container>
          <el-main>Main11111</el-main>
          <el-footer>Footer</el-footer>
        </el-container>
        <el-aside width="200px">Aside</el-aside>
      </el-container>
    </div>
  </template>

<script setup>
import LeftAside from './components/left-aside.vue'

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
        .el-aside{
            padding: 0;
            margin: 0;
            overflow: hidden;
        }
        .el-main{
            padding: 0;
            margin: 0;
            overflow: hidden;
        }
        .el-footer{
            padding: 0;
            margin: 0;
            overflow: hidden;
        }
    }
}

</style>
