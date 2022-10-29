<template>
  <div>
    <el-card :body-style="{ padding: '5px' }" shadow="always" >
        <el-row>
          <el-col :span="24" >
            <el-row v-if="oneCGCS" class="coor-justify">
              <el-col :span="6">国家2000-序号:{{index*2+1}}</el-col>
              <el-col :span="3">X-Y-Z</el-col>
              <el-col :span="5">{{(oneCGCS.x).toFixed(2)}}</el-col>
              <el-col :span="5">{{(oneCGCS.y).toFixed(2)}}</el-col>
              <el-col :span="5">{{(oneCGCS.z).toFixed(2)}}</el-col>
            </el-row>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-row v-if="twoCGCS" class="coor-justify">
              <el-col :span="6">国家2000-序号:{{index*2+2}}</el-col>
              <el-col :span="3">X-Y-Z</el-col>
              <el-col :span="5">{{(twoCGCS.x).toFixed(2)}}</el-col>
              <el-col :span="5">{{(twoCGCS.y).toFixed(2)}}</el-col>
              <el-col :span="5">{{(twoCGCS.z).toFixed(2)}}</el-col>
            </el-row>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-row v-if="oneLocal" class="coor-justify">
              <el-col :span="6">地方坐标-序号:{{index*2+1}}</el-col>
              <el-col :span="3">X-Y-Z</el-col>
              <el-col :span="5">{{(oneLocal.x).toFixed(2)}}</el-col>
              <el-col :span="5">{{(oneLocal.y).toFixed(2)}}</el-col>
              <el-col :span="5">{{(oneLocal.z).toFixed(2)}}</el-col>
            </el-row>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-row v-if="twoLocal" class="coor-justify">
              <el-col :span="6">地方坐标-序号:{{index*2+2}}</el-col>
              <el-col :span="3">X-Y-Z</el-col>
              <el-col :span="5">{{(twoLocal.x).toFixed(2)}}</el-col>
              <el-col :span="5">{{(twoLocal.y).toFixed(2)}}</el-col>
              <el-col :span="5">{{(twoLocal.z).toFixed(2)}}</el-col>
            </el-row>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-row v-if="tpDistance" class="coor-justify">
              <el-col :span="2">距离</el-col>
              <el-col :span="4">{{tpDistance}}</el-col>
              <el-col :span="2">方位角</el-col>
              <el-col :span="4">{{tpBearing.toFixed(4)}}</el-col>
              <el-col :span="2">坡度</el-col>
              <el-col :span="4">{{tpSlope.toFixed(2)}}%</el-col>
              <el-col :span="2">坡向</el-col>
              <el-col :span="4">{{tpAspect}}</el-col>
            </el-row>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-row v-if="tpMidPoint" class="coor-justify">
              <el-col :span="6"><el-button plain size="small" @click="dblClickFn()">定位</el-button></el-col>
              <el-col :span="6"></el-col>
              <el-col :span="6"></el-col>
              <el-col :span="6"></el-col>
            </el-row>
          </el-col>
        </el-row>
    </el-card>
  </div>
</template>

<script>
import { defineComponent, onBeforeUnmount } from 'vue'
import { useTwoPointDistance } from '@/utils/useRoad.js'
import * as Cesium from 'cesium'

export default defineComponent({
  name: 'TwoPointDistanceItem',
  props: {
    data: {
      type: Array,
      default: () => ([])
    },
    index: {
      type: Number
    }
  },
  setup (props) {
    // 计算各种数据
    const {
      oneCGCS,
      twoCGCS,
      oneLocal,
      twoLocal,
      tpDistance,
      tpBearing,
      tpSlope,
      tpMidPoint,
      tpAspect,
      entityPolyline,
      id
    } = useTwoPointDistance(props.data, props.index)

    // 当组件卸载时，销毁entity
    onBeforeUnmount(() => {
      if (window.viewer) {
        const entity = window.viewer.entities.getById('TPD-polyline-' + props.index)
        window.viewer.entities.remove(entity)
      }
    })

    const dblClickFn = () => {
      if (window.viewer) {
        // 1. Fly to a position with a top-down view
        // window.viewer.camera.flyTo({
        //   destination: Cesium.Cartesian3.fromDegrees(tpMidPoint.value[0], tpMidPoint.value[1], 10000.0)
        // })
        const heading = Cesium.Math.toRadians(0.0)
        const pitch = Cesium.Math.toRadians(-90.0)
        const entity = window.viewer.entities.getById('TPD-polyline-' + props.index)
        window.viewer.zoomTo(entity, new Cesium.HeadingPitchRange(heading, pitch, 100))
      }
    }

    return {
      oneCGCS,
      twoCGCS,
      oneLocal,
      twoLocal,
      tpDistance,
      tpBearing,
      tpSlope,
      tpMidPoint,
      tpAspect,
      entityPolyline,
      id,
      dblClickFn
    }
  }
})

</script>

<style lang="scss" scoped>
.el-card{
  width: 100%;
  padding: 0px;
  font-size: 12px;
}
.coor-justify{
  .el-col{
    // line-height: 16px;
    text-align: center;
    margin: 2px 0;
  }
}
</style>
