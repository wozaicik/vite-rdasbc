<template>
    <el-card :body-style="{ padding: '5px' }" shadow="always">
      <el-row >
        <el-col :span="24">
        <el-row>
          <el-col :span="12">111</el-col><el-col :span="12">111</el-col>
        </el-row>
        </el-col>
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
import { defineComponent, onMounted } from 'vue'
import { calTwoPointDistance } from '@/utils/caltwopoidis.js'

export default defineComponent({
  name: 'TwoPointDistanceItem',
  props: {
    data: {
      type: Array,
      default: () => ([])
    }
  },
  setup (props) {
    onMounted(() => {
      calTwoPointDistance(props.data)
    })
  }
})

</script>

<style lang="scss" scoped>
.el-card{
  width: 100%;
  height: 120px;
  padding: 0px;
}
</style>
