<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus/es/components/message/index'
import { CalendarClock, Plus } from '@/icons/lucide'
import PlatformLayout from '@/components/PlatformLayout.vue'

interface Schedule {
  id: string
  name: string
  areas: string
  time: string
  mode: string
  enabled: boolean
}

const schedules = ref<Schedule[]>([
  { id: 'S-001', name: '工作日夜间布防', areas: '办公楼、研发楼、仓库', time: '周一至周五 20:00', mode: '布防', enabled: true },
  { id: 'S-002', name: '清晨撤防计划', areas: '办公楼、研发楼', time: '周一至周五 07:30', mode: '撤防', enabled: true },
  { id: 'S-003', name: '周末园区布防', areas: '全园区可用区域', time: '周六 18:00', mode: '布防', enabled: false },
])
</script>

<template>
  <PlatformLayout>
    <div class="module-page">
      <section class="module-hero panel">
        <div>
          <span>Schedule Policy</span>
          <h1>自动布防计划</h1>
        </div>
        <div class="hero-actions">
          <button type="button" @click="ElMessage.info('新增计划弹窗开发中')">
            <Plus :size="17" />
            新增计划
          </button>
        </div>
      </section>

      <section class="plan-grid">
        <article v-for="schedule in schedules" :key="schedule.id" class="panel plan-card">
          <div>
            <CalendarClock :size="22" />
            <strong>{{ schedule.name }}</strong>
            <el-switch v-model="schedule.enabled" />
          </div>
          <p>{{ schedule.areas }}</p>
          <span>{{ schedule.time }} · {{ schedule.mode }}</span>
        </article>
      </section>
    </div>
  </PlatformLayout>
</template>

<style scoped lang="scss">
.plan-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 14px;
}

.plan-card {
  padding: 18px;
}

.plan-card div {
  display: grid;
  grid-template-columns: 28px 1fr auto;
  align-items: center;
  gap: 10px;
}

.plan-card svg {
  color: var(--primary);
}

.plan-card p {
  color: var(--text-primary);
}

.plan-card span {
  color: var(--text-secondary);
}
</style>
