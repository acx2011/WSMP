<script setup lang="ts">
import { ElMessage } from 'element-plus/es/components/message/index'
import { ElMessageBox } from 'element-plus/es/components/message-box/index'
import { Ban, ShieldCheck, ShieldOff } from '@/icons/lucide'
import PlatformLayout from '@/components/PlatformLayout.vue'
import { statusLabels, useSecurityStore } from '@/stores/security'

const store = useSecurityStore()

const confirmAction = async (label: string, action: () => void) => {
  await ElMessageBox.confirm(`确认执行${label}？`, '操作确认', { type: 'warning' })
  action()
  ElMessage.success(`${label}成功`)
}
</script>

<template>
  <PlatformLayout>
    <div class="module-page">
      <section class="module-hero panel">
        <div>
          <span>Arming Control</span>
          <h1>布防管理</h1>
        </div>
        <div class="hero-actions">
          <button type="button" @click="confirmAction('全部布防', store.armAll)">
            <ShieldCheck :size="17" />
            全部布防
          </button>
          <button type="button" @click="confirmAction('全部撤防', store.disarmAll)">
            <ShieldOff :size="17" />
            全部撤防
          </button>
        </div>
      </section>

      <section class="panel module-table">
        <div class="table-row table-head">
          <span>区域</span>
          <span>当前状态</span>
          <span>防区总数</span>
          <span>报警防区</span>
          <span>未关闭防区</span>
          <span>操作</span>
        </div>
        <div v-for="area in store.areas.filter((item) => item.type !== 'floor')" :key="area.id" class="table-row">
          <strong>{{ area.name }}</strong>
          <span>{{ statusLabels[area.status] }}</span>
          <span>{{ area.totalZones }}</span>
          <span>{{ area.alarmZones }}</span>
          <span>{{ area.openZones }}</span>
          <div class="row-actions">
            <button type="button" @click="confirmAction(`${area.name}布防`, () => store.armArea(area.id))">布防</button>
            <button type="button" @click="confirmAction(`${area.name}撤防`, () => store.disarmArea(area.id))">撤防</button>
            <button type="button" @click="store.bypassArea(area.id, '布防管理页面旁路')">
              <Ban :size="14" />
              旁路
            </button>
          </div>
        </div>
      </section>
    </div>
  </PlatformLayout>
</template>
