<template>
    <el-card :body-style="{ padding: '5px' }" shadow="always" >
        <el-row>
            <el-col :span="24">
                <span>线条1</span>
            </el-col>
        </el-row>
        <el-row class="distance">
            <el-col :span="24">
                <span>长度：</span><span>长度</span>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="24">
                <el-button  size="small">保存</el-button>
                <el-button  size="small">清除</el-button>
                <el-button  size="small">断面图</el-button>
            </el-col>
        </el-row>
    </el-card>
</template>

<script>
import { defineComponent, onMounted, ref, watch } from 'vue'
import * as Cesium from 'cesium'
import { drawPoint, drawPolylineNone } from '@/utils/drawEntity.js'
import { useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { nanoid } from 'nanoid'
import { calTwoPointDistance } from '@/utils/caltwopoidis.js'

export default defineComponent({
  name: 'MulPointDistanceItem',
  setup () {
    // ----------------------开启事件-----------------
    // 存放事件处理器 便于后期销毁
    let handlerEvent
    // 获取路由
    const route = useRoute()
    watch(() => route.params.id, (newVal) => {
      // 路由一致时，开启事件
      if (newVal === 'multipointDistance') {
        // 三秒之后开启点击事件，为什么
        // 因为要等地球加载完毕，在window中存在viewer之后，才能开启事件
        setTimeout(() => {
          const { handler } = leftClick(tempCoor)
          handlerEvent = handler
          ElMessage({
            message: '请点击地球上任意位置',
            type: 'success'
          })
        }, 3000)
      } else {
        // 当路由变化，销毁事件
        handlerEvent.destroy()
        handlerEvent = null

        handlerRightEvent.destroy()
        handlerRightEvent = null
      }
    }, { immediate: true })
    // --------开启右键点击事件--------
    // 使用另一种方式试一下开启事件
    // 是否点击了右键
    const isRightClick = ref(false)
    // 存储右键点击事件
    let handlerRightEvent
    onMounted(() => {
      setTimeout(() => {
        handlerRightEvent = rightClick(isRightClick)
      }, 3000)
    })
    // 鼠标右键点击之后，
    // 1. 需要将最后一个entityPoint弹出，并删除
    // 2. entityPointIds也需要弹出
    // 3. 将isRightClick设置为false
    // 4. 将index-1
    watch(isRightClick, (newVal) => {
      if (newVal === true && entityPointArray && entityPointIds) {
        const lastEntityPoint = entityPointArray.pop()
        window.viewer.entities.remove(lastEntityPoint)
        entityPointIds.pop()
        isRightClick.value = false

        if (entityPolylineArray.length !== 0) {
          entityPolylineIds.pop()
          const lastEntityPolyline = entityPolylineArray.pop()
          coordinatePair.splice(0, coordinatePair.length)
          coordinatePair.push(lastEntityPolyline.polyline.positions._value[0])
          window.viewer.entities.remove(lastEntityPolyline)
        }

        index.value--
      }
      if (entityPointArray.length === 0 || index.value <= 0) {
        index.value = 1
        coordinatePair.splice(0, coordinatePair.length)
      }
    })
    // ---------------添加点------------
    // 点的序号
    const index = ref(1)
    // 存储临时坐标
    const tempCoor = ref(null)
    // 存储-entity-point
    const entityPointArray = []
    // 存储点的ID
    const entityPointIds = []
    watch(tempCoor, (newCoor) => {
      if (newCoor instanceof Cesium.Cartesian3) {
        const idRandom = nanoid(12) // 设置随机id
        // 设置id  Two Point 1...
        const pointId = 'MPD-point-' + index.value + idRandom
        entityPointIds.push(pointId)
        // 绘制点
        const { entityPoint } = drawPoint(newCoor, pointId, index.value)
        entityPointArray.push(entityPoint)

        // 添加entityPolyline
        coordinatePair.push(newCoor)
        if (coordinatePair.length === 2) {
          const polylineId = 'MPD-pol-' + index.value + idRandom // id
          const { twoCoors, distance, midpoint } = calTwoPointDistance(coordinatePair)// 计算中间点和距离
          //  绘制entityPolyline
          const { entityPolyline } = drawPolylineNone(twoCoors, midpoint, polylineId, distance)
          //   console.log(polyline)
          //   console.log(polyline.positions._value)
          entityPolylineArray.push(entityPolyline)
          entityPolylineIds.push(polylineId)
          coordinatePair.shift()
        }

        index.value++
      }
    })
    //
    // ---------------添加线-------------------
    // 存储 entityPolyline
    const entityPolylineArray = []
    // polylineID
    const entityPolylineIds = []
    // 存储坐标对 一对坐标
    const coordinatePair = []
  }
})
// 鼠标左键点击事件
const leftClick = (tempCoor) => {
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
// 鼠标右键点击事件
// 回退上一步，把最后添加的点删除
const rightClick = (isRightClick) => {
  // 传出事件
  let handlerRight
  // 右键是否点击
  const isclick = isRightClick
  // 获得全局变量中的viewer
  const viewer = window.viewer
  if (viewer) {
    // Cesium的事件管理函数
    handlerRight = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas)
    // 鼠标左键点击事件
    handlerRight.setInputAction((movement) => {
      isclick.value = !isclick.value
    //   console.log(isclick.value)
    }, Cesium.ScreenSpaceEventType.RIGHT_CLICK)
  }
  return { handlerRight }
}
</script>

<style lang="scss" scoped>

    .el-card{
        height: 90px;
        margin: 0px 5px 5px 0px;
        padding: 0px;
        border: 0;
        font-size: 14px;
        .distance{
            .el-col{
                display: flex;
                justify-content: center;
                align-items: center;
                padding: 0px 0px 15px 0;
            }

        }
    }

</style>
