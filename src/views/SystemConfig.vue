<script setup lang="ts">
import { reactive, ref } from 'vue'
import { ElMessage } from 'element-plus/es/components/message/index'
import { useRouter } from 'vue-router'
import { Bell, Map, Save, Settings } from '@/icons/lucide'
import PlatformLayout from '@/components/PlatformLayout.vue'

const router = useRouter()
const activePanel = ref<'alarm' | 'system' | 'backup' | null>(null)
const alarmRule = reactive({
  level: '高',
  sound: true,
  notify: true,
  autoRestoreMinutes: 10,
})
const systemParams = reactive({
  platformName: 'WinPoint 安防管理平台',
  timeFormat: 'YYYY-MM-DD HH:mm:ss',
  defaultPolicy: '夜间布防',
})

const savePanel = () => {
  activePanel.value = null
  ElMessage.success('配置已保存到当前 Mock 会话')
}

const exportConfig = async () => {
  const payload = JSON.stringify({ alarmRule, systemParams, exportedAt: new Date().toISOString() }, null, 2)
  await navigator.clipboard?.writeText(payload).catch(() => undefined)
  ElMessage.success('Mock 配置已复制到剪贴板')
}

const importConfig = () => {
  ElMessage.success('已模拟导入配置并完成校验')
}
</script>

<template>
  <PlatformLayout>
    <div class="module-page">
      <section class="module-hero panel">
        <div>
          <span>System Settings</span>
          <h1>系统参数</h1>
        </div>
      </section>

      <section class="config-grid">
        <button class="panel config-card" type="button" @click="router.push('/system/map-outline-editor')">
          <Map :size="26" />
          <strong>地图轮廓编辑</strong>
          <span>维护园区 SVG polygon 坐标</span>
        </button>
        <button class="panel config-card" type="button" @click="activePanel = 'alarm'">
          <Bell :size="26" />
          <strong>报警规则</strong>
          <span>报警等级、声音和通知策略</span>
        </button>
        <button class="panel config-card" type="button" @click="activePanel = 'system'">
          <Settings :size="26" />
          <strong>系统参数</strong>
          <span>平台名称、时间格式和默认策略</span>
        </button>
        <button class="panel config-card" type="button" @click="activePanel = 'backup'">
          <Save :size="26" />
          <strong>备份配置</strong>
          <span>导入导出当前 Mock 配置</span>
        </button>
      </section>
    </div>

    <el-dialog
      :model-value="activePanel !== null"
      :title="activePanel === 'alarm' ? '报警规则' : activePanel === 'system' ? '系统参数' : '备份配置'"
      width="540px"
      @update:model-value="(visible: boolean) => { if (!visible) activePanel = null }"
    >
      <div v-if="activePanel === 'alarm'" class="config-form">
        <label>
          默认等级
          <select v-model="alarmRule.level">
            <option>高</option>
            <option>中</option>
            <option>低</option>
          </select>
        </label>
        <label>
          声音提醒
          <el-switch v-model="alarmRule.sound" />
        </label>
        <label>
          通知推送
          <el-switch v-model="alarmRule.notify" />
        </label>
        <label>
          自动恢复分钟
          <input v-model.number="alarmRule.autoRestoreMinutes" type="number" min="1" />
        </label>
      </div>
      <div v-else-if="activePanel === 'system'" class="config-form">
        <label>
          平台名称
          <input v-model="systemParams.platformName" />
        </label>
        <label>
          时间格式
          <input v-model="systemParams.timeFormat" />
        </label>
        <label>
          默认策略
          <select v-model="systemParams.defaultPolicy">
            <option>夜间布防</option>
            <option>全部布防</option>
            <option>人工确认</option>
          </select>
        </label>
      </div>
      <div v-else class="backup-actions">
        <button type="button" @click="exportConfig">导出 Mock 配置</button>
        <button type="button" @click="importConfig">导入 Mock 配置</button>
        <p>当前阶段不写入后端，导出会复制 JSON，导入执行前端校验模拟。</p>
      </div>
      <template #footer>
        <el-button @click="activePanel = null">关闭</el-button>
        <el-button v-if="activePanel !== 'backup'" type="primary" @click="savePanel">保存</el-button>
      </template>
    </el-dialog>
  </PlatformLayout>
</template>

<style scoped lang="scss">
.config-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 14px;
}

.config-card {
  display: grid;
  gap: 10px;
  min-height: 150px;
  border: 1px solid var(--border-color);
  color: var(--text-primary);
  cursor: pointer;
  padding: 18px;
  text-align: left;
}

.config-card svg {
  color: var(--primary);
}

.config-card span {
  color: var(--text-secondary);
}

.config-form,
.backup-actions {
  display: grid;
  gap: 14px;
}

.config-form label {
  display: grid;
  grid-template-columns: 110px 1fr;
  align-items: center;
  gap: 12px;
  color: var(--text-secondary);
}

.config-form input,
.config-form select {
  height: 36px;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  outline: none;
  background: rgba(4, 12, 23, 0.75);
  color: var(--text-primary);
  padding: 0 10px;
}

.backup-actions button {
  height: 38px;
  border: 1px solid rgba(22, 119, 255, 0.55);
  border-radius: 8px;
  background: rgba(22, 119, 255, 0.14);
  color: var(--text-primary);
  cursor: pointer;
}

.backup-actions p {
  margin: 0;
  color: var(--text-secondary);
}
</style>
