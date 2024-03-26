import './assets/scss/main.scss'
import './assets/scss/iconfont.scss'

import { createApp } from 'vue'
import App from './App.vue'
import router from '@/router/index.js';

createApp(App).use(router).mount('#app')
