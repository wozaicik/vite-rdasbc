<template>
  <div class="two-point" style="overflow:auto">
      <div>
        <el-row>
            <el-col class="card-header" :span="24">
              <span>两点距离</span>
              <el-button class="button" text @click="clearAll">清 除</el-button>
            </el-col>
        </el-row>
      </div>
      <el-space fill wrap direction="vertical" style="width: 100%">
        <template v-if="show" >
          <TwoPointDistanceItem v-for="(item,i) in coordinatePair" :key="i" :data="item" :index="i"></TwoPointDistanceItem>
        </template>
        <el-card v-else>
          <div >请使用鼠标左键点击地球任意位置！</div>
          <div >此功能将计算两个点之间的距离、坡度、坡向、方位角</div>
          <div >同时显示国家2000坐标、地方坐标</div>
        </el-card>
      </el-space>
  </div>
</template>

<script>
import { defineComponent, reactive, ref, toRaw, watch } from 'vue'
import * as Cesium from 'cesium'
import { useRoute } from 'vue-router'
import { drawPoint, clearEntityArray } from '@/utils/drawEntity.js'
import { ElMessage } from 'element-plus'
import { storeToRefs } from 'pinia'
import { layoutStore } from '@/store/layoutStore.js'

export default defineComponent({
  name: 'twoPointDistance',
  setup () {
    // 坐标对 存放传给子组件的数据  数据格式为：[[],[],[]]
    const coordinatePair = reactive([])
    // // 存放临时的坐标对  只有当数组长度为2时 才会将临时的数组存放进coordinatePair中
    let tempCoorPair = []
    // 存放事件处理器 便于后期销毁
    let handlerEvent
    // 存放临时的坐标
    const tempCoor = ref(null)
    // 展示坐标成果
    const show = ref(false)

    const route = useRoute() //
    const layout = layoutStore()
    const { isViewer } = storeToRefs(layout)

    watch(() => ([isViewer, route.params.id]), ([newIs, newId]) => {
      if (newIs.value && newId === 'twoPointDistance') {
        const { handler } = getCoor(tempCoor)
        handlerEvent = handler
        ElMessage({
          message: '请点击地球上任意位置',
          type: 'success'
        })
      }
    }, { immediate: true })

    watch(isViewer, (newVal) => {
      if (newVal && !handlerEvent) {
        console.log(2)
        const { handler } = getCoor(tempCoor)
        handlerEvent = handler
        ElMessage({
          message: '请点击地球上任意位置',
          type: 'success'
        })
      }
    }, { immediate: true })

    // 根据路由来判断，是否开启左键点击事件，如果路由为：twoPointDistance
    // 则开启鼠标左边点击事件，当路由发生变化时，销毁事件
    // 监听路由的变化 开启和关闭事件

    watch(() => route.params.id, (newVal) => {
      if (newVal !== 'twoPointDistance' && handlerEvent) {
        // 当路由变化，销毁事件
        handlerEvent.destroy()
        handlerEvent = null
      }
    }, { immediate: true })

    // 监听临时坐标，当临时坐标发生改变时，且其值为Cartesian3
    // 则说明是符合要求的car3坐标
    // 需要进行如下几件事：
    // 1. 将坐标添加到临时坐标对
    // 2. 根据获取的坐标绘制点
    // 3. 保存绘制的entity
    // 4. 序号自动加+
    let entities = [] // 存储entity，主要为点
    let entitiesId = []// 存储entity的id
    const index = ref(1)// 序号
    watch(tempCoor, (newVal) => {
      // 判断坐标的类型是否为Cartesian3
      if (newVal instanceof Cesium.Cartesian3) {
        // 将坐标添加到临时坐标对
        tempCoorPair.push(toRaw(newVal))
        // 设置id  Two Point 1...
        const id = 'TPD-point-' + index.value
        // 绘制点
        const { entityPoint } = drawPoint(newVal, id, index.value)
        entities.push(entityPoint)
        entitiesId.push(id)
        index.value++
        // 判断tempCoorPair的长度是否为2，当为2时，将其添加到坐标对中
        if (tempCoorPair.length === 2) {
          coordinatePair.push(tempCoorPair)
          tempCoorPair = []
          show.value = true
        }
      }
    })

    // 清除所有的数据
    // 1. 清除坐标对中的数据
    // 2. 清除临时坐标对中的数据
    // 3. 清除所有的entityPoint数据
    // 4. 清除所有的entityPolyline数据
    // 5. 将序号重置为1
    // 6. 将show改为false
    const clearAll = () => {
      coordinatePair.splice(0, coordinatePair.length)
      tempCoorPair = []
      tempCoor.value = null
      clearEntityArray(entities)
      entities = []
      entitiesId = []
      index.value = 1
      show.value = false
    }

    return { coordinatePair, show, clearAll }
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
.two-point{
    width: 480px;
    max-height: 550px;
    position: absolute;
    top: 5px;
    right: 5px;
    background-color: #fff;
    z-index: 999;
    &>div{
      position: relative;
      .el-row{
        display: flex;
        flex-wrap:nowrap;
      .el-col {
        display: flex;
        justify-content:space-around;
        align-items: center;
    }
  }
    }
    .el-space{
      .el-card{
        text-align: center;
        div{
          margin-top: 10px;
        }
      }
    }

}

</style>
