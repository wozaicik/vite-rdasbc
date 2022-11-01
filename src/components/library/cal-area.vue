<template>
    <div class="cla-area" style="overflow-y:auto">
        <div>
          <el-row>
              <el-col class="card-header" :span="24">
                <span >计算面积</span>
                <el-button class="button" type="primary" icon="Delete">清除所有</el-button>
              </el-col>
          </el-row>
        </div>
        <el-card :body-style="{ padding: '15px' }" shadow="always">
            <el-card :body-style="{ padding: '5px' }" shadow="always" class="panel">
                <el-row>
                    <el-col :span="24">
                        <span>面积</span>
                    </el-col>
                </el-row>
                <el-row class="area">
                    <el-col :span="24">
                        <div><span>面积：</span><span>100</span></div>
                    </el-col>
                    <el-col :span="24">
                        <div><span>周长：</span><span>100</span></div>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24" class="option">
                        <el-button  size="small" >保存</el-button>
                        <el-button  size="small">清除</el-button>
                    </el-col>
                </el-row>
            </el-card>
        </el-card>
    </div>
  </template>

<script>
import { defineComponent, reactive, ref, watch } from 'vue'
import { useClickEvent } from '@/utils/mouseLeftRight.js'
import { drawPoint } from '@/utils/drawEntity.js'
import { nanoid } from 'nanoid'
import { car3Tran } from '@utils/singlecoortran.js'
import * as Cesium from 'cesium'

export default defineComponent({
  name: 'calarea',
  setup () {
    // 鼠标点击事件
    const { Coordinate, isRightClick } = useClickEvent('calarea')

    // 存放entityPoint的数组
    const entityPointArray = []
    const entityPointIds = []
    // 点的序号
    const index = ref(1)
    // 存放坐标的数组 类型是Cartesian3
    const CoordinateArray = reactive([])
    // 存放经纬度的数组
    const lonLatArray = reactive([])
    watch(Coordinate, (newCoor) => {
      if (newCoor instanceof Cesium.Cartesian3) {
        const idRandom = nanoid(12) // 设置随机id
        const pointId = 'Area-point-' + index.value + idRandom // 设置id
        const { entityPoint } = drawPoint(newCoor, pointId, index.value) // 绘制点
        entityPointIds.push(pointId) // 保存id
        entityPointArray.push(entityPoint) // 保存entity
        index.value++

        // 面相关的函数
        CoordinateArray.push(newCoor)
        const { lonLat } = car3Tran(newCoor)
        lonLatArray.push(lonLat)
      }
    })
    watch(isRightClick, (newBool) => {
      if (newBool && entityPointArray) {
        // 移除点entity
        entityPointIds.pop()
        const lastEntityPoint = entityPointArray.pop()
        window.viewer.entities.remove(lastEntityPoint)
        index.value--
        isRightClick.value = false
        if (index.value <= 0) {
          index.value = 1
        }
      }
    })
    return { Coordinate, isRightClick }
  }
})

</script>

<style lang="scss" scoped>
.cla-area{
    width: 480px;
    // min-height: 180px;
    max-height: 550px;
    position: absolute;
    top: 5px;
    right: 5px;
    background-color:#fff;
    z-index: 999;
    .card-header{
        display: flex;
        justify-content:space-around;
        align-items: center;
    }
    .panel{
        height: 95px;
        margin: 0px 5px 5px 0px;
        padding: 0px;
        border: 0;
        font-size: 14px;
        .area{
            .el-col{
                display: flex;
                justify-content: center;
                align-items: center;
                margin: 3px;
            }
        }
        .option{
            display: flex;
            justify-content: start;
            align-items: center;
        }
    }
}
</style>
