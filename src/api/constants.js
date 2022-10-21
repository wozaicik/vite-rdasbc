// 存放常量数据

export const leftAsideOptions = [
  {
    id: 'A001',
    name: '测 量',
    icon: 'Mic',
    children: [
      { id: 'A001001', name: '两点距离', path: '/home/twoPointDistance', icon: 'Minus' },
      { id: 'A001002', name: '多点距离', path: '/home/multipointDistance', icon: 'Share' },
      { id: 'A001003', name: '计算面积', path: '/home/area', icon: 'FullScreen' }
    ]
  },
  {
    id: 'B001',
    name: '绘 制 图 形',
    icon: 'Edit',
    children: [
      { id: 'B001001', name: '添 加 地 标', path: '/home/addPoint', icon: 'Location' },
      { id: 'B001002', name: '绘 制 线 条', path: '/home/addPolyline', icon: 'Share' },
      { id: 'B001003', name: '绘制多边形', path: '/home/addPolygon', icon: 'Crop' },
      { id: 'B001004', name: '绘制多面体', path: '/home/addPolyhedron', icon: 'Box' }
    ]
  }
]
