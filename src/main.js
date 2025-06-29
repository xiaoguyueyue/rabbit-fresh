
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import { lazyPlugin } from '@/directives'
import {componentPlugin} from '@/components'

import App from './App.vue'
import router from './router'

// 引入样式文件
import '@/styles/common.scss'

const app = createApp(App)

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)
app.use(pinia)
app.use(router)
app.use(lazyPlugin)
app.use(componentPlugin)

app.mount('#app')
