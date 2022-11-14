import { ref, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { useRoute } from 'vue-router'
import * as Cesium from 'cesium'
import { layoutStore } from '@/store/layoutStore.js'
import { storeToRefs } from 'pinia'

export const useMouseLeftClick = (paramsId, domId, callFn) => {
  // 鼠标左键点击获取的坐标值
  const coordinate = ref(null)
  // 鼠标左键点击事件
  let handlerLeftEvent

  let handleMoveEvent

  const route = useRoute()
  const layout = layoutStore()
  const { isViewer } = storeToRefs(layout)

  watch(
    () => [isViewer, route.params.id],
    ([newIs, newId]) => {
      if (newIs.value && newId === paramsId) {
        const viewer = window.viewer
        // 鼠标左键点击事件
        handlerLeftEvent = new Cesium.ScreenSpaceEventHandler(
          viewer.scene.canvas
        )
        handlerLeftEvent.setInputAction((movement) => {
          // 获得鼠标点击的笛卡尔空间直角坐标
          coordinate.value = viewer.scene.pickPosition(movement.position)
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK)
        handleMoveEvent = mouseMoveEvent(domId)
        // mouseMoveEvent(domId)
        callFn()
        ElMessage({
          message: '请点击地球上任意位置',
          type: 'success'
        })
      }
    },
    { immediate: true }
  )

  watch(
    isViewer,
    (newVal) => {
      if (newVal && !handlerLeftEvent) {
        const viewer = window.viewer
        // 鼠标左键点击事件
        handlerLeftEvent = new Cesium.ScreenSpaceEventHandler(
          viewer.scene.canvas
        )
        handlerLeftEvent.setInputAction((movement) => {
          // 获得鼠标点击的笛卡尔空间直角坐标
          coordinate.value = viewer.scene.pickPosition(movement.position)
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK)
        handleMoveEvent = mouseMoveEvent(domId)
        callFn()
        ElMessage({
          message: '请点击地球上任意位置',
          type: 'success'
        })
      }
    },
    { immediate: true }
  )

  // 监听路由的变化
  watch(
    () => route.params.id,
    (newVal) => {
      if (newVal !== paramsId && handlerLeftEvent) {
        handlerLeftEvent.destroy()
        handlerLeftEvent = null
        handleMoveEvent.destroy()
        handleMoveEvent = null
      }
    },
    { immediate: true }
  )

  return { coordinate, handlerLeftEvent }
}

const mouseMoveEvent = (domId) => {
  const viewer = window.viewer
  // 鼠标左键点击事件
  const handleMoveEvent = new Cesium.ScreenSpaceEventHandler(
    viewer.scene.canvas
  )
  setTimeout(() => {
    const div = document.getElementById(domId)
    const img = div.getElementsByTagName('img')
    const p = div.getElementsByTagName('p')
    handleMoveEvent.setInputAction((movement) => {
      const pickedEntity = viewer.scene.pick(movement.endPosition)
      if (Cesium.defined(pickedEntity)) {
        const entity = pickedEntity.id
        const id = entity.id
        if (id.includes('add-point')) {
          const windowCoord = viewer.scene.cartesianToCanvasCoordinates(
            entity.position._value
          )
          // const x = windowCoord.x - div.offsetWidth / 2
          // const y = windowCoord.y - div.offsetHeight - 10
          if (entity.imgURL) {
            img[0].src = entity.imgURL
          }
          if (entity.textarea) {
            p[0].innerHTML = entity.textarea
          }
          if (entity.imgURL || entity.textarea) {
            const x = windowCoord.x - div.offsetWidth / 2
            const y = windowCoord.y - div.offsetHeight - 35
            // div.style.cssText = `visibility:visible;transform:translate3d(${Math.round(x)}px,${Math.round(y)}px, 0);`
            div.style.cssText = `visibility:visible;transform:translate3d(${Math.round(x)}px,${Math.round(y)}px, 0);`
          }
        }
      }
      if (!Cesium.defined(pickedEntity) && div) {
        div.style.visibility = 'hidden'
        // div.style.display = 'none'
      }
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE)
  }, 3000)

  return handleMoveEvent
}
