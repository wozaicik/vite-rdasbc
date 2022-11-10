<template>
    <div class="add-point" >
        <div class="point-name">
            <el-row justify="center" align="middle">
                <el-col :span="4">
                    <span>名称：</span>
                </el-col>
                <el-col :span="20">
                    <el-input v-model="labelText"  placeholder="请输入名称"  />
                </el-col>
            </el-row>
        </div>
        <div class="point-coor">
            <el-row justify="center" align="middle">
                <el-col :span="4">
                    <span>x：</span>
                </el-col>
                <el-col :span="8" v-if="coorBidirectional">
                    <el-input-number v-model="coorBidirectional.x" :precision="8"  :controls="false"/>
                </el-col>
            </el-row>
            <el-row justify="center" align="middle">
                <el-col :span="4">
                    <span>y：</span>
                </el-col>
                <el-col :span="8" v-if="coorBidirectional">
                    <el-input-number v-model="coorBidirectional.y" :precision="8"  :controls="false"/>
                </el-col>
            </el-row>
            <el-row justify="center" align="middle">
                <el-radio-group v-model="coorType" @change="toggleFn($event)">
                    <el-radio label="LL">经 纬 度</el-radio>
                    <el-radio label="CGCS">国家2000</el-radio>
                    <el-radio label="LC">地方坐标</el-radio>
                </el-radio-group>
            </el-row>
        </div>
        <div class="point-option">
            <el-tabs type="border-card" stretch>
                <el-tab-pane label="说明">1</el-tab-pane>
                <el-tab-pane label="样式/颜色">
                    <div>
                        <p>标签设置</p>
                        <el-row >
                            <el-col :span="12">
                                <span>颜色-透明度：</span>
                                <el-color-picker v-model="labelColor" show-alpha :predefine="labelPredefineColors" size="small" />
                            </el-col>
                            <el-col :span="12">
                                <span>比例：</span>
                                <el-input-number
                                    v-model="labelScale"
                                    :min="0"
                                    :max="10"
                                    :precision="2"
                                    :step="0.1"
                                    size="small"
                                    controls-position="right"
                                />
                            </el-col>
                        </el-row>
                        <p>点设置</p>
                        <el-row justify="center" align="middle">
                            <el-col :span="12">
                                <span>颜色-透明度：</span>
                                <el-color-picker v-model="pointColor" show-alpha :predefine="pointPredefineColors" size="small" />
                            </el-col>
                            <el-col :span="12">
                                <span>比例：</span>
                                <el-input-number
                                    v-model="pointScale"
                                    :min="0"
                                    :max="10"
                                    :precision="2"
                                    :step="0.1"
                                    size="small"
                                    controls-position="right"
                                />
                            </el-col>
                        </el-row>
                    </div>
                </el-tab-pane>
                <!-- <el-tab-pane label="视图">3</el-tab-pane> -->
                <el-tab-pane label="相对高度">
                    <div>
                        <el-row justify="center" align="middle">
                            <el-col :span="12">
                                <span>相对高度：</span>
                                <el-input-number
                                    v-model="pointHeight"
                                    :min="0"
                                    :max="2000"
                                    :precision="0"
                                    :step="10"
                                    size="small"
                                    controls-position="right"
                                />
                            </el-col>
                        </el-row>
                    </div>
                </el-tab-pane>
            </el-tabs>
        </div>
    </div>
  </template>

<script>

import { defineComponent, reactive, ref, watch } from 'vue'
import { useMouseLeftClick } from '@/utils/mouseLeft.js'
import { useBlankPoint } from '@/utils/usePoint.js'
import { car3Tran, CGCSToLonLat } from '@/utils/singlecoortran.js'
import { nanoid } from 'nanoid'
// import { watchOnce } from '@vueuse/core'
import * as Cesium from 'cesium'
// import { layoutStore } from '@/store/layoutStore.js'
// import { storeToRefs } from 'pinia'
// import { useRoute } from 'vue-router'

