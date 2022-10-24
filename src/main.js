import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'

import ElementPlus from 'element-plus'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import 'element-plus/dist/index.css'

import './styles/index.scss'

import App from './App.vue'

import 'normalize.css'

// 导入自己的ui组件库
import UI from '@/components/library/index'

const app = createApp(App)
// 创建pinia
const pinia = createPinia()

app.use(ElementPlus)
app.use(pinia)
app.use(router)
app.use(UI)

// 全局引入icon图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.mount('#app')
