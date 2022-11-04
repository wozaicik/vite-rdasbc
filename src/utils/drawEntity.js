// 绘制各种entity

import * as Cesium from 'cesium'
import { toRaw } from 'vue'

/**
 * 绘制point entity
 * @param {Cartesian3} coor - 点的坐标
 * @param {*} id - entity的id
 * @param {*} index label的文字显示内容
 * @returns entity
 */
export const drawPoint = (coor, id, index) => {
  let viewer = window.viewer
  const entityPoint = viewer.entities.add({
    id,
    position: toRaw(coor),
    point: {
      color: Cesium.Color.SKYBLUE,
      pixelSize: 5,
      outlineColor: Cesium.Color.YELLOW,
      outlineWidth: 2,
      heightReference: Cesium.HeightReference.CLAMP_TO_GROUND
    },
    label: {
      text: index.toString(),
      font: '16px sans-serif',
      style: Cesium.LabelStyle.FILL_AND_OUTLINE,
      outlineWidth: 2,
      heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
      verticalOrigin: Cesium.VerticalOrigin.BASELINE,
      pixelOffset: new Cesium.Cartesian2(0, -10),
      disableDepthTestDistance: 0 // draws the label in front of terrain
      // disableDepthTestDistance: Number.POSITIVE_INFINITY // draws the label in front of terrain
    }
  })
  viewer = null

  return { entityPoint }
}

/**
 *  绘制线entity
 * @param {Array} coordinates - 线段的坐标数组
 * @param {Cartesian3} tpMidPoint - label的坐标
 * @param {String} id - entity的id
 * @param {Number} distance - 线段的距离
 * @returns
 */
export const drawPolyline = (coordinates, tpMidPoint, id, distance) => {
  let viewer = window.viewer

  const entityPolyline = viewer.entities.add({
    id,
    position: Cesium.Cartesian3.fromDegrees(tpMidPoint.value[0], tpMidPoint.value[1]),
    polyline: {
      positions: toRaw(coordinates),
      width: 3,
      material: Cesium.Color.RED,
      clampToGround: true
    },
    label: {
      text: distance.toString(),
      font: '16px sans-serif',
      style: Cesium.LabelStyle.FILL_AND_OUTLINE,
      outlineWidth: 2,
      heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
      verticalOrigin: Cesium.VerticalOrigin.BASELINE,
      pixelOffset: new Cesium.Cartesian2(0, -10),
      disableDepthTestDistance: 0 // draws the label in front of terrain
    }
  })

  viewer = null
  return { entityPolyline }
}

/**
 *  移除entity
 * @param {Array} entityArray 存放entity数据的数组
 */
export const clearEntityArray = (entityArray) => {
  if (window.viewer) {
    let viewer = window.viewer
    entityArray.forEach(item => {
      if (item) {
        viewer.entities.remove(item)
      }
    })
    viewer = null
  }
}

/**
 *
 * @param {Cartesian3} tpMidPoint 点的坐标
 * @param {String} id entity的id
 * @param {Number} distance 距离
 * @returns
 */
export const drawLabel = (tpMidPoint, id, distance) => {
  let viewer = window.viewer

  const entityPolyline = viewer.entities.add({
    id,
    position: Cesium.Cartesian3.fromDegrees(tpMidPoint.value[0], tpMidPoint.value[1]),
    label: {
      text: distance.toString(),
      font: '16px sans-serif',
      style: Cesium.LabelStyle.FILL_AND_OUTLINE,
      outlineWidth: 2,
      heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
      verticalOrigin: Cesium.VerticalOrigin.BASELINE,
      pixelOffset: new Cesium.Cartesian2(0, -10),
      disableDepthTestDistance: 0 // draws the label in front of terrain
    }
  })

  viewer = null
  return { entityPolyline }
}

/**
 *  绘制线entity-不是用响应式 同时返回polyline本身
 * @param {Array} coordinates 坐标数组
 * @param {Cartesian3} tpMidPoint entity的position
 * @param {String} id entity的id
 * @param {Number} distance 距离
 * @returns
 */
export const drawPolylineNone = (coordinates, tpMidPoint, id, distance) => {
  let viewer = window.viewer

  const entityPolyline = viewer.entities.add({
    id,
    position: Cesium.Cartesian3.fromDegrees(tpMidPoint[0], tpMidPoint[1]),
    polyline: {
      positions: coordinates,
      width: 3,
      material: Cesium.Color.RED,
      clampToGround: true
    },
    label: {
      text: distance.toString(),
      font: '16px sans-serif',
      style: Cesium.LabelStyle.FILL_AND_OUTLINE,
      outlineWidth: 2,
      heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
      verticalOrigin: Cesium.VerticalOrigin.BASELINE,
      pixelOffset: new Cesium.Cartesian2(0, -10),
      disableDepthTestDistance: 0 // draws the label in front of terrain
    }
  })

  viewer = null
  const polyline = entityPolyline.polyline
  return { entityPolyline, polyline }
}