export default defineComponent({
  name: 'addPoint',
  setup () {
    const pointIdRandom = nanoid(12) // 设置随机id
    const pointId = 'add-point-' + pointIdRandom
    const entityBlankPoint = useBlankPoint(pointId)

    // 鼠标左键点击事件
    const { coordinate: coorClick } = useMouseLeftClick('addPoint', () => {
      window.viewer.entities.add(entityBlankPoint)
    })
    // 点的名称
    const labelText = ref('未命名点')
    // 坐标系类型
    const coorType = ref('CGCS')
    // 标签的比例、颜色-透明度设置
    const labelScale = ref(1)
    const labelColor = ref('rgba(255, 255, 255, 1)')
    const labelPredefineColors = ref([
      '#000000',
      '#FF0000',
      '#FFFFFF',
      '#FFFF00',
      '#87CEEB',
      '#008000',
      '#FF69B4',
      '#90ee90',
      '#00ced1',
      '#1e90ff'
    ])
    // 点的比例、颜色-透明度设置
    const pointScale = ref(0.5)
    const pointColor = ref('rgba(255, 255, 255, 1)')
    const pointPredefineColors = ref([
      '#000000',
      '#FF0000',
      '#FFFFFF',
      '#FFFF00',
      '#87CEEB',
      '#008000',
      '#FF69B4',
      '#90ee90',
      '#00ced1',
      '#1e90ff'
    ])
    // 点的高度
    const pointHeight = ref(0.00)
    // 需要修改的选项
    const objOption = reactive({ labelText, labelScale, labelColor, pointScale, pointColor, pointHeight })
    watch(objOption, () => {
      const entityById = window.viewer.entities.getById(pointId)
      entityById.label.text = objOption.labelText
      entityById.label.scale = objOption.labelScale
      entityById.label.fillColor = Cesium.Color.fromCssColorString(objOption.labelColor)
      entityById.billboard.scale = objOption.pointScale
      entityById.billboard.color = Cesium.Color.fromCssColorString(objOption.pointColor)
      if (objOption.pointHeight !== 0.0) {
        entityById.label.heightReference = Cesium.HeightReference.RELATIVE_TO_GROUND
        entityById.billboard.heightReference = Cesium.HeightReference.RELATIVE_TO_GROUND
        entityById.position = Cesium.Cartesian3.fromDegrees(LL.value.x, LL.value.y, LL.value.z + objOption.pointHeight)
      }
      if (objOption.pointHeight === 0.0) {
        entityById.label.heightReference = Cesium.HeightReference.CLAMP_TO_GROUND
        entityById.billboard.heightReference = Cesium.HeightReference.CLAMP_TO_GROUND
        entityById.position = coorClick.value
      }
    })
    // 显示在面板中的坐标
    const coorBidirectional = ref({ x: 0, y: 0 })
    const LL = ref({ x: 0, y: 0 })
    const CGCS = ref({ x: 0, y: 0 })
    const LC = ref({ x: 0, y: 0 })
    // 监听鼠标点击坐标，计算相应的坐标
    watch(coorClick, () => {
      const { lonLat, gsProj, localCoor, coorT } = coorToFour(coorClick, coorType.value)
      LL.value = lonLat.value
      CGCS.value = gsProj.value
      LC.value = localCoor.value
      coorBidirectional.value = coorT
    })
    // 点击切换函数
    const toggleFn = (label) => {
      const { coorT } = coorToFour(coorClick, label)
      coorBidirectional.value = coorT
    }
    // 判断是否进行了人工输入
    const isInput = ref(false)
    watch(() => coorBidirectional.value, () => {
      const coorBArray = Object.values(coorBidirectional.value)
      const changeCoor = ref({ x: 0, y: 0 })
      const entityById = window.viewer.entities.getById(pointId)
      if (coorType.value === 'LL') {
        const LLArray = Object.values(LL.value)
        isInput.value = coorBArray.toString() === LLArray.toString()
        changeCoor.value = Cesium.Cartesian3.fromDegrees(coorBidirectional.value.x, coorBidirectional.value.y, coorBidirectional.value.z)
      }
      if (coorType.value === 'CGCS') {
        const CGCSArray = Object.values(CGCS.value)
        isInput.value = coorBArray.toString() === CGCSArray.toString()
        const tempCoor = CGCSToLonLat(coorBidirectional.value)
        changeCoor.value = Cesium.Cartesian3.fromDegrees(tempCoor.x, tempCoor.y, tempCoor.z)
      }
      if (coorType.value === 'LC') {
        const LCArray = Object.values(LC.value)
        isInput.value = coorBArray.toString() === LCArray.toString()
        changeCoor.value = coorBidirectional.value
      }
      if (isInput.value) {
        entityById.position = coorClick.value
        entityById.label.text = objOption.labelText
      }
      if (!isInput.value) {
        coorClick.value = changeCoor.value
      }
    }, { deep: true })

    return {
      labelColor,
      labelPredefineColors,
      labelScale,
      pointScale,
      pointColor,
      pointPredefineColors,
      coorType,
      labelText,
      pointHeight,
      toggleFn,
      coorBidirectional,
      LL,
      CGCS,
      LC
    }
  }
})

const coorToFour = (coorClick, coorType) => {
  let coorT = {}
  const { lonLat, gsProj, localCoor } = car3Tran(coorClick)
  if (coorType === 'LL') {
    coorT = { x: lonLat.value.x, y: lonLat.value.y, z: lonLat.value.z }
  }
  if (coorType === 'CGCS') {
    coorT = { x: gsProj.value.x, y: gsProj.value.y, z: gsProj.value.z }
  }
  if (coorType === 'LC') {
    coorT = { x: localCoor.value.x, y: localCoor.value.y, z: localCoor.value.z }
  }
  return { lonLat, gsProj, localCoor, coorT }
}
</script>

<style scoped lang="scss">
.add-point{
    padding: 10px;
    width: 480px;
    // height: 490px;
    position: absolute;
    top: 5px;
    right: 5px;
    background-color:#fff;
    z-index: 999;
    // text-align: center;
    .point-name{
        text-align: center;
    }
    .point-coor{
        margin:20px 0;
        text-align: center;
        .el-row{
            margin-bottom: 10px;
        }
    }
    .point-option{
        .el-tabs{
            p{
                margin: 10px 0;
            }
            .el-tab-pane{
                height:200px;
            }
        .el-row{
            .el-col{
                display: flex;
                justify-content:center;
                align-items:center;
            }
        }
        }
    }
}
</style>
