<template>
    <div class="cla-area" style="overflow-y:auto">
        <div>
          <el-row>
              <el-col class="card-header" :span="24">
                <span >计算面积</span>
                <el-button class="button" type="primary" icon="Delete" @click="clearAllFn()">清除所有</el-button>
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
                        <div><span>面积：</span><span>{{area}}</span></div>
                    </el-col>
                    <el-col :span="24">
                        <div><span>周长：</span><span>{{length}}</span></div>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24" class="option">
                        <el-button  size="small" @click="saveFn()">保存</el-button>
                        <el-button  size="small" @click="clearFn()">清除</el-button>
                    </el-col>
                </el-row>
            </el-card>
        </el-card>
    </div>
  </template>

<script>
import { defineComponent, reactive, ref, toRaw, watch } from 'vue'
import { useClickEvent } from '@/utils/mouseLeftRight.js'
import { drawPoint } from '@/utils/drawEntity.js'
import { nanoid } from 'nanoid'
import { car3Tran } from '@/utils/singlecoortran.js'
import { usePolygon, useDrawPolygon } from '@/utils/usePolygon.js'
import * as Cesium from 'cesium'
import { ElMessage } from 'element-plus'

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
    // 使用组合式函数 计算面积 周长 中心点坐标
    const { area, length, centroid } = usePolygon(lonLatArray)

    watch(Coordinate, (newCoor) => {
      if (newCoor instanceof Cesium.Cartesian3) {
        const idRandom = nanoid(12) // 设置随机id
        const pointId = 'Area-point-' + index.value + idRandom // 设置id
        const { entityPoint } = drawPoint(newCoor, pointId, index.value) // 绘制点
        entityPointIds.push(pointId) // 保存id
        entityPointArray.push(entityPoint) // 保存entity

        // 面相关的函数
        CoordinateArray.push(Coordinate.value)
        // 计算经纬度
        const { lonLat } = car3Tran(Coordinate)
        if (lonLatArray.length === 0) {
          // 当长度为0时，说明是一个新的图形
          // turfjs在表示多边形时，采用第一个点和最后一个点的坐标相同的形式
          lonLatArray.push([lonLat.value.x, lonLat.value.y])
          lonLatArray.push([lonLat.value.x, lonLat.value.y])
        } else if (lonLatArray.length >= 2) {
          // 每次在倒数第二的位置插入坐标
          lonLatArray.splice(-1, 0, [lonLat.value.x, lonLat.value.y])
        }
        index.value++
      }
    })
    watch(isRightClick, (newBool) => {
      if (newBool && entityPointArray.length >= 1) {
        // 移除点entity
        entityPointIds.pop()
        const lastEntityPoint = entityPointArray.pop() // 弹出最后一个点
        window.viewer.entities.remove(lastEntityPoint) // 移除最后一个点
        index.value-- // 序号减一
        isRightClick.value = false // 右键点击改为false
        if (index.value <= 0) {
          index.value = 1
        }

        // 移除面相关的逻辑
        CoordinateArray.pop() // 弹出cartesian3 坐标
        lonLatArray.splice(-2, 1) // 移除经纬坐标
        // 因为经纬度数组中第一个点和最后一个点是相同的，所以当移除一个时，另一个也要移除
        if (lonLatArray.length === 1) {
          lonLatArray.splice(0, lonLatArray.length)
        }
        if (CoordinateArray.length < 3) {
          const entityById = window.viewer.entities.getById(polygonId)
          entityById.label.text = null
          entityById.polygon.hierarchy = []
          window.viewer.entities.remove(entityById)
        }
      }
    })
    // ----------添加多边形------------------------
    let polygonIdRandom = nanoid(12) // 设置随机id
    let polygonId = 'Area-polygon-' + polygonIdRandom
    // 声明一个空的entity，没有坐标。
    // 但是有Polygon label id
    let entityPolygon = useDrawPolygon(polygonId)
    // 监听坐标数组的变化，当改变时，我们把entity添加viewer.entities中
    watch(CoordinateArray, (newVal) => {
      const entityById = window.viewer.entities.getById(polygonId)
      if (!entityById) {
        window.viewer.entities.add(entityPolygon)
      }
      if (CoordinateArray.length >= 3) {
        const coors = [...toRaw(CoordinateArray)]
        entityById.position = Cesium.Cartesian3.fromDegrees(centroid.value[0], centroid.value[1])
        entityById.polygon.hierarchy = coors
        entityById.label.text = area.value
      }
    })
    // ---------------保存-----------
    const allIdEntityArray = []// 存储id
    const allEntityArray = []// 存储etity
    // const saveEntity = []
    // 保存数据
    const saveFn = () => {
      // 保存
      if (entityPointArray.length >= 3) {
        // 保存信息
        allEntityArray.push(...entityPointArray)
        allEntityArray.push(entityPolygon)
        allIdEntityArray.push(...entityPointIds)
        allIdEntityArray.push(polygonId)
        // 重置
        index.value = 1
        entityPointArray.splice(0, entityPointArray.length)
        entityPointIds.splice(0, entityPointIds.length)
        // 重置
        CoordinateArray.splice(0, CoordinateArray.length)
        lonLatArray.splice(0, lonLatArray.length)

        polygonIdRandom = nanoid(12)
        polygonId = 'Area-polygon-' + polygonIdRandom
        entityPolygon = useDrawPolygon(polygonId)
        ElMessage({
          message: '保存成功',
          type: 'success'
        })
      } else {
        ElMessage({
          message: '请先添加数据',
          type: 'warning'
        })
      }
    }
    // ------------------清除数据--------------------
    const clearFn = () => {
      if (entityPointArray.length >= 1) {
        entityPolygon.label.text = null
        entityPolygon.polygon.hierarchy = []
        window.viewer.entities.remove(entityPolygon)
        entityPointArray.forEach(item => {
          window.viewer.entities.remove(item)
        })

        // 重置
        index.value = 1
        entityPointArray.splice(0, entityPointArray.length)
        entityPointIds.splice(0, entityPointIds.length)
        // 重置
        CoordinateArray.splice(0, CoordinateArray.length)
        lonLatArray.splice(0, lonLatArray.length)

        ElMessage({
          message: '清除成功',
          type: 'success'
        })
      } else {
        ElMessage({
          message: '请先添加数据',
          type: 'warning'
        })
      }
    }
    // ------------清除所有----------------------
    const clearAllFn = () => {
      if (allEntityArray.length >= 1) {
        // allEntityArray.forEach(item => {
        //   // console.log(item)
        //   // const entityById = window.viewer.entities.getById(polygonId)
        //   window.viewer.entities.remove(item)
        // })
        allIdEntityArray.forEach(item => {
          const itemEntiy = window.viewer.entities.getById(item)
          window.viewer.entities.remove(itemEntiy)
        })
        allIdEntityArray.splice(0, allIdEntityArray.length)
        allEntityArray.splice(0, allEntityArray.length)
        clearFn()
        ElMessage({
          message: '清除成功',
          type: 'success'
        })
      } else {
        ElMessage({
          message: '请先添加数据',
          type: 'warning'
        })
      }
    }

    return { Coordinate, isRightClick, area, length, centroid, entityPolygon, saveFn, clearFn, clearAllFn }
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
