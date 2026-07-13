<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus/es/components/message/index'

const activeMainTab = ref('园区总览')
const activeMode = ref<'overview' | 'floor'>('overview')
const tabs = ['园区总览', '1号办公楼', '2号研发楼', '3号宿舍楼', '4号仓库', '外部区域']
</script>

<template>
  <div class="campus-tabs">
    <div class="building-tabs">
      <button
        v-for="tab in tabs"
        :key="tab"
        type="button"
        :class="{ active: activeMainTab === tab }"
        @click="activeMainTab = tab"
      >
        {{ tab }}
      </button>
    </div>
    <div class="mode-tabs">
      <button type="button" :class="{ active: activeMode === 'overview' }" @click="activeMode = 'overview'">总览</button>
      <button type="button" :class="{ active: activeMode === 'floor' }" @click="activeMode = 'floor'">楼层</button>
      <button type="button" @click="ElMessage.info('设置功能开发中')">设置</button>
    </div>
  </div>
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
</style>
