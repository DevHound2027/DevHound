import { createApp } from 'vue'
import App from './App.vue'
import { paperTitle } from './content'
import './style.css'

document.title = paperTitle
createApp(App).mount('#app')
