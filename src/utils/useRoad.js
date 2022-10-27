// 关于组合式函数的api

import { onMounted, ref } from 'vue'
import { calTwoPointDistance } from '@/utils/caltwopoidis.js'
import { drawPolyline } from '@/utils/drawEntity.js'

/**
 *
 * @param {Array} data - 存储有两个点的坐标
 * @param {*} index - 序号，用来生成id
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
