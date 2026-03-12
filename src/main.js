import { createApp } from 'vue'
import { createPinia } from 'pinia' // Thêm dòng này
import App from './App.vue'
import router from './router'

// Import CSS
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import 'bootstrap-icons/font/bootstrap-icons.css'

const app = createApp(App)
const pinia = createPinia() // Khởi tạo Pinia

app.use(pinia) // Sử dụng Pinia
app.use(router)
app.mount('#app')