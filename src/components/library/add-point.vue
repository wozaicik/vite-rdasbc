<template>
    <div class="add-point" >
        <div class="point-name">
            <el-row justify="center" align="middle">
                <el-col :span="4">
                    <span>名称：</span>
                </el-col>
                <el-col :span="20">
                    <el-input v-model="pointName"  placeholder="请输入名称"  />
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
                                    :max="200"
                                    :precision="2"
                                    :step="0.1"
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

import { computed, defineComponent, ref, watch } from 'vue'
import { useMouseLeftClick } from '@/utils/mouseLeft.js'
import { car3Tran } from '@/utils/singlecoortran.js'

export default defineComponent({
  name: 'addPoint',
  setup () {
    // 鼠标左键点击事件
    const { coordinate: coorClick } = useMouseLeftClick('addPoint')
    // 点的名称
    const pointName = ref('未命名点')
    // 坐标系类型
    const coorType = ref('CGCS')
    // 标签的比例、颜色-透明度设置
    const labelScale = ref(1)
    const labelColor = ref('rgba(0, 0, 0, 1)')
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
    const pointScale = ref(1)
    const pointColor = ref('rgba(255, 0, 0, 1)')
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
    // 显示在面板中的坐标
    const coorBidirectional = ref({ x: 0, y: 0 })
    const LL = ref({ x: 0, y: 0 })
    const CGCS = ref({ x: 0, y: 0 })
    const LC = ref({ x: 0, y: 0 })
    watch(coorClick, () => {
      const { lonLat, gsProj, localCoor } = car3Tran(coorClick)
      LL.value = lonLat.value
      CGCS.value = gsProj.value
      LC.value = localCoor.value
      if (coorType.value === 'LL' && LL.value) {
        coorBidirectional.value = LL.value
      }
      if (coorType.value === 'CGCS' && CGCS.value) {
        coorBidirectional.value = CGCS.value
      }
      if (coorType.value === 'LC' && LC.value) {
        coorBidirectional.value = LC.value
      }
    })
    const coorInput = computed(() => {
      return { x: coorBidirectional.value.x, y: coorBidirectional.value.y, z: coorBidirectional.value.z }
    })
    watch(coorInput, (newCoor) => {
      console.log(newCoor, 1)
      console.log(coorBidirectional.value, 2)
    })
    // watch(() => [coorBidirectional.value.x, coorBidirectional.value.y], ([newX, newY]) => {
    //   console.log(coorBidirectional.value, 2)
    // })
    const toggleFn = (label) => {
      if (coorType.value === 'LL' && LL.value) {
        coorBidirectional.value = LL.value
      }
      if (coorType.value === 'CGCS' && CGCS.value) {
        coorBidirectional.value = CGCS.value
      }
      if (coorType.value === 'LC' && LC.value) {
        coorBidirectional.value = LC.value
      }
    }
    return {
      labelColor,
      labelPredefineColors,
      labelScale,
      pointScale,
      pointColor,
      pointPredefineColors,
      coorType,
      pointName,
      pointHeight,
      toggleFn,
      coorBidirectional,
      LL,
      CGCS,
      LC
    }
  }
})
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
