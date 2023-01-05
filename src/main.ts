/*
 * @Author: smilexxy15050618 smilexxy15050618@126.com
 * @Date: 2022-11-17 19:27:00
 * @LastEditors: smilexxy15050618 smilexxy15050618@126.com
 * @LastEditTime: 2022-11-23 16:14:58
 * @FilePath: /Vue3.0VideoUpload/src/main.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { createApp } from 'vue'
import App from './App.vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

const app = createApp(App)

app.use(ElementPlus)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.mount('#app')
