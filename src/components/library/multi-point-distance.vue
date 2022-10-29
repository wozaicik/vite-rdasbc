<template>
    <div class="mul-point" style="overflow-y:auto">
        <div>
          <el-row>
              <el-col class="card-header" :span="24">
                <span >多点距离</span>
                <el-button class="button" type="primary" icon="Delete" >清除所有</el-button>
              </el-col>
          </el-row>
        </div>
        <el-card :body-style="{ padding: '15px' }" shadow="always">
            <MulPointDistanceItem></MulPointDistanceItem>
        </el-card>
    </div>
  </template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'multipointDistance',
  setup () {

  }
})
</script>

<style lang="scss" scoped>
.mul-point{
    width: 480px;
    // min-height: 180px;
    max-height: 550px;
    position: absolute;
    top: 5px;
    right: 5px;
    background-color:#fff;
    z-index: 999;
    .el-col{
        display: flex;
        justify-content:space-around;
        align-items: center;
    }
}
</style>
