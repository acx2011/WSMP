<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { ElMessage } from 'element-plus/es/components/message/index'
import { useRoute } from 'vue-router'
import { Bell, ChevronDown, Expand, Menu, UserRound } from '@/icons/lucide'

const route = useRoute()
const current = ref(new Date())
const timer = ref<number>()
const weekDays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']

const timeText = computed(() => current.value.toLocaleTimeString('zh-CN', { hour12: false }))
const dateText = computed(() => {
  const date = current.value
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${weekDays[date.getDay()]}`
})
const parentTitle = computed(() => String(route.meta.parent ?? '首页'))
const currentTitle = computed(() => String(route.meta.title ?? '园区总览'))

const toggleFullscreen = async () => {
  if (!document.fullscreenElement) {
    await document.documentElement.requestFullscreen()
    return
  }
  await document.exitFullscreen()
}

onMounted(() => {
  timer.value = window.setInterval(() => {
    current.value = new Date()
  }, 1000)
})

onBeforeUnmount(() => {
  if (timer.value) window.clearInterval(timer.value)
})
</script>

<template>
  <header class="top-header">
    <div class="header-left">
      <button class="icon-btn" type="button" aria-label="菜单">
        <Menu :size="21" />
      </button>
      <div class="breadcrumb">
        <span>{{ parentTitle }}</span>
        <span>/</span>
        <strong>{{ currentTitle }}</strong>
      </div>
    </div>

    <div class="header-right">
      <el-badge :value="12" class="notice-badge">
        <button class="icon-btn" type="button" aria-label="通知">
          <Bell :size="20" />
        </button>
      </el-badge>
      <div class="clock">
        <strong>{{ timeText }}</strong>
        <span>{{ dateText }}</span>
      </div>
      <el-dropdown trigger="click" @command="(command: string) => ElMessage.info(command)">
        <button class="user-btn" type="button">
          <span class="avatar"><UserRound :size="18" /></span>
          <span>Admin</span>
          <ChevronDown :size="15" />
        </button>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="个人信息">个人信息</el-dropdown-item>
            <el-dropdown-item command="退出登录">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
      <button class="icon-btn" type="button" aria-label="全屏" @click="toggleFullscreen">
        <Expand :size="20" />
      </button>
    </div>
  </header>
</template>

<style scoped lang="scss">
.top-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 72px;
  padding: 0 22px;
  border-bottom: 1px solid var(--border-color);
  background: linear-gradient(90deg, #0b1727, #0d1d31 52%, #091525);
}

.header-left,
.header-right,
.breadcrumb,
.user-btn {
  display: flex;
  align-items: center;
}

.header-left,
.header-right {
  gap: 18px;
}

.breadcrumb {
  gap: 10px;
  color: var(--text-secondary);
  font-size: 14px;
}

.breadcrumb strong {
  color: var(--text-primary);
}

.icon-btn,
.user-btn {
  height: 38px;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.03);
  color: var(--text-primary);
  cursor: pointer;
}

.icon-btn {
  display: grid;
  width: 38px;
  place-items: center;
}

.icon-btn:hover,
.user-btn:hover {
  border-color: rgba(22, 119, 255, 0.7);
  color: #74b9ff;
}

.clock {
  display: grid;
  gap: 2px;
  text-align: right;
}

.clock strong {
  font-size: 18px;
}

.clock span {
  color: var(--text-secondary);
  font-size: 12px;
}

.user-btn {
  gap: 8px;
  padding: 0 12px;
}

.avatar {
  display: grid;
  width: 26px;
  height: 26px;
  place-items: center;
  border-radius: 50%;
  background: rgba(22, 119, 255, 0.24);
}
</style>
