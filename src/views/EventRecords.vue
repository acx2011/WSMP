<script setup lang="ts">
import { computed, ref } from 'vue'
import PlatformLayout from '@/components/PlatformLayout.vue'
import type { SecurityEventType } from '@/types/security'
import { useSecurityStore } from '@/stores/security'

const store = useSecurityStore()
const keyword = ref('')
const typeFilter = ref<'all' | SecurityEventType>('all')

const typeLabels: Record<SecurityEventType, string> = {
  alarm: '报警',
  arm: '布防',
  disarm: '撤防',
  fault: '故障',
  restore: '恢复',
  bypass: '旁路',
}

const records = computed(() => store.events.filter((event) => {
  const matchType = typeFilter.value === 'all' || event.type === typeFilter.value
  const matchKeyword = `${event.areaName}${event.description}${event.operator}`.includes(keyword.value.trim())
  return matchType && matchKeyword
}))
</script>

<template>
  <PlatformLayout>
    <div class="module-page">
      <section class="module-hero panel">
        <div>
          <span>Event Archive</span>
          <h1>事件记录</h1>
        </div>
        <div class="hero-actions filters">
          <input v-model="keyword" placeholder="搜索区域、描述或操作人" />
          <select v-model="typeFilter">
            <option value="all">全部类型</option>
            <option v-for="(label, value) in typeLabels" :key="value" :value="value">{{ label }}</option>
          </select>
        </div>
      </section>

      <section class="panel module-table">
        <div class="table-row table-head">
          <span>时间</span>
          <span>类型</span>
          <span>区域</span>
          <span>描述</span>
          <span>操作人</span>
        </div>
        <div v-for="event in records" :key="event.id" class="table-row">
          <span>{{ event.time }}</span>
          <strong>{{ typeLabels[event.type] }}</strong>
          <span>{{ event.areaName }}</span>
          <span>{{ event.description }}</span>
          <span>{{ event.operator }}</span>
        </div>
      </section>
    </div>
  </PlatformLayout>
</template>
