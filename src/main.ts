import { createApp } from 'vue'
import { Amplify } from 'aws-amplify'
import awsconfig from './aws-exports'
import App from './App.vue'

Amplify.configure(awsconfig)

createApp(App).mount('#app')
