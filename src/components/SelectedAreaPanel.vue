<script setup lang="ts">
import { computed, ref } from 'vue'
import { ElMessage } from 'element-plus/es/components/message/index'
import { ElMessageBox } from 'element-plus/es/components/message-box/index'
import { MoreHorizontal, RouteOff, Shield, ShieldOff } from '@/icons/lucide'
import { statusLabels } from '@/stores/security'
import { useSecurityStore } from '@/stores/security'

const store = useSecurityStore()
const bypassVisible = ref(false)
const bypassReason = ref('')
const area = computed(() => store.selectedArea)

const infoRows = computed(() => [
  ['区域名称', area.value.name],
  ['当前状态', statusLabels[area.value.status]],
  ['设备状态', area.value.online ? '在线' : '离线'],
  ['防区总数', String(area.value.totalZones)],
  ['报警防区', String(area.value.alarmZones)],
  ['未关闭防区', String(area.value.openZones)],
  ['最后操作人', area.value.lastOperator],
  ['最后操作时间', area.value.lastOperationTime],
])

const confirmAreaAction = async (label: string, action: () => void) => {
  await ElMessageBox.confirm(`确认对“${area.value.name}”执行${label}？`, '操作确认', { type: 'warning' })
  action()
  ElMessage.success(`${label}成功`)
}

const submitBypass = () => {
  const reason = bypassReason.value.trim()
  if (!reason) {
    ElMessage.warning('请输入旁路原因')
    return
  }
  store.bypassArea(area.value.id, reason)
  bypassVisible.value = false
  bypassReason.value = ''
  ElMessage.success('旁路成功')
}

const handleMore = (command: string) => {
  if (command === '查看防区' || command === '查看历史') {
    ElMessage.info(command)
    return
  }
  if (command === '模拟报警') store.triggerAlarm(area.value.id)
  if (command === '恢复正常') store.restoreArea(area.value.id)
  ElMessage.success(`${command}已执行`)
}
</script>

<template>
  <section class="selected-panel panel">
    <div class="panel-title">选中区域信息</div>
    <div class="area-name">{{ area.name }}</div>
    <div class="info-list">
      <div v-for="[label, value] in infoRows" :key="label">
        <span>{{ label }}</span>
        <strong>{{ value }}</strong>
      </div>
    </div>
    <div class="area-actions">
      <button type="button" @click="confirmAreaAction('布防', () => store.armArea(area.id))">
        <Shield :size="17" />
        布防
      </button>
      <button type="button" @click="confirmAreaAction('撤防', () => store.disarmArea(area.id))">
        <ShieldOff :size="17" />
        撤防
      </button>
      <button type="button" @click="bypassVisible = true">
        <RouteOff :size="17" />
        旁路
      </button>
      <el-dropdown trigger="click" @command="handleMore">
        <button type="button">
          <MoreHorizontal :size="17" />
          更多
        </button>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="查看防区">查看防区</el-dropdown-item>
            <el-dropdown-item command="查看历史">查看历史</el-dropdown-item>
            <el-dropdown-item command="模拟报警">模拟报警</el-dropdown-item>
            <el-dropdown-item command="恢复正常">恢复正常</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>

    <el-dialog v-model="bypassVisible" title="旁路原因" width="420px">
      <el-input v-model="bypassReason" type="textarea" :rows="4" placeholder="请输入旁路原因" />
      <template #footer>
        <el-button @click="bypassVisible = false">取消</el-button>
        <el-button type="primary" @click="submitBypass">确认旁路</el-button>
      </template>
    </el-dialog>
  </section>
</template>

<style scoped lang="scss">
.selected-panel {
  padding: 16px;
}

.area-name {
  margin: 14px 0 10px;
  color: #dbefff;
  font-size: 18px;
  font-weight: 800;
}

.info-list {
  display: grid;
  gap: 8px;
}

.info-list div {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  min-height: 28px;
  color: var(--text-secondary);
  font-size: 13px;
}

.info-list strong {
  color: var(--text-primary);
  font-weight: 600;
  text-align: right;
}

.area-actions {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 8px;
  margin-top: 16px;
}

.area-actions button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  width: 100%;
  min-width: 0;
  height: 36px;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.04);
  color: var(--text-primary);
  cursor: pointer;
  font-size: 12px;
  white-space: nowrap;
}

.area-actions button:hover {
  border-color: rgba(22, 119, 255, 0.7);
}

.area-actions :deep(.el-dropdown) {
  width: 100%;
}
</style>
