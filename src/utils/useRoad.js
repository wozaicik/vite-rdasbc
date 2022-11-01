// 关于组合式函数的api

import { onMounted, ref } from 'vue'
import { calTwoPointDistance } from '@/utils/caltwopoidis.js'
import { drawPolyline } from '@/utils/drawEntity.js'
import * as Cesium from 'cesium'
import * as echarts from 'echarts'
// import { layoutStore } from '@/store/layoutStore.js'
// import { storeToRefs } from 'pinia'
// import { useRoute } from 'vue-router'
// import { ElMessage } from 'element-plus'
// import { layoutStore } from '@/store/layoutStore.js'

/**
 *
 * @param {Array} data - 存储有两个点的坐标
 * @param {Number} index - 序号，用来生成id
 * @returns
 */
export const useTwoPointDistance = (data, index) => {
  const id = 'TPD-polyline-' + index
  const oneLonLat = ref(null)
  const twoLonLat = ref(null)
  const oneCGCS = ref(null)
  const twoCGCS = ref(null)
  const oneLocal = ref(null)
  const twoLocal = ref(null)
  const tpDistance = ref(null)
  const tpBearing = ref(null)
  const tpMidPoint = ref(null)
  const tpSlope = ref(null)
  const tpAspect = ref(null)
  const entityPolyline = ref(null)
  onMounted(() => {
    const { lonlatOne, lonlatTwo, CGCSOne, CGCSTwo, localOne, localTWo, distance, bearing, midpoint, slope, aspect } = calTwoPointDistance(data)
    oneLonLat.value = lonlatOne
    twoLonLat.value = lonlatTwo
    oneCGCS.value = CGCSOne
    twoCGCS.value = CGCSTwo
    oneLocal.value = localOne
    twoLocal.value = localTWo
    tpDistance.value = distance
    tpBearing.value = bearing
    tpMidPoint.value = midpoint
    tpSlope.value = slope
    tpAspect.value = aspect
    entityPolyline.value = drawPolyline(data, tpMidPoint, id, tpDistance.value)
  })
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

/**
 *  计算断面图的数据
 * @param {Object} startLonLat  - 第一个点的经纬度
 * @param {Object} endLonLat  - 第二个点的经纬度
 * @param {Number} startDistance  - 开始的距离
 * @param {Number} twoPointDistance - 两个点之间的距离  开始距离+两个点距离=结束距离
 * @returns
 */
export const useSection = async (startLonLat, endLonLat, startDistance, twoPointDistance) => {
  // 断面数据
  const sectionData = []

  // 开始经纬度
  const startLon = Cesium.Math.toRadians(startLonLat.x)
  const startLat = Cesium.Math.toRadians(startLonLat.y)

  // 结束经纬度
  const endLon = Cesium.Math.toRadians(endLonLat.x)
  const endLat = Cesium.Math.toRadians(endLonLat.y)

  // 开始距离和结束距离
  const startDis = startDistance * 1
  const endDis = startDis + twoPointDistance * 1

  // 内插的长度
  const length = 50
  // 内插的坐标
  const terrainSamplePositions = []
  // 内插的距离
  const lerpDistance = []
  // 插值计算经纬度  等于48，一共有49个点，最后一个点不要
  for (let i = 0; i <= length - 2; ++i) {
    // 内插经度
    const lon = Cesium.Math.lerp(
      startLon,
      endLon,
      i / (length - 2)
    )
    // 内插纬度
    const lat = Cesium.Math.lerp(
      startLat,
      endLat,
      i / (length - 1)
    )
    // 内插距离
    const distance = Cesium.Math.lerp(
      startDis,
      endDis,
      i / (length - 1)
    )
    const position = new Cesium.Cartographic(lon, lat)
    terrainSamplePositions.push(position)
    lerpDistance.push(distance.toFixed(0))
  }

  await Promise.resolve(
    Cesium.sampleTerrainMostDetailed(
      window.viewer.terrainProvider,
      terrainSamplePositions
    )
  ).then((samples) => {
    for (let i = 0; i < samples.length; i++) {
      const tempArray = [lerpDistance[i], (samples[i].height).toFixed(2)]
      sectionData.push(tempArray)
    }
  })

  return sectionData
}

/**
 * 绘制断面图
 * @param {Array} data - 需要展示的断面数据
 */
export const useDrawSection = (data) => {
  // // 拿到状态库
  // const layout = layoutStore()
  // // 显示底部
  // layout.isFooterOpen = true
  // const data = reactive([])

  const chartDom = document.getElementById('Footer')
  const myChart = echarts.init(chartDom, null, {
    width: 1856,
    height: 300
  })
  myChart.resize()

  const option = {
    title: {
      left: 'center',
      top: 12,
      text: '断面图'
    },
    toolbox: {
      feature: {
        saveAsImage: {},
        dataView: {}
      }
    },
    xAxis: {
      // type: 'value',
      type: 'category',
      name: '里程',
      nameLocation: 'middle',
      nameGap: 40,
      axisTick: {
        show: true,
        alignWithLabel: true
      }
    },
    yAxis: {
      type: 'value',
      name: '高程',
      nameLocation: 'middle',
      nameGap: 45,
      nameRotate: 0,
      scale: true,
      axisLine: {
        show: true
      }
    },
    tooltip: {
      // position: ['83%', '15%'],
      trigger: 'axis',
      axisPointer: { // 十字准星
        type: 'cross'
      }
    },
    series: [
      {
        name: '高程',
        symbol: 'none',
        lineStyle: {
          color: '#0d233a',
          width: 2
        },
        data,
        type: 'line',
        smooth: true,
        areaStyle: {
          color: '#8bbc21'
        }
      }
    ]
  }

  option && myChart.setOption(option)
}
