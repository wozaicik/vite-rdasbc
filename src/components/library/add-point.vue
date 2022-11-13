<template>
    <div class="add-point" >
        <div class="point-name">
            <el-row justify="center" align="middle">
                <el-col :span="4">
                    <span>名称：</span>
                </el-col>
                <el-col :span="16">
                    <el-input v-model="labelText"  placeholder="请输入名称"  />
                </el-col>
                <el-col :span="4">
                    <el-button size="small"  @click="dialogVisible = true">点样式</el-button>
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
                <el-tab-pane label="说明">
                    <el-row >
                      <el-col :span="12">
                        <el-button size="small" @click="open">选择图片</el-button>
                      </el-col>
                      <el-col :span="12">
                        <span>描述文字</span>
                      </el-col>
                    </el-row>
                    <el-row >
                      <el-col :span="12">
                        <img v-if="objectURL" style="width: 200px; height: 180px;padding: 8px;" :src="objectURL" :fit="cover" />
                        <el-image v-else style="width: 200px; height: 180px;padding: 8px;"  />
                      </el-col>
                      <el-col :span="12">
                        <el-input
                          v-model="textarea"
                          :rows="7"
                          type="textarea"
                          placeholder="Please input"
                          style="padding:5px"
                        />
                      </el-col>
                    </el-row>
                </el-tab-pane>
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
        <el-row justify="end" align="middle">
            <el-col :span="8">
                <el-button size="small" @click="saveEntityFn">保存</el-button>
                <el-button size="small" @click="clearEntityFn">清除所有</el-button>
            </el-col>
        </el-row>
    </div>
    <el-dialog
        v-model="dialogVisible"
        title="点样式"
        width="39%"
    >
        <div class="point-image">
            <el-image
            style="width: 35px; height: 35px;margin: 2px 2px;padding: 2px 2px;"
            v-for="item in pngIconFile"
            :key="item"
            :src="item"
            @click="iconSrc=item"
            />
        </div>
        <el-image style="width: 60px; height: 60px;"  :src="iconSrc" />
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="dialogVisible = false">取消</el-button>
                <el-button type="primary" @click="dialogVisible = false">确定</el-button>
            </span>
        </template>
    </el-dialog>
  </template>

<script>

import { defineComponent, reactive, ref, watch } from 'vue'
import { useMouseLeftClick } from '@/utils/mouseLeft.js'
import { useBlankPoint } from '@/utils/usePoint.js'
import { car3Tran, CGCSToLonLat } from '@/utils/singlecoortran.js'
import { nanoid } from 'nanoid'
// import { watchOnce } from '@vueuse/core'
import * as Cesium from 'cesium'
import { ElMessage } from 'element-plus'
// import { layoutStore } from '@/store/layoutStore.js'
// import { storeToRefs } from 'pinia'
// import { useRoute } from 'vue-router'
import { useFileDialog } from '@vueuse/core'

export default defineComponent({
  name: 'addPoint',
  setup () {
    // 说明 选择图片
    const { files, open } = useFileDialog()
    const objectURL = ref(null)
    watch(files, () => {
      objectURL.value = URL.createObjectURL(files.value[0])
      console.log(objectURL.value)
    })
    // 描述文字
    const textarea = ref(null)
    // 初始化时 先设置好一个entity的参数
    let pointIdRandom = nanoid(12) // 设置随机id
    let pointId = 'add-point-' + pointIdRandom
    let entityBlankPoint = useBlankPoint(pointId)

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
    // 选择点样式
    const dialogVisible = ref(false)
    const pngIconFile = []
    const importFn = import.meta.glob('/src/assets/icon/*.png')
    for (const path in importFn) {
      importFn[path]().then(mod => {
        pngIconFile.push(mod.default)
      })
    }
    const iconSrc = ref('/src/assets/icon/ylw-pushpin.png')
    // 需要修改的选项
    const objOption = reactive({ labelText, labelScale, labelColor, pointScale, pointColor, pointHeight, iconSrc })
    watch(objOption, () => {
      const entityById = window.viewer.entities.getById(pointId)
      entityById.label.text = objOption.labelText
      entityById.label.scale = objOption.labelScale
      entityById.label.fillColor = Cesium.Color.fromCssColorString(objOption.labelColor)
      entityById.billboard.image = objOption.iconSrc
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

    // 保存功能
    const allEntity = []
    const allEntityId = []
    const saveEntityFn = () => {
      if (!coorClick.value) {
        ElMessage({
          message: '清先添加数据!',
          type: 'warning'
        })
      }
      // 初始化
      if (coorClick.value) {
        allEntity.push(entityBlankPoint)
        allEntityId.push(pointId)
        pointIdRandom = nanoid(12) // 设置随机id
        pointId = 'add-point-' + pointIdRandom
        entityBlankPoint = useBlankPoint(pointId)
        window.viewer.entities.add(entityBlankPoint)
        // 初始化坐标
        coorClick.value = null
        // 初始化名称
        labelText.value = '未命名点'
        // 初始化坐标系类型
        coorType.value = 'CGCS'
        // 初始化标签的比例颜色
        labelScale.value = 1
        labelColor.value = 'rgba(255, 255, 255, 1)'
        // 初始化点的比例颜色
        pointScale.value = 0.5
        pointColor.value = 'rgba(255, 255, 255, 1)'
        // 初始化点的高度
        pointHeight.value = 0
        // 初始化样式
        iconSrc.value = '/src/assets/icon/ylw-pushpin.png'
        ElMessage({
          message: '保存成功',
          type: 'success'
        })
      }
      coorClick.value = null
    }
    // 清除功能
    const clearEntityFn = () => {
      if (allEntity.length === 0) {
        ElMessage({
          message: '清先添加数据!',
          type: 'warning'
        })
      }
      if (allEntity.length !== 0) {
        allEntity.forEach(item => {
          window.viewer.entities.remove(item)
        })
        allEntity.splice(0, allEntity.length)
        allEntityId.splice(0, allEntity.length)
        coorClick.value = null
        ElMessage({
          message: '清除数据成功!',
          type: 'success'
        })
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
      labelText,
      pointHeight,
      toggleFn,
      coorBidirectional,
      LL,
      CGCS,
      LC,
      saveEntityFn,
      clearEntityFn,
      dialogVisible,
      pngIconFile,
      iconSrc,
      files,
      open,
      objectURL,
      textarea
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
        margin: 10px 0;
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
.el-dialog{
    .point-image{
        .el-image{
            &:hover {
                background-color: rgba(128,128,128, 0.3);
            }
        }
    }
    .dialog-footer button:first-child {
        margin-right: 10px;
    }
}

</style>
