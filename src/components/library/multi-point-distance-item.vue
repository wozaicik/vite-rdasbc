<template>
    <el-card :body-style="{ padding: '5px' }" shadow="always" >
        <el-row>
            <el-col :span="24">
                <span>线条1</span>
            </el-col>
        </el-row>
        <el-row class="distance">
            <el-col :span="24">
                <span>长度：</span><span>{{displayDis}}</span>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="24" class="option">
                <el-button  size="small" @click="savePolylineFn()">保存</el-button>
                <el-button  size="small" @click="clearEntityFn()">清除</el-button>
                <el-switch
                    v-model="isFooterOpen"
                    size="small"
                    active-text="断面图-开"
                    inactive-text="断面图-关"
                />
            </el-col>
        </el-row>
    </el-card>
</template>

<script>
import { computed, defineComponent, reactive, ref, watch } from 'vue'
import * as Cesium from 'cesium'
import { drawPoint, drawPolylineNone } from '@/utils/drawEntity.js'
import { useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { nanoid } from 'nanoid'
import { calTwoPointDistance } from '@/utils/caltwopoidis.js'
import { useSection, useDrawSection } from '@/utils/useRoad.js'
import { layoutStore } from '@/store/layoutStore.js'
import { storeToRefs } from 'pinia'
import { useVModel } from '@vueuse/core'

export default defineComponent({
  name: 'MulPointDistanceItem',
  props: {
    modelValue: {
      type: Boolean,
      default: false
    }
  },
  setup (props, { emit }) {
    // 点的序号
    const index = ref(1)
    // 存储临时坐标
    const tempCoor = ref(0)
    // 存储-entity-point
    const entityPointArray = []
    // 存储点的ID
    const entityPointIds = []

    // ----------------------开启事件-----------------
    // 存放事件处理器 便于后期销毁
    let handlerEvent
    // 是否点击了右键
    const isRightClick = ref(false)
    // 存储右键点击事件
    let handlerRightEvent
    // 获取路由
    const route = useRoute()
    watch(() => route.params.id, (newVal) => {
      // 路由一致时，开启事件
      if (newVal === 'multipointDistance') {
        // 三秒之后开启点击事件，为什么
        // 因为要等地球加载完毕，在window中存在viewer之后，才能开启事件
        // setTimeout(() => {
        const { handler } = leftClick(tempCoor)
        const { handlerRight } = rightClick(isRightClick)
        handlerEvent = handler
        handlerRightEvent = handlerRight
        ElMessage({
          message: '请点击地球上任意位置',
          type: 'success'
        })
        // }, 100)
      }
      if (newVal !== 'multipointDistance' && handlerEvent) {
        // 当路由变化，销毁事件
        handlerEvent.destroy()
        // handlerEvent = null

        // 销毁鼠标右键点击事件
        handlerRightEvent.destroy()
        // handlerRightEvent = null
      }
    }, { immediate: true })
    // --------开启右键点击事件--------
    // 使用另一种方式试一下开启事件

    // 在组件加载完成三秒后，加载鼠标右键点击事件
    // onMounted(() => {
    //   setTimeout(() => {

    //   }, 3000)
    // })
    // 鼠标右键点击之后，
    // 1. 需要将最后一个entityPoint弹出，并删除
    // 2. entityPointIds也需要弹出
    // 3. 将isRightClick设置为false
    // 4. 将index-1

    // 监听是否点击了鼠标右键
    watch(isRightClick, (newVal) => {
      // 当点击了鼠标右键时，存储entityPointArray的数组也必须有值
      if (newVal === true && entityPointArray && entityPointIds) {
        // 弹出entityPointArray的最后一个点，并获得它
        const lastEntityPoint = entityPointArray.pop()
        // 将最后一个点移除
        window.viewer.entities.remove(lastEntityPoint)
        // 将最后一个id弹出
        entityPointIds.pop()
        // 把是否点击鼠标左键改为false
        isRightClick.value = false

        // 判断entityPolylineArray的数组是否有值
        // 如果有值继续进行运算
        if (entityPolylineArray.length !== 0) {
          // 弹出最后一个线段的id
          entityPolylineIds.pop()
          // 弹出最后一个线段
          const lastEntityPolyline = entityPolylineArray.pop()
          // 将坐标对清空
          coordinatePair.splice(0, coordinatePair.length)
          // 添加坐标    该坐标为最后一个线段的  第一个点
          coordinatePair.push(lastEntityPolyline.polyline.positions._value[0])
          // 移除最后一个线段
          window.viewer.entities.remove(lastEntityPolyline)

          // 移除最后49个数据
          section.splice(-49)

          // 移除最后一个距离
          distanceArray.pop()
        }

        // 序号--
        index.value--
      }
      // 如果 存储entityPoint的数组长度为0，说明地球上已经没有任何点了。需要重置
      // 将序号改为1
      // 将坐标对数组清空
      if (entityPointArray.length === 0 || index.value <= 0) {
        index.value = 1
        coordinatePair.splice(0, coordinatePair.length)
      }
    })
    // ---------------添加点------------
    // 监听临时坐标的变化
    watch(tempCoor, async (newCoor) => {
      // 如果采集的坐标是Cartesian3类型
      if (newCoor instanceof Cesium.Cartesian3) {
        // 设置一个随机的id，为了防止回退出现重复id
        const idRandom = nanoid(12) // 设置随机id
        // 设置id  Two Point 1...
        const pointId = 'MPD-point-' + index.value + idRandom
        // 对id进行一个存储
        entityPointIds.push(pointId)
        // 绘制点
        const { entityPoint } = drawPoint(newCoor, pointId, index.value)
        // 对返回的点entityPoint进行保存
        entityPointArray.push(entityPoint)

        index.value++
        // 添加entityPolyline
        // 1. 将得到的新的坐标，添加到坐标对中
        // 2. 判断长度是否为2
        // 3. 制作id
        // 4. 计算线段的中间点、距离和进行解构之后的坐标对
        // 5. 绘制线段
        // 6. 将的到entityPolyline保存
        // 7. 添加id
        // 8. 删除坐标对的第一个点
        coordinatePair.push(newCoor)
        if (coordinatePair.length === 2) {
          const polylineId = 'MPD-pol-' + index.value + idRandom // id
          const { lonlatOne, lonlatTwo, twoCoors, distance, midpoint } = calTwoPointDistance(coordinatePair)// 计算中间点和距离
          const { entityPolyline } = drawPolylineNone(twoCoors, midpoint, polylineId, distance)
          entityPolylineArray.push(entityPolyline)
          entityPolylineIds.push(polylineId)
          coordinatePair.shift()

          const result = await useSection(lonlatOne, lonlatTwo, displayDis.value, distance)
          section.push(...result)
          //   useDrawSection(section) 给Echart传输数据，然后打开断面图
          // 计算长度
          // 乘以 1  是为了将字符串改为Number类型
          distanceArray.push(distance * 1)
        }
        // 序号+1
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
    // ----------------------计算长度---------------
    // 使用计算属性来计算长度
    // 定义一个数组存储每个线段的长度
    // 最后通过reduce累加计算长度
    const distanceArray = reactive([])
    const displayDis = computed(() => {
      return (distanceArray.reduce((p, c) => p + c, 0)).toFixed(2)
    })
    // --------------断面图-----------
    // 存储生成断面的数据 数据结构为[[] [] [] [] []]
    const section = reactive([])
    // 拿到状态库
    const layout = layoutStore()
    const { isFooterOpen } = storeToRefs(layout)

    watch(section, () => {
      if (isFooterOpen) {
        useDrawSection(section)
      }
    })
    // --------------保存-----重新开始画一条
    // 保存所有的entity
    const allEntity = []
    // 保存所有的entity id
    const allIds = []
    const savePolylineFn = () => {
      // 保存现有entity
      allEntity.push(...entityPointArray)
      allIds.push(...entityPointIds)

      allEntity.push(...entityPolylineArray)
      allIds.push(...entityPolylineIds)
      // 对一些变量进行重置
      // 点
      index.value = 1
      tempCoor.value = null
      entityPointArray.splice(0, entityPointArray.length)
      entityPointIds.splice(0, entityPointIds.length)
      // 线
      entityPolylineArray.splice(0, entityPolylineArray.length)
      entityPolylineIds.splice(0, entityPolylineIds.length)
      coordinatePair.splice(0, coordinatePair.length)
      distanceArray.splice(0, distanceArray.length)
      section.splice(0, section.length)
    }
    // ------------清除正在画的数据---
    const clearEntityFn = () => {
      if (window.viewer) {
        // 清除点entity
        entityPointArray.forEach(item => {
          window.viewer.entities.remove(item)
        })
        entityPointArray.splice(0, entityPointArray.length)
        entityPointIds.splice(0, entityPointIds.length)
        // 清除线
        entityPolylineArray.forEach(item => {
          window.viewer.entities.remove(item)
        })
        entityPolylineIds.splice(0, entityPolylineIds.length)
        entityPolylineArray.splice(0, entityPolylineArray.length)
        // 将数据重置
        // 点
        index.value = 1
        tempCoor.value = null
        // 线
        coordinatePair.splice(0, coordinatePair.length)
        distanceArray.splice(0, distanceArray.length)
        section.splice(0, section.length)
      }
    }
    // -------------清除所有---------------------
    const isClearAll = useVModel(props, 'modelValue', emit)
    watch(isClearAll, (newVal) => {
      if (allEntity.length === 0 && newVal === true) {
        ElMessage({
          message: '请先保存数据！',
          type: 'warning'
        })
      }
      if (newVal && allEntity.length !== 0 && window.viewer) {
        // 清除所有的entity
        allEntity.forEach(item => {
          window.viewer.entities.remove(item)
        })
        allEntity.splice(0, allEntity.length)
        allIds.splice(0, allIds.length)
        // 清除正在画的数据
        clearEntityFn()
      }
      isClearAll.value = false
    })

    return { isClearAll, displayDis, isFooterOpen, savePolylineFn, clearEntityFn }
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
  // let handlerRight
  // 右键是否点击
  const isclick = isRightClick
  // 获得全局变量中的viewer
  const viewer = window.viewer

  // Cesium的事件管理函数
  const handlerRight = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas)
  // 鼠标左键点击事件
  handlerRight.setInputAction((movement) => {
    isclick.value = !isclick.value
    //   console.log(isclick.value)
  }, Cesium.ScreenSpaceEventType.RIGHT_CLICK)

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
                padding: 0px 0px 25px 0;
            }
        }
        .option{
            display: flex;
            justify-content: space-around;
            align-items: center;
        }
    }

</style>
