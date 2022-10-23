// 主要存储界面是否加载完毕和控制菜单栏、底部的出现
import { defineStore } from 'pinia'

export const layoutStore = defineStore('layout', {
  state: () => ({
    isViewer: false, // 判断地球是否加载完毕
    isLeftCollapse: true, // 左侧菜单栏的缩放控制
    isFooterOpen: false, // 底部界面的上升下降控制
    isRightCollapse: false// 右侧菜单栏的缩放控制
  }),
  actions: {

  },
  getters: {

  }
})
