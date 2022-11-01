// Two Point Distance
// 存放该功能组件的一些计算方法
// 计算经纬度 CGCS2000 地方坐标系 距离 方位角 坡度 坡向

import { toRaw } from 'vue'
import * as Cesium from 'cesium'
import {
  Cartesian3ToCartographicDegree,
  lonLatToCGCS,
  CGCSToLocal,
  calDisBear,
  calCenter,
  calSlope,
  calAspect
} from './singlecoortran'

export const calTwoPointDistance = (data) => {
  // console.log(data[0].v)

  //  第一个点
  const dataOne = toRaw(data[0])
  // 第二个点
  const dataTwo = toRaw(data[1])

  // 计算经纬度
  const lonlatOne = Cartesian3ToCartographicDegree(dataOne)
  const lonlatTwo = Cartesian3ToCartographicDegree(dataTwo)

  // 计算CGCS2000
  const CGCSOne = lonLatToCGCS(lonlatOne)
  const CGCSTwo = lonLatToCGCS(lonlatTwo)

  // 计算地方坐标系
  const localOne = CGCSToLocal(CGCSOne)
  const localTWo = CGCSToLocal(CGCSTwo)

  //  计算距离和方位角
  const { distance, bearing } = calDisBear(lonlatOne, lonlatTwo)

  // 计算两个点之间的中间点
  const midpoint = calCenter(lonlatOne, lonlatTwo)

  // 计算两个点之间的坡度
  const slope = calSlope(lonlatOne, lonlatTwo, distance)

  // 计算两个点之间的坡向
  const aspect = calAspect(lonlatOne, lonlatTwo, bearing)

  const doubleClickZoomToFn = (pointCoor) => {
    // 1. Fly to a position with a top-down view
    window.viewer.camera.flyTo({
      destination: Cesium.Cartesian3.fromDegrees(pointCoor[0], pointCoor[1], 50)
    })
  }

  // cartesian3坐标组成的数组
  const twoCoors = [dataOne, dataTwo]

  return {
    lonlatOne,
    lonlatTwo,
    CGCSOne,
    CGCSTwo,
    localOne,
    localTWo,
    distance,
    bearing,
    midpoint,
    slope,
    aspect,
    doubleClickZoomToFn,
    twoCoors
  }
}
