// 单个cartesian3坐标转换为经纬度、CGCS2000、地方坐标系
import { Cartographic, Math as cesiumMath } from 'cesium'
import proj4 from 'proj4'
import { ref } from 'vue'
import * as turf from '@turf/turf'

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

export const car3TranNew = (Cartesian3) => {
  const car3 = Cartesian3

  if (!car3.value) {
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
  lonLat.value = Cartesian3ToCartographicDegree(car3.value)

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
export const Cartesian3ToCartographicDegree = (Cartesian3) => {
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
export const lonLatToCGCS = (lonLat) => {
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

export const CGCSToLocal = (CGCS) => {
  // 定义四参数
  const dx = -374100
  const dy = -2531700
  const m = 0.999977 // 缩放比例
  const da = 0.00485289032// 旋转角度

  const x2 = dx + m * Math.cos(da) * CGCS.x - m * Math.sin(da) * CGCS.y
  const y2 = dy + m * Math.sin(da) * CGCS.x + m * Math.cos(da) * CGCS.y
  const z = CGCS.z

  return { x: x2, y: y2, z }
}

/**
 *  计算两个点的距离和方位
 * @param {Object} disPosition 第一个点
 * @param {lonLat} lonLat   第二个点的经纬度
 * @returns distance, bearing
 */
export const calDisBear = (oneLonLat, twoLonLat) => {
  // 重命名数据 方便使用
  // const oneLonLat = disPosition.lonLat
  // const twoLonLat = lonLat

  // 将坐标数据转换为turf的Geojson个数
  // 将数据转为turf格式
  const from = turf.point([oneLonLat.x, oneLonLat.y])
  const to = turf.point([twoLonLat.x, twoLonLat.y])

  // 使用经纬度 计算距离
  const distance = (turf.distance(from, to) * 1000).toFixed(2)
  // 使用经纬度 计算方位
  let bearing = turf.bearing(from, to)

  if (bearing < 0) {
    bearing = bearing + 360
  }

  return { distance, bearing }
}

/**
 *
 * @param {Object} oneLonLat 第一个点的经纬度
 * @param {Object} twoLonLat 第二个点的经纬度
 * @returns 两个点之间的中心坐标
 */
export const calCenter = (oneLonLat, twoLonLat) => {
  // 计算两个点之间的中间点
  const pointOne = turf.point([oneLonLat.x, oneLonLat.y])
  const pointTwo = turf.point([twoLonLat.x, twoLonLat.y])
  const midpoint = turf.midpoint(pointOne, pointTwo)

  const center = [midpoint.geometry.coordinates[0], midpoint.geometry.coordinates[1]]
  return center
  // return midpoint
}

/**
 * 这里计算的坡度也是一样的，要沿着法线方向取点才能计算准确的坡向
 *  计算两个点之间的坡度
 * @param {Object} oneLonLat 第一个点的经纬度
 * @param {Object} twoLonLat 第二个点的经纬度
 * @param {Number} distance 两个点之间距离
 * @returns Number
 */
export const calSlope = (oneLonLat, twoLonLat, distance) => {
  // 距离不会有负的，距离是通过turf库计算的
  // 计算两个点之间的高度 的 绝对值
  const height = Math.abs(oneLonLat.z - twoLonLat.z)
  // 如果高度为0 或者 距离为0 则坡度为0
  if (height === 0 || distance === 0) {
    return 0
  }
  const slope = ((height / distance) * 100)

  if (slope < 1) {
    return 1
  }

  return slope
}

/**
 * 这里计算两个点之间坡向比较理想化，只能计算在同一个山坡上，而且沿法线方向才能比较准确
 * 根据高度和方位角 返回坡向
 * @param {Object} oneLonLat 第一个点的经纬度
 * @param {Object} twoLonLat 第二个点的经纬度
 * @param {Number} bearing 两个点之间的方位角
 * @returns String
 */
export const calAspect = (oneLonLat, twoLonLat, bearing) => {
  // 比较两个点之间的高度，如果第一个点高于第二个点，则方位角可以使用 为什么 可以看一下坡向的定义
  if (oneLonLat.z > twoLonLat.z) {
    return aspect(bearing)
  }
  // 如果第二点的高程低，则加上180，得到反向的方位角，超过360则减去360
  if (oneLonLat.z < twoLonLat.z) {
    bearing = bearing + 180
    if (bearing > 360) return aspect(bearing - 360)
    return aspect(bearing)
  }
  // 如果他们两个的高程相等，则是一个平面
  return '平面(-1)'
}

/**
 * 给方位角，返回坡向
 * @param {Number} bearing
 * @returns String
 */
const aspect = (bearing) => {
  if ((bearing > 337.5 && bearing <= 360) || (bearing > 0 && bearing <= 22.5)) {
    return '北'
  }
  if (bearing > 22.5 && bearing <= 67.5) {
    return '东北'
  }
  if (bearing > 67.5 && bearing <= 112.5) {
    return '东'
  }
  if (bearing > 112.5 && bearing <= 157.5) {
    return '东南'
  }
  if (bearing > 157.5 && bearing <= 202.5) {
    return '南'
  }
  if (bearing > 202.5 && bearing <= 247.5) {
    return '西南'
  }
  if (bearing > 247.5 && bearing <= 292.5) {
    return '西'
  }
  if (bearing > 292.5 && bearing <= 337.5) {
    return '西北'
  }
  return '平面(-1)'
}
