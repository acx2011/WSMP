<script setup lang="ts">
import { ElMessage } from 'element-plus/es/components/message/index'
import type { SecurityEventType } from '@/types/security'
import { useSecurityStore } from '@/stores/security'

const store = useSecurityStore()

const filters: Array<{ label: string; value: 'all' | SecurityEventType }> = [
  { label: '全部事件', value: 'all' },
  { label: '报警', value: 'alarm' },
  { label: '布防', value: 'arm' },
  { label: '撤防', value: 'disarm' },
  { label: '故障', value: 'fault' },
  { label: '恢复', value: 'restore' },
]

const eventLabels: Record<SecurityEventType, string> = {
  alarm: '报警',
  arm: '布防',
  disarm: '撤防',
  fault: '故障',
  restore: '恢复',
  bypass: '旁路',
}
</script>

<template>
  <section class="realtime-events panel">
    <div class="events-head">
      <div class="panel-title">
        <span>实时事件</span>
        <button class="link-action" type="button" @click="ElMessage.info('更多事件功能开发中')">更多</button>
      </div>
      <div class="filter-tabs">
        <button
          v-for="filter in filters"
          :key="filter.value"
          type="button"
          :class="{ active: store.activeEventFilter === filter.value }"
          @click="store.setEventFilter(filter.value)"
        >
          {{ filter.label }}
        </button>
      </div>
    </div>

    <div class="event-table">
      <div class="event-row table-header">
        <span>时间</span>
        <span>事件类型</span>
        <span>区域</span>
        <span>事件描述</span>
        <span>操作人</span>
      </div>
      <div class="event-scroll">
        <div v-for="event in store.filteredEvents" :key="event.id" class="event-row">
          <span>{{ event.time }}</span>
          <span class="type" :class="event.type">{{ eventLabels[event.type] }}</span>
          <span>{{ event.areaName }}</span>
          <span>{{ event.description }}</span>
          <span>{{ event.operator }}</span>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.realtime-events {
  display: flex;
  flex-direction: column;
  flex: 0 0 294px;
  min-height: 230px;
  padding: 14px 16px 16px;
}

.events-head {
  display: grid;
  gap: 12px;
}

.panel-title {
  padding-bottom: 10px;
}

.filter-tabs {
  display: flex;
  gap: 8px;
}

.filter-tabs button {
  height: 30px;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.03);
  color: var(--text-secondary);
  cursor: pointer;
  padding: 0 12px;
}

.filter-tabs button.active,
.filter-tabs button:hover {
  border-color: rgba(22, 119, 255, 0.68);
  background: rgba(22, 119, 255, 0.15);
  color: var(--text-primary);
}

.event-table {
  display: flex;
  flex: 1;
  flex-direction: column;
  min-height: 0;
  margin-top: 12px;
  overflow: hidden;
}

.event-scroll {
  flex: 1;
  min-height: 0;
  overflow: auto;
}

.event-row {
  display: grid;
  grid-template-columns: clamp(122px, 10vw, 170px) clamp(66px, 5vw, 90px) clamp(86px, 7vw, 130px) minmax(130px, 1fr) clamp(56px, 5vw, 90px);
  align-items: center;
  min-height: 34px;
  padding: 0 12px;
  border-bottom: 1px solid rgba(44, 68, 98, 0.45);
  color: var(--text-secondary);
  font-size: 13px;
}

.table-header {
  min-height: 32px;
  border-radius: 8px 8px 0 0;
  background: rgba(22, 119, 255, 0.1);
  color: #cfe2f8;
  font-weight: 700;
}

.type {
  font-weight: 700;
}

.alarm {
  color: var(--alarm);
}

.arm {
  color: var(--armed);
}

.disarm {
  color: var(--disarmed);
}

.fault {
  color: var(--fault);
}

.restore {
  color: #46d6a5;
}

.bypass {
  color: #ffad42;
}
</style>
