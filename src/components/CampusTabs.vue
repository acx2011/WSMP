<script setup lang="ts">
import { computed, ref } from 'vue'
import { ElMessage } from 'element-plus/es/components/message/index'
import { useSecurityStore } from '@/stores/security'

const store = useSecurityStore()
const activeMainTab = ref('园区总览')
const activeMode = ref<'overview' | 'floor'>('overview')
const settingsVisible = ref(false)
const autoRefresh = ref(true)
const alarmVoice = ref(true)
const tabs = ['园区总览', '1号办公楼', '2号研发楼', '3号宿舍楼', '4号仓库', '外部区域']

const tabAreaMap: Record<string, string> = {
  园区总览: 'building-1',
  '1号办公楼': 'building-1',
  '2号研发楼': 'building-2',
  '3号宿舍楼': 'building-3',
  '4号仓库': 'building-4',
  外部区域: 'perimeter',
}

const activeArea = computed(() => store.selectedArea)

const selectTab = (tab: string) => {
  activeMainTab.value = tab
  if (tab === '园区总览') {
    store.setActiveMap('overview', 'building-1')
    return
  }
  if (tab === '外部区域') {
    store.setActiveMap('external', 'parking')
    return
  }
  const areaId = tabAreaMap[tab]
  if (areaId) store.selectArea(areaId)
}

const selectMode = (mode: 'overview' | 'floor') => {
  activeMode.value = mode
  if (mode === 'overview') {
    store.setActiveMap('overview', tabAreaMap[activeMainTab.value] ?? 'building-1')
    return
  }
  if (store.activeMapId === 'overview') store.selectArea('building-1')
}

const saveSettings = () => {
  settingsVisible.value = false
  ElMessage.success('视图设置已保存')
}
</script>

<template>
  <div class="campus-tabs">
    <div class="building-tabs">
      <button
        v-for="tab in tabs"
        :key="tab"
        type="button"
        :class="{ active: activeMainTab === tab }"
        @click="selectTab(tab)"
      >
        {{ tab }}
      </button>
    </div>
    <div class="mode-tabs">
      <button type="button" :class="{ active: activeMode === 'overview' }" @click="selectMode('overview')">总览</button>
      <button type="button" :class="{ active: activeMode === 'floor' }" @click="selectMode('floor')">楼层</button>
      <button type="button" @click="settingsVisible = true">设置</button>
    </div>
  </div>

  <el-dialog v-model="settingsVisible" title="园区视图设置" width="520px">
    <div class="settings-form">
      <label>
        当前对象
        <strong>{{ activeArea.name }}</strong>
      </label>
      <label>
        显示模式
        <select v-model="activeMode">
          <option value="overview">总览</option>
          <option value="floor">楼层</option>
        </select>
      </label>
      <label>
        自动刷新状态
        <el-switch v-model="autoRefresh" />
      </label>
      <label>
        报警声音提示
        <el-switch v-model="alarmVoice" />
      </label>
      <p>设置仅保存在当前前端会话，用于后续接入真实平台参数。</p>
    </div>
    <template #footer>
      <el-button @click="settingsVisible = false">取消</el-button>
      <el-button type="primary" @click="saveSettings">保存设置</el-button>
    </template>
  </el-dialog>
</template>

<style scoped lang="scss">
.campus-tabs {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  min-height: 48px;
  overflow: hidden;
}

.building-tabs,
.mode-tabs {
  display: flex;
  align-items: center;
  gap: 8px;
}

.building-tabs {
  min-width: 0;
  overflow-x: auto;
  scrollbar-width: none;
}

.building-tabs::-webkit-scrollbar {
  display: none;
}

.mode-tabs {
  flex: 0 0 auto;
}

button {
  flex: 0 0 auto;
  height: 34px;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  background: rgba(17, 31, 49, 0.72);
  color: var(--text-secondary);
  cursor: pointer;
  padding: 0 14px;
}

button:hover,
button.active {
  border-color: rgba(22, 119, 255, 0.72);
  background: rgba(22, 119, 255, 0.18);
  color: var(--text-primary);
}

.settings-form {
  display: grid;
  gap: 14px;
}

.settings-form label {
  display: grid;
  grid-template-columns: 120px 1fr;
  align-items: center;
  gap: 12px;
  color: var(--text-secondary);
}

.settings-form strong {
  color: var(--text-primary);
}

.settings-form select {
  height: 36px;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  outline: none;
  background: rgba(4, 12, 23, 0.75);
  color: var(--text-primary);
  padding: 0 10px;
}

.settings-form p {
  margin: 4px 0 0;
  color: var(--text-secondary);
}
</style>
