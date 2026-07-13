<script setup lang="ts">
import { ElMessage } from 'element-plus/es/components/message/index'
import { ElMessageBox } from 'element-plus/es/components/message-box/index'
import { AlarmClock, Shield, ShieldOff, Siren } from '@/icons/lucide'
import { useSecurityStore } from '@/stores/security'

const store = useSecurityStore()

const runAction = async (title: string, action: () => void) => {
  await ElMessageBox.confirm(`确认执行“${title}”？`, '操作确认', { type: 'warning' })
  action()
  ElMessage.success(`${title}已执行`)
}
</script>

<template>
  <section class="quick-actions panel">
    <div class="panel-title">快捷操作</div>
    <div class="action-grid">
      <button type="button" @click="runAction('全部布防', store.armAll)">
        <Shield :size="18" />
        <span>全部布防</span>
      </button>
      <button type="button" @click="runAction('全部撤防', store.disarmAll)">
        <ShieldOff :size="18" />
        <span>全部撤防</span>
      </button>
      <button type="button" @click="runAction('夜间布防', store.nightArm)">
        <AlarmClock :size="18" />
        <span>夜间布防</span>
      </button>
      <button class="danger" type="button" @click="runAction('紧急撤防', store.emergencyDisarm)">
        <Siren :size="18" />
        <span>紧急撤防</span>
      </button>
    </div>
  </section>
</template>

<style scoped lang="scss">
.quick-actions {
  padding: 16px;
}

.action-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
  padding-top: 14px;
}

button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  height: 42px;
  border: 1px solid rgba(22, 119, 255, 0.42);
  border-radius: 8px;
  background: rgba(22, 119, 255, 0.12);
  color: #d8ecff;
  cursor: pointer;
}

button:hover {
  border-color: rgba(22, 119, 255, 0.9);
  background: rgba(22, 119, 255, 0.22);
}

.danger {
  border-color: rgba(229, 57, 53, 0.5);
  background: rgba(229, 57, 53, 0.13);
}
</style>
