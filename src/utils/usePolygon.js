// 计算关于多边形的面积 周长 中心点

import * as turf from '@turf/turf'
import { ref, watch } from 'vue'
import * as Cesium from 'cesium'

export function usePolygon (coordinatesArray) {
  // 使用一个变量接收数据，同时也是一个响应式
  const coordinates = coordinatesArray
  const area = ref(0) // 面积
  const length = ref(0) // 周长
  const centroid = ref(null) // 中心坐标
  // 监听坐标数组的长度
  // 只有长度大于等于四时，才计算它的面积等
  // 否则返回0
  watch(coordinates, () => {
    if (coordinates.length >= 4) {
      const polygon = turf.polygon([coordinates])
      const line = turf.lineString(coordinates)
      // 多边形面积
      area.value = (turf.area(polygon)).toFixed(2)
      // 多边形长度 *1000 单位转为米
      length.value = (turf.length(line) * 1000).toFixed(2)
      // 多边形中心点
      centroid.value = turf.getCoord(turf.centroid(polygon))
    } else {
      area.value = 0
      length.value = 0
      centroid.value = null
    }
  })

  return { area, length, centroid }
}

export function useDrawPolygon (id) {
  const entityPolygon = new Cesium.Entity({
    id,
    position: null,
    polygon: {
    //   extrudedHeight: 0,
    //   height: 0,
      material: Cesium.Color.RED.withAlpha(0.4),
      outline: true,
      outlineColor: Cesium.Color.BLACK
    },
    label: {
      font: '16px sans-serif',
      style: Cesium.LabelStyle.FILL_AND_OUTLINE,
      outlineWidth: 2,
      heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
      verticalOrigin: Cesium.VerticalOrigin.BASELINE,
      pixelOffset: new Cesium.Cartesian2(0, -10),
      disableDepthTestDistance: Number.POSITIVE_INFINITY // draws the label in front of terrain
    }
  })

  return entityPolygon
}
