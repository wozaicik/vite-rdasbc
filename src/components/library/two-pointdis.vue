<template>
  <el-row>
      <el-col class="card-header">
        <span>两点距离</span>
        <el-button class="button" text>Operation button</el-button>
      </el-col>
    <TwoPointDistanceItem></TwoPointDistanceItem>
    {{tempCoor}}
  </el-row>
</template>

<script>
import { defineComponent, ref, watch } from 'vue'
import * as Cesium from 'cesium'
import { useRoute } from 'vue-router'

export default defineComponent({
  name: 'twoPointDistance',
  setup () {
    // 坐标对 存放传给子组件的数据  数据格式为：[[],[],[]]
    // const coordinatePair = reactive([])
    // // 存放临时的坐标对  只有当数组长度为2时 才会将临时的数组存放进coordinatePair中
    // const tempCoorPair = reactive([])
    // 存放事件处理器 便于后期销毁
    let handlerEvent
    // 存放零时的坐标
    const tempCoor = ref(null)

    const route = useRoute()
    watch(() => route.params.id, (newVal) => {
      if (newVal === 'twoPointDistance') {
        setTimeout(() => {
          const { handler } = getCoor(tempCoor)
          handlerEvent = handler
        }, 3000)
      } else {
        handlerEvent.destroy()
        handlerEvent = null
      }
    }, { immediate: true })
  }
})
const getCoor = (tempCoor) => {
  // 获得全局变量中的viewer
  const viewer = window.viewer
  // 将响应式数据传给cartesian 这样cartesian也会变成响应式
  const cartesian = tempCoor
  // Cesium的事件管理函数
  const handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas)
  // 鼠标左键点击事件
  handler.setInputAction((movement) => {
    // 获得鼠标点击的笛卡尔空间直角坐标
    cartesian.value = viewer.scene.pickPosition(movement.position)
  }, Cesium.ScreenSpaceEventType.LEFT_CLICK)
  return { handler }
}

</script>

<style lang="scss" scoped>
.el-row{
  width: 480px;
  height: 550px;
  position: absolute;
  top: 5px;
  right: 5px;
  background-color: #fff;
  z-index: 999;
  .el-col {
  display: flex;
  justify-content:space-around;
  align-items: center;
}
}

</style>
