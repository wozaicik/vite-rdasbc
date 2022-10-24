
// 自动注册组件

const importFn = import.meta.glob('./*.vue')

export default {
  install (app) {
    for (const path in importFn) {
      importFn[path]().then((mod) => {
        app.component(mod.default.name, mod.default)
      })
    }
  }
}
