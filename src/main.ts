import { createApp } from 'vue'
import { ElBadge } from 'element-plus/es/components/badge/index'
import { ElButton } from 'element-plus/es/components/button/index'
import { ElDialog } from 'element-plus/es/components/dialog/index'
import { ElDrawer } from 'element-plus/es/components/drawer/index'
import { ElDropdown, ElDropdownItem, ElDropdownMenu } from 'element-plus/es/components/dropdown/index'
import { ElInput } from 'element-plus/es/components/input/index'
import { ElSwitch } from 'element-plus/es/components/switch/index'
import { ElTree } from 'element-plus/es/components/tree/index'
import 'element-plus/es/components/badge/style/css'
import 'element-plus/es/components/button/style/css'
import 'element-plus/es/components/dialog/style/css'
import 'element-plus/es/components/drawer/style/css'
import 'element-plus/es/components/dropdown/style/css'
import 'element-plus/es/components/dropdown-item/style/css'
import 'element-plus/es/components/dropdown-menu/style/css'
import 'element-plus/es/components/input/style/css'
import 'element-plus/es/components/message/style/css'
import 'element-plus/es/components/message-box/style/css'
import 'element-plus/es/components/switch/style/css'
import 'element-plus/es/components/tree/style/css'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import { useSecurityStore } from './stores/security'
import './styles/variables.scss'
import './styles/global.scss'
import './styles/transitions.scss'

const app = createApp(App)
const pinia = createPinia()

;[ElBadge, ElButton, ElDialog, ElDrawer, ElDropdown, ElDropdownItem, ElDropdownMenu, ElInput, ElSwitch, ElTree].forEach((component) => {
  app.use(component)
})

app.use(pinia).use(router)

const bootstrap = async () => {
  await useSecurityStore(pinia).hydrateAreaSettings()
  app.mount('#app')
}

void bootstrap()
