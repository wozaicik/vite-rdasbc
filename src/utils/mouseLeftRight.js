import { watch, ref, onUnmounted } from 'vue'
import { ElMessage } from 'element-plus'
import { useRoute } from 'vue-router'
import * as Cesium from 'cesium'

export function useClickEvent (paramsId) {
  // 存储鼠标左键点击获取的值
  const Coordinate = ref(0)
  // 是否点击了右键
  const isRightClick = ref(false)
  // 鼠标左键点击事件 传出去
  let handlerLeftEvent
  // 鼠标右键点击事件 传出去
  let handlerRightEvent

  const route = useRoute()
  // 监听路由的变化
  watch(() => route.params.id, (newVal) => {
    if (newVal === paramsId) {
      setTimeout(() => {
        const viewer = window.viewer
        // 鼠标左键点击事件
        handlerLeftEvent = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas)
        handlerLeftEvent.setInputAction((movement) => {
          // 获得鼠标点击的笛卡尔空间直角坐标
          Coordinate.value = viewer.scene.pickPosition(movement.position)
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK)

        // 鼠标右键点击事件
        handlerRightEvent = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas)
        handlerRightEvent.setInputAction((movement) => {
          isRightClick.value = !isRightClick.value
        }, Cesium.ScreenSpaceEventType.RIGHT_CLICK)
        ElMessage({
          message: '请点击地球上任意位置',
          type: 'success'
        })
      }, 3000)
    }
  }, { immediate: true })

  onUnmounted(() => {
    handlerLeftEvent.destroy()
    handlerRightEvent.destroy()
    handlerLeftEvent = null
    handlerRightEvent = null
  })

  return { Coordinate, isRightClick, handlerLeftEvent, handlerRightEvent }
}
