// 单个cartesian3坐标转换为经纬度、CGCS2000、地方坐标系
import { Cartographic, Math as cesiumMath } from 'cesium'
import proj4 from 'proj4'
import { ref } from 'vue'
// import * as turf from '@turf/turf'

export const car3Tran = (Cartesian3) => {
  if (!Cartesian3.value) {
    const lonLat = ref(null)
    lonLat.value = { x: 0, y: 0, z: 0 }
    const gsProj = ref(null)
    gsProj.value = { x: 0, y: 0, z: 0 }
    const localCoor = ref(null)
    localCoor.value = { x: 0, y: 0, z: 0 }
    return {
      lonLat, gsProj, localCoor
    }
  }
  //  将Cartesian3坐标转换为经纬度
  const lonLat = ref(null)
  lonLat.value = Cartesian3ToCartographicDegree(Cartesian3.value)

  // 将经纬度转换为国家2000坐标
  const gsProj = ref(null)
  gsProj.value = lonLatToCGCS(lonLat.value)

  // 将国家2000坐标转换为地方坐标系
  const localCoor = ref(null)
  localCoor.value = CGCSToLocal(gsProj.value)

  return { lonLat, gsProj, localCoor }
}

/**
 * 将笛卡尔空间直角坐标系转换为角度制-经纬度
 * @param {Cesium.Cartesian3} Cartesian3 笛卡尔空间直角坐标系
 * @returns 角度制-经纬度
 */
const Cartesian3ToCartographicDegree = (Cartesian3) => {
  //  将Cartesian3坐标转换为经纬度——弧度制
  // console.log(Cartesian3)
  const lonLatRadian = Cartographic.fromCartesian(Cartesian3)

  //  将弧度-经度 To 角度-经度
  const longitude = cesiumMath.toDegrees(lonLatRadian.longitude)
  //  将弧度-纬度 To 角度-纬度
  const latitude = cesiumMath.toDegrees(lonLatRadian.latitude)

  //  经纬度的数据格式
  const lonLat = {
    x: longitude,
    y: latitude,
    z: lonLatRadian.height
  }
  return lonLat
}

/**
 * @param {lonLat} lonLat 经纬度
 * @returns 国家2000坐标系下的坐标（X,Y）
 */
const lonLatToCGCS = (lonLat) => {
  // proj4.defs('EPSG:CGCS2000', '+proj=tmerc +lat_0=0 +lon_0=114 +k=1 +x_0=500000 +y_0=0 +ellps=GRS80 +units=m +no_defs +type=crs')
  // 计算中央经线 除以3表示在第几带
  const N = Math.ceil(lonLat.x / 3)
  // 乘以3的中央经线
  const L = N * 3
  // console.log(L)
  //   设置国家2000坐标系的参数
  proj4.defs([
    [
      'EPSG:4326',
      '+title=WGS 84 (long/lat) +proj=longlat +ellps=WGS84 +datum=WGS84 +units=degrees'],
    [
      'EPSG:4547',
      '+proj=tmerc +lat_0=0 +lon_0=114 +k=1 +x_0=500000 +y_0=0 +ellps=GRS80 +units=m +no_defs +type=crs'
    ]
  ])
  proj4.defs('EPSG:CGCS2000', `+proj=tmerc +lat_0=0 +lon_0=${L} +k=1 +x_0=500000 +y_0=0 +ellps=GRS80 +units=m +no_defs +type=crs`)

  //   计算坐标
  const gsProj = proj4('EPSG:4326', 'EPSG:CGCS2000', [lonLat.x, lonLat.y])

  return { x: gsProj[0], y: gsProj[1], z: lonLat.z }
}

const CGCSToLocal = (CGCS) => {
  // 定义四参数
  const dx = -346655
  const dy = 253684
  const m = 1.0000999999 // 缩放比例
  const da = 0.0026587555// 旋转角度

  const x2 = dx + m * Math.cos(da) * CGCS.x - m * Math.sin(da) * CGCS.y
  const y2 = dy + m * Math.sin(da) * CGCS.x + m * Math.cos(da) * CGCS.y
  const z = CGCS.z

  return { x: x2, y: y2, z }
}
