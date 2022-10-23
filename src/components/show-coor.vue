<template>
  <el-row  justify="center" align="middle" class="elrow">
    <el-col :span="12" v-if="showCGCS">
        <span>X:{{showCGCS.x.toFixed(2)}}</span>
        <span>Y:{{showCGCS.y.toFixed(2)}}</span>
        <span>Z:{{showCGCS.z.toFixed(2)}}</span>
    </el-col>
    <el-col :span="12" v-if="showLoca">
        <span>x:{{showLoca.x.toFixed(2)}}</span>
        <span>y:{{showLoca.y.toFixed(2)}}</span>
        <span>z:{{showLoca.z.toFixed(2)}}</span>
    </el-col>
  </el-row>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import * as Cesium from 'cesium'
import { layoutStore } from '../store/layoutStore'
import { storeToRefs } from 'pinia'
import { car3Tran } from '@/utils/singlecoortran.js'

const props = defineProps({
// elementX
  elementX: { type: Number, default: 0 },
  // elementY
  elementY: { type: Number, default: 0 },
  // isOutside
  isOutside: { type: Boolean, default: false }

})

// 将鼠标在main-DOM内的位置信息,转化为Cartesian2类
const mainCar2 = computed(() => {
  return new Cesium.Cartesian2(props.elementX, props.elementY)
})
// 存放转化好的car3坐标值
const mainCar3 = ref(null)

// 保存要显示经纬度
const showLonLat = ref(null)
// 保存要显示的CGCS2000
const showCGCS = ref(null)
// 保存要显示的地方坐标系
const showLoca = ref(null)
// 拿到全局状态存储库,判断isViewer是否为true,为true则地球加载完毕,同时viewer也赋值给window.viewer
const layout = layoutStore()
const { isViewer } = storeToRefs(layout)
// 监听isViewer和鼠标值的变化,当改变时,计算经纬度和CGCS2000坐标值
watch([isViewer, mainCar2], ([newViewer, newMainCar2]) => {
  if (newViewer) {
    const viewer = window.viewer
    mainCar3.value = viewer.scene.pickPosition(newMainCar2)
    const { lonLat, gsProj, localCoor } = car3Tran(mainCar3)
    showLonLat.value = lonLat.value
    showCGCS.value = gsProj.value
    showLoca.value = localCoor.value
  }
})

</script>

<style lang="scss" scoped>
.elrow{
    position: absolute;
    bottom: 0;
    right: 0;
    width: 35%;
    padding: 0;
    margin: 0;
    border: 0;
    color: #fff;
    display: flex;
    justify-content:flex-end;
    align-items:center;
    background-color: rgba(211,211,211,0);
    z-index: 999;
    .el-col{
        display: flex;
        justify-content:space-around;
        align-items:center;
    }
}
</style>
<!--
//   console.log(newMainCar2)
  //   console.log(newViewer)
//   console.log(viewer.scene.pickPosition(newMainCar2))
//   console.log(mainCar3.value)
//   console.log(viewer.scene.globe.pick(viewer.camera.getPickRay(newMainCar2)))
//   console.log(viewer.scene.camera.pickEllipsoid(newMainCar2))
//   console.log(mainCar3.value)
//   console.log(newVal)
//   console.log(window.viewer)
//   console.log(mainCar2.value)
//   console.log(viewer.scene.pickPosition(mainCar2.value)) -->
