<template>
    <el-card :body-style="{ padding: '5px' }">
      <el-row >
        <el-col :span="24">111</el-col>
      </el-row>
      <el-row>
        <el-col :span="24">222</el-col>
      </el-row>
      <el-row>
        <el-col :span="24">333</el-col>
      </el-row>
      <el-row>
        <el-col :span="24">444</el-col>
      </el-row>
      <el-row>
        <el-col :span="24">555</el-col>
      </el-row>
      <el-row>
        <el-col :span="24">666</el-col>
      </el-row>
    </el-card>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'TwoPointDistanceItem',
  props: {
    data: {
      type: Array,
      default: () => ([])
    }
  },
  setup (props) {

  }
})

</script>

<style lang="scss" scoped>
.el-card{
  width: 100%;
  height: 100%;
  padding: 0px;

}
</style>
