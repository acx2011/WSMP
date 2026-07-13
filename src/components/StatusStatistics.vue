<script setup lang="ts">
import { ref } from 'vue'
import { Activity, AlertTriangle, Ban, CircleOff, RadioReceiver, ShieldCheck } from '@/icons/lucide'
import { statusLabels } from '@/stores/security'
import { useSecurityStore } from '@/stores/security'

const store = useSecurityStore()
const drawerVisible = ref(false)
const icons = [ShieldCheck, Ban, CircleOff, AlertTriangle, RadioReceiver, Activity]
</script>

<template>
  <section class="status-statistics panel">
    <div class="panel-title">
      <span>实时状态统计</span>
      <button class="link-action" type="button" @click="drawerVisible = true">更多 &gt;</button>
    </div>
    <div class="stat-grid">
      <div v-for="(item, index) in store.statusStatistics" :key="item.key" class="stat-item" :style="{ '--item-color': item.color }">
        <component :is="icons[index]" :size="20" />
        <span>{{ item.label }}</span>
        <strong>{{ item.value }}</strong>
      </div>
    </div>

    <el-drawer v-model="drawerVisible" title="各状态区域" size="360px">
      <div class="status-list">
        <div v-for="area in store.areas" :key="area.id">
          <span>{{ area.name }}</span>
          <strong :style="{ color: store.statusStatistics.find((item) => item.key === area.status)?.color }">{{ statusLabels[area.status] }}</strong>
        </div>
      </div>
    </el-drawer>
  </section>
</template>

<style scoped lang="scss">
.status-statistics {
  padding: 16px;
}

.stat-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
  padding-top: 14px;
}

.stat-item {
  display: grid;
  grid-template-columns: 28px 1fr auto;
  align-items: center;
  min-height: 58px;
  padding: 0 12px;
  border: 1px solid rgba(44, 68, 98, 0.85);
  border-radius: 8px;
  background: rgba(4, 12, 23, 0.36);
}

.stat-item svg,
.stat-item strong {
  color: var(--item-color);
}

.stat-item span {
  color: var(--text-secondary);
  font-size: 13px;
}

.stat-item strong {
  font-size: 22px;
}

.status-list {
  display: grid;
  gap: 10px;
}

.status-list div {
  display: flex;
  justify-content: space-between;
  padding: 12px;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.03);
}
</style>
