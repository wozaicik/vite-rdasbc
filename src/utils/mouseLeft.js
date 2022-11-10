import { watch, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { useRoute } from 'vue-router'
import * as Cesium from 'cesium'
import { layoutStore } from '@/store/layoutStore.js'
import { storeToRefs } from 'pinia'

export function useMouseLeftClick (paramsId, callFn) {
  // 鼠标左键点击获取的坐标值
  const coordinate = ref(null)
  // 鼠标左键点击事件
  let handlerLeftEvent

  const route = useRoute()
  const layout = layoutStore()
  const { isViewer } = storeToRefs(layout)

  watch(() => ([isViewer, route.params.id]), ([newIs, newId]) => {
    if (newIs.value && newId === paramsId) {
      const viewer = window.viewer
      // 鼠标左键点击事件
      handlerLeftEvent = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas)
      handlerLeftEvent.setInputAction((movement) => {
        // 获得鼠标点击的笛卡尔空间直角坐标
        coordinate.value = viewer.scene.pickPosition(movement.position)
      }, Cesium.ScreenSpaceEventType.LEFT_CLICK)
      callFn()
      ElMessage({
        message: '请点击地球上任意位置',
        type: 'success'
      })
    }
  }, { immediate: true })

  watch(isViewer, (newVal) => {
    if (newVal && !handlerLeftEvent) {
      const viewer = window.viewer
      // 鼠标左键点击事件
      handlerLeftEvent = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas)
      handlerLeftEvent.setInputAction((movement) => {
        // 获得鼠标点击的笛卡尔空间直角坐标
        coordinate.value = viewer.scene.pickPosition(movement.position)
      }, Cesium.ScreenSpaceEventType.LEFT_CLICK)
      callFn()
      ElMessage({
        message: '请点击地球上任意位置',
        type: 'success'
      })
    }
  }, { immediate: true })

  // 监听路由的变化
  watch(() => route.params.id, (newVal) => {
    if (newVal !== paramsId && handlerLeftEvent) {
      handlerLeftEvent.destroy()
      handlerLeftEvent = null
    }
  }, { immediate: true })

  return { coordinate, handlerLeftEvent }
}
