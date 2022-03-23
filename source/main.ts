import { createApp } from 'vue'
import App from './app.vue'
import { createPinia } from 'pinia'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)

app.mount('#app')
