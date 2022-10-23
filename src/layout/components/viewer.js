import * as Cesium from 'cesium'
import { onBeforeUnmount } from 'vue'
import { layoutStore } from '@/store/layoutStore.js'
import { ElMessage } from 'element-plus'

function initViewer (props, callback) {
  // 拿到状态库
  const layout = layoutStore()

  // 初始化viewer  借鉴supergis库
  if (window.viewer) {
    // window.viewer.destroy();
    window.viewer = null
    // return;
  }

  let viewer = null
  let scene = null

  Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJjYmIzNjI5MS1lNjUwLTQ5YzAtOTEzMS1lZjEwMzFjMGQ5YzciLCJpZCI6NTYwOTgsImlhdCI6MTY2NjQ5NzYyNX0.jl0ZgsKY3cI8yKm4RRD_voSeDTaVK4GuXZXMid_oKUc'

  // 判断是否加载完成，未加载则进行初始化
  if (!layout.isViewer) {
    try {
      //  以下内容可在程序开头设置，主要设置基础控件和基础图层的属性，一般不在初始化Viewer时加载数据。
      viewer = new Cesium.Viewer('cesiumContainer', {
        animation: false, // 是否创建动画小控件，即左下角的仪表，默认为TRUE
        baseLayerPicker: false, // 是否显示图层选择器，默认为TRUE
        fullscreenButton: false, // 是否显示全屏按钮，默认为TRUE
        geocoder: false, // 是否显示geocoder(右上角查询按钮)，默认为TRUE
        homeButton: false, // 是否显示home按钮，默认为TRUE
        infoBox: false, // 是否显示信息框，默认为TRUE
        sceneModePicker: false, // 是否显示三维地球/二维地球地图选择器，默认为TRUE
        selectionIndicator: false, // 是否显示选取指示器(鼠标点击显示绿框)，默认为TRUE
        timeline: false, // 是否显示时间轴，默认为TRUE
        navigationHelpButton: false, // 是否显示右上角的帮助按钮，默认为TRUE
        scene3DOnly: false, // 如果设置为TRUE，则所有集合图形以三维模式绘制以节约GPU资源，默认为false
        terrainProvider: Cesium.createWorldTerrain()// 加载地形
      })
      viewer.scene.globe.depthTestAgainstTerrain = true// 设置为true 才能准确的获取坐标值
      // viewer.scene.postProcessStages.fxaa.enabled = false// 给文字去除锯齿
      // 去掉cesium左下角的版权标识
      viewer.cesiumWidget.creditContainer.style.display = 'none'
      // 将viewer与scene传给window作为全局变量
      window.viewer = viewer
      window.scene = viewer.scene

      scene = viewer.scene
      // 将加载状态改为true
      layout.isViewer = true
    } catch (e) {
      ElMessage.error(e)
    }
  }

  // 销毁
  onBeforeUnmount(() => {
    viewer.destroy()
    window.viewer = undefined
    window.scene = undefined
  })

  return { viewer, scene }
}

export default initViewer
