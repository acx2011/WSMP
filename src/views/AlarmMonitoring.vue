<script setup lang="ts">
import { computed } from 'vue'
import { ElMessage } from 'element-plus/es/components/message/index'
import { ElMessageBox } from 'element-plus/es/components/message-box/index'
import { BellRing, CheckCircle2, RotateCcw, Siren } from '@/icons/lucide'
import PlatformLayout from '@/components/PlatformLayout.vue'
import { useSecurityStore } from '@/stores/security'

const store = useSecurityStore()

const alarmAreas = computed(() => store.areas.filter((area) => area.status === 'alarm'))
const alarmEvents = computed(() => store.events.filter((event) => event.type === 'alarm'))

const confirmAlarm = async (areaId: string) => {
  await ElMessageBox.confirm('确认该报警已处置？', '报警确认', { type: 'warning' })
  store.restoreArea(areaId)
  ElMessage.success('报警已确认并恢复')
}

const simulateAlarm = () => {
  const target = store.areas.find((area) => area.status !== 'offline' && area.type !== 'floor')
  if (!target) return
  store.triggerAlarm(target.id)
  store.selectArea(target.id)
  ElMessage.success('已模拟一条报警')
}
</script>

<template>
  <PlatformLayout>
    <div class="module-page alarm-page">
      <section class="module-hero panel">
        <div>
          <span>Alarm Center</span>
          <h1>报警监控</h1>
        </div>
        <div class="hero-actions">
          <button type="button" @click="simulateAlarm">
            <Siren :size="17" />
            模拟报警
          </button>
        </div>
      </section>

      <section class="alarm-grid">
        <div class="panel alarm-list">
          <div class="panel-title">
            <span>当前报警</span>
            <strong>{{ alarmAreas.length }}</strong>
          </div>
          <div v-if="alarmAreas.length === 0" class="empty">暂无未处理报警</div>
          <div v-for="area in alarmAreas" :key="area.id" class="alarm-card">
            <BellRing :size="22" />
            <div>
              <strong>{{ area.name }}</strong>
              <span>{{ area.lastOperationTime }} · 报警防区 {{ area.alarmZones }}</span>
            </div>
            <button type="button" @click="confirmAlarm(area.id)">
              <CheckCircle2 :size="16" />
              确认
            </button>
          </div>
        </div>

        <div class="panel alarm-timeline">
          <div class="panel-title">
            <span>报警事件流</span>
            <button class="link-action" type="button" @click="ElMessage.info('导出功能开发中')">导出</button>
          </div>
          <div v-for="event in alarmEvents" :key="event.id" class="timeline-row">
            <span>{{ event.time }}</span>
            <strong>{{ event.areaName }}</strong>
            <em>{{ event.description }}</em>
            <button type="button" @click="store.restoreArea(event.areaId)">
              <RotateCcw :size="15" />
              恢复
            </button>
          </div>
        </div>
      </section>
    </div>
  </PlatformLayout>
</template>

<style scoped lang="scss">
.alarm-grid {
  display: grid;
  grid-template-columns: 420px minmax(0, 1fr);
  gap: 14px;
  min-height: 0;
}

.alarm-list,
.alarm-timeline {
  min-height: 0;
  overflow: auto;
  padding: 16px;
}

.alarm-card,
.timeline-row {
  display: grid;
  align-items: center;
  gap: 12px;
  border-bottom: 1px solid rgba(44, 68, 98, 0.55);
  padding: 14px 0;
}

.alarm-card {
  grid-template-columns: 34px 1fr 90px;
}

.alarm-card svg {
  color: var(--alarm);
}

.alarm-card div,
.timeline-row {
  color: var(--text-secondary);
}

.alarm-card strong,
.timeline-row strong {
  color: var(--text-primary);
}

.alarm-card span,
.timeline-row em {
  display: block;
  margin-top: 5px;
  font-style: normal;
  font-size: 13px;
}

.timeline-row {
  grid-template-columns: 170px 140px 1fr 90px;
}

.alarm-card button,
.timeline-row button,
.hero-actions button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  height: 34px;
  border: 1px solid rgba(229, 57, 53, 0.55);
  border-radius: 8px;
  background: rgba(229, 57, 53, 0.12);
  color: var(--text-primary);
  cursor: pointer;
}

.empty {
  padding: 28px 0;
  color: var(--text-secondary);
  text-align: center;
}
</style>
