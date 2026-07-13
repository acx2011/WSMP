<script setup lang="ts">
import { computed, ref } from 'vue'
import type { Component } from 'vue'
import { ElMessage } from 'element-plus/es/components/message/index'
import { useRoute, useRouter } from 'vue-router'
import {
  BellRing,
  CalendarClock,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  FileClock,
  Home,
  LayoutDashboard,
  Map,
  RadioTower,
  Settings,
  ShieldCheck,
  UserCog,
  Video,
} from '@/icons/lucide'
import { useSecurityStore } from '@/stores/security'

interface SidebarChild {
  label: string
  route: string
  icon: Component
}

interface SidebarMenu {
  label: string
  icon: Component
  route?: string
  children?: SidebarChild[]
  pending?: boolean
}

const store = useSecurityStore()
const route = useRoute()
const router = useRouter()
const expandedMenus = ref<Set<string>>(new Set(['系统配置']))

const menus: SidebarMenu[] = [
  { label: '园区总览', icon: LayoutDashboard, route: '/' },
  { label: '报警监控', icon: BellRing, route: '/alarm-monitoring' },
  { label: '布防管理', icon: ShieldCheck, route: '/arming-management' },
  { label: '设备管理', icon: RadioTower, route: '/device-management' },
  { label: '自动布防计划', icon: CalendarClock, route: '/auto-arm-schedule' },
  { label: '事件记录', icon: FileClock, route: '/event-records' },
  { label: '视频联动', icon: Video, route: '/video-linkage' },
  { label: '用户与权限', icon: UserCog, route: '/users-permissions' },
  {
    label: '系统配置',
    icon: Settings,
    children: [
      { label: '系统参数', route: '/system/config', icon: Settings },
      { label: '地图轮廓编辑', route: '/system/map-outline-editor', icon: Map },
    ],
  },
]

const activeParent = computed(() => {
  const matched = menus.find((menu) => menu.route === route.path || menu.children?.some((child) => child.route === route.path))
  return matched?.label ?? '园区总览'
})

const handleMenuClick = async (menu: SidebarMenu) => {
  if (menu.children) {
    const next = new Set(expandedMenus.value)
    if (next.has(menu.label)) next.delete(menu.label)
    else next.add(menu.label)
    expandedMenus.value = next
    return
  }
  if (menu.route) {
    await router.push(menu.route)
    return
  }
  if (menu.pending) ElMessage.info('功能开发中')
}

const handleChildClick = async (routePath: string) => {
  await router.push(routePath)
}
</script>

<template>
  <aside class="app-sidebar" :class="{ collapsed: store.sidebarCollapsed }">
    <div class="brand">
      <div class="brand-icon"><Home :size="22" /></div>
      <div v-if="!store.sidebarCollapsed" class="brand-text">
        <strong>WinPoint</strong>
        <span>安防管理平台</span>
      </div>
    </div>

    <nav class="menu-list">
      <template v-for="menu in menus" :key="menu.label">
        <button
          class="menu-item"
          :class="{ active: activeParent === menu.label }"
          type="button"
          @click="handleMenuClick(menu)"
        >
          <component :is="menu.icon" :size="20" />
          <span v-if="!store.sidebarCollapsed">{{ menu.label }}</span>
          <ChevronDown
            v-if="menu.children && !store.sidebarCollapsed"
            class="menu-arrow"
            :class="{ expanded: expandedMenus.has(menu.label) }"
            :size="16"
          />
        </button>
        <div v-if="menu.children && expandedMenus.has(menu.label) && !store.sidebarCollapsed" class="submenu">
          <button
            v-for="child in menu.children"
            :key="child.route"
            class="submenu-item"
            :class="{ active: route.path === child.route }"
            type="button"
            @click="handleChildClick(child.route)"
          >
            <component :is="child.icon" :size="16" />
            <span>{{ child.label }}</span>
          </button>
        </div>
      </template>
    </nav>

    <button class="collapse-btn" type="button" @click="store.toggleSidebar">
      <ChevronRight v-if="store.sidebarCollapsed" :size="18" />
      <ChevronLeft v-else :size="18" />
      <span v-if="!store.sidebarCollapsed">收起菜单</span>
    </button>
  </aside>
</template>

<style scoped lang="scss">
.app-sidebar {
  display: flex;
  flex: 0 0 clamp(205px, 13vw, 250px);
  flex-direction: column;
  width: clamp(205px, 13vw, 250px);
  border-right: 1px solid var(--border-color);
  background: linear-gradient(180deg, #0b1727, #081220);
  transition: width 0.22s ease, flex-basis 0.22s ease;
}

.app-sidebar.collapsed {
  flex-basis: 76px;
  width: 76px;
}

.brand {
  display: flex;
  align-items: center;
  gap: 12px;
  height: 72px;
  padding: 0 14px;
  border-bottom: 1px solid var(--border-color);
}

.brand-icon {
  display: grid;
  flex: 0 0 40px;
  width: 40px;
  height: 40px;
  place-items: center;
  border: 1px solid rgba(22, 119, 255, 0.5);
  border-radius: 8px;
  background: rgba(22, 119, 255, 0.16);
  color: #58a6ff;
}

.brand-text {
  display: grid;
  gap: 2px;
  min-width: 0;
}

.brand-text strong {
  font-size: 22px;
  letter-spacing: 0;
}

.brand-text span {
  color: var(--text-secondary);
  font-size: 13px;
}

.menu-list {
  display: grid;
  gap: 6px;
  padding: 16px 12px;
}

.menu-item,
.collapse-btn {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  height: 44px;
  border: 1px solid transparent;
  border-radius: 8px;
  background: transparent;
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.16s ease;
}

.menu-item {
  padding: 0 12px;
  text-align: left;
}

.menu-item span {
  flex: 1;
}

.menu-item:hover,
.menu-item.active {
  border-color: rgba(22, 119, 255, 0.45);
  background: linear-gradient(90deg, rgba(22, 119, 255, 0.24), rgba(22, 119, 255, 0.04));
  color: var(--text-primary);
}

.menu-item.active {
  box-shadow: inset 3px 0 0 var(--primary);
}

.menu-arrow {
  color: #6c7d92;
  transition: transform 0.16s ease;
}

.menu-arrow.expanded {
  transform: rotate(180deg);
}

.submenu {
  display: grid;
  gap: 4px;
  margin-top: -2px;
  padding: 0 0 4px 36px;
}

.submenu-item {
  display: flex;
  align-items: center;
  gap: 8px;
  height: 34px;
  border: 1px solid transparent;
  border-radius: 7px;
  background: transparent;
  color: var(--text-secondary);
  cursor: pointer;
  padding: 0 10px;
  text-align: left;
}

.submenu-item:hover,
.submenu-item.active {
  border-color: rgba(22, 119, 255, 0.38);
  background: rgba(22, 119, 255, 0.14);
  color: var(--text-primary);
}

.collapse-btn {
  justify-content: center;
  margin: auto 12px 18px;
  width: calc(100% - 24px);
  border-color: var(--border-color);
  background: rgba(255, 255, 255, 0.03);
}
</style>
