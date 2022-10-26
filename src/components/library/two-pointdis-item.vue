<template>
  <div>
    <el-card :body-style="{ padding: '5px' }" shadow="always">
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
              <el-col :span="6">广州城建-序号:{{index*2+1}}</el-col>
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
              <el-col :span="6">广州城建-序号:{{index*2+2}}</el-col>
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
              <el-col :span="6">距离</el-col>
              <el-col :span="6">{{tpDistance}}</el-col>
              <el-col :span="6">方位角</el-col>
              <el-col :span="6">{{tpBearing.toFixed(4)}}</el-col>
            </el-row>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-row v-if="tpSlope" class="coor-justify">
              <el-col :span="6">坡度</el-col>
              <el-col :span="6">{{tpSlope.toFixed(2)}}%</el-col>
              <el-col :span="6">坡向</el-col>
              <el-col :span="6">{{tpAspect}}</el-col>
            </el-row>
          </el-col>
        </el-row>
    </el-card>
  </div>
</template>

<script>
import { defineComponent } from 'vue'
import { useTwoPointDistance } from '@/utils/useRoad.js'

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
    const {
      oneLonLat,
      twoLonLat,
      oneCGCS,
      twoCGCS,
      oneLocal,
      twoLocal,
      tpDistance,
      tpBearing,
      tpMidPoint,
      tpSlope,
      tpAspect,
      entityPolyline,
      id
    } = useTwoPointDistance(props.data, props.index)

    return {
      oneLonLat,
      twoLonLat,
      oneCGCS,
      twoCGCS,
      oneLocal,
      twoLocal,
      tpDistance,
      tpBearing,
      tpMidPoint,
      tpSlope,
      tpAspect,
      entityPolyline,
      id
    }
  }
})

</script>

<style lang="scss" scoped>
.el-card{
  width: 100%;
  padding: 0px;
  font-size: 12px;
  .el-row{
    // height: 16px;
  }
}
.coor-justify{
  .el-col{
    // line-height: 16px;
    text-align: center;
    margin: 2px 0;
  }
}
</style>
