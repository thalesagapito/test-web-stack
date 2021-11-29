import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import { Amplify } from 'aws-amplify'
import awsconfig from './aws-exports'
import Index from './pages/Index.vue'
import App from './App.vue'
import './index.css'

Amplify.configure(awsconfig)

const app = createApp(App)
const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: Index },
    { path: '/:catchAll(.*)', redirect: '/' },
  ],
})

app.use(router)
app.mount('#app')
