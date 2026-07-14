<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { ElMessage } from 'element-plus/es/components/message/index'
import { ElMessageBox } from 'element-plus/es/components/message-box/index'
import { CalendarClock, Edit3, PlayCircle, Plus, ShieldCheck, ShieldOff, Trash2 } from '@/icons/lucide'
import PlatformLayout from '@/components/PlatformLayout.vue'
import { useSecurityStore } from '@/stores/security'

type ScheduleMode = 'arm' | 'disarm'
type ScheduleFilter = 'all' | 'enabled' | 'disabled'

interface Schedule {
  id: string
  name: string
  areas: string
  repeat: string
  executionTime: string
  mode: ScheduleMode
  enabled: boolean
  nextRun: string
  lastRun: string
}

const store = useSecurityStore()
const schedules = ref<Schedule[]>([
  {
    id: 'S-001',
    name: '工作日夜间布防',
    areas: '1号办公楼、2号研发楼、4号仓库',
    repeat: '周一至周五',
    executionTime: '20:00',
    mode: 'arm',
    enabled: true,
    nextRun: '2026-07-14 20:00',
    lastRun: '2026-07-13 20:00',
  },
  {
    id: 'S-002',
    name: '工作日清晨撤防',
    areas: '1号办公楼、2号研发楼',
    repeat: '周一至周五',
    executionTime: '07:30',
    mode: 'disarm',
    enabled: true,
    nextRun: '2026-07-15 07:30',
    lastRun: '2026-07-14 07:30',
  },
  {
    id: 'S-003',
    name: '周末园区布防',
    areas: '全园区可用区域',
    repeat: '每周六、周日',
    executionTime: '18:00',
    mode: 'arm',
    enabled: false,
    nextRun: '停用',
    lastRun: '2026-07-12 18:00',
  },
  {
    id: 'S-004',
    name: '周界全天布防',
    areas: '停车场、围墙周界、大门入口',
    repeat: '每天',
    executionTime: '22:30',
    mode: 'arm',
    enabled: true,
    nextRun: '2026-07-14 22:30',
    lastRun: '2026-07-13 22:30',
  },
])

const activeFilter = ref<ScheduleFilter>('all')
const dialogVisible = ref(false)
const editingId = ref<string | null>(null)
const form = reactive<Omit<Schedule, 'id' | 'nextRun' | 'lastRun'>>({
  name: '',
  areas: '',
  repeat: '周一至周五',
  executionTime: '20:00',
  mode: 'arm',
  enabled: true,
})

const enabledCount = computed(() => schedules.value.filter((schedule) => schedule.enabled).length)
const armCount = computed(() => schedules.value.filter((schedule) => schedule.mode === 'arm').length)
const disarmCount = computed(() => schedules.value.filter((schedule) => schedule.mode === 'disarm').length)
const nextSchedule = computed(() => schedules.value.find((schedule) => schedule.enabled)?.nextRun ?? '暂无计划')
const filteredSchedules = computed(() => {
  if (activeFilter.value === 'all') return schedules.value
  return schedules.value.filter((schedule) => schedule.enabled === (activeFilter.value === 'enabled'))
})

const modeLabel = (mode: ScheduleMode) => mode === 'arm' ? '布防' : '撤防'

const resetForm = () => {
  editingId.value = null
  form.name = ''
  form.areas = '1号办公楼、2号研发楼、4号仓库'
  form.repeat = '周一至周五'
  form.executionTime = '20:00'
  form.mode = 'arm'
  form.enabled = true
}

const openCreate = () => {
  resetForm()
  dialogVisible.value = true
}

const openEdit = (schedule: Schedule) => {
  editingId.value = schedule.id
  form.name = schedule.name
  form.areas = schedule.areas
  form.repeat = schedule.repeat
  form.executionTime = schedule.executionTime
  form.mode = schedule.mode
  form.enabled = schedule.enabled
  dialogVisible.value = true
}

const nextScheduleId = () => {
  const maxId = schedules.value.reduce((max, schedule) => Math.max(max, Number(schedule.id.slice(2)) || 0), 0)
  return `S-${String(maxId + 1).padStart(3, '0')}`
}

const saveSchedule = () => {
  if (!form.name.trim() || !form.areas.trim() || !form.repeat.trim() || !form.executionTime.trim()) {
    ElMessage.warning('请完整填写计划名称、目标区域和执行周期')
    return
  }

  if (editingId.value) {
    const target = schedules.value.find((item) => item.id === editingId.value)
    if (target) Object.assign(target, form, { nextRun: form.enabled ? `按${form.repeat} ${form.executionTime}` : '停用' })
    ElMessage.success('自动计划已更新')
  } else {
    schedules.value.unshift({
      id: nextScheduleId(),
      ...form,
      nextRun: form.enabled ? `按${form.repeat} ${form.executionTime}` : '停用',
      lastRun: '尚未执行',
    })
    store.addEvent('arm', store.selectedArea, `新增自动布防计划：${form.name}`)
    ElMessage.success('自动计划已新增')
  }
  dialogVisible.value = false
}

const executeSchedule = async (schedule: Schedule) => {
  await ElMessageBox.confirm(`确认立即执行“${schedule.name}”？`, '执行自动计划', { type: 'warning' })
  if (schedule.mode === 'disarm') store.disarmAll()
  else store.nightArm()
  schedule.lastRun = new Date().toLocaleString('zh-CN', { hour12: false }).replaceAll('/', '-')
  store.addEvent(schedule.mode === 'disarm' ? 'disarm' : 'arm', store.selectedArea, `手动执行计划：${schedule.name}`)
  ElMessage.success('计划已执行')
}

const removeSchedule = async (schedule: Schedule) => {
  await ElMessageBox.confirm(`确认删除“${schedule.name}”？`, '删除自动计划', { type: 'warning' })
  schedules.value = schedules.value.filter((item) => item.id !== schedule.id)
  ElMessage.success('计划已删除')
}

const toggleSchedule = (schedule: Schedule) => {
  schedule.nextRun = schedule.enabled ? `按${schedule.repeat} ${schedule.executionTime}` : '停用'
  store.addEvent('restore', store.selectedArea, `${schedule.enabled ? '启用' : '停用'}自动计划：${schedule.name}`)
  ElMessage.success(schedule.enabled ? '计划已启用' : '计划已停用')
}
</script>

<template>
  <PlatformLayout>
    <div class="module-page schedule-page">
      <section class="schedule-toolbar panel">
        <div>
          <CalendarClock :size="21" />
          <div>
            <h1>自动布防计划</h1>
            <span>定时执行园区布防与撤防策略</span>
          </div>
        </div>
        <button class="create-button" type="button" @click="openCreate">
          <Plus :size="17" />
          新增计划
        </button>
      </section>

      <section class="schedule-summary panel" aria-label="计划状态概览">
        <div>
          <span>计划总数</span>
          <strong>{{ schedules.length }}</strong>
        </div>
        <div>
          <span>正在运行</span>
          <strong class="success">{{ enabledCount }}</strong>
        </div>
        <div>
          <span>布防 / 撤防</span>
          <strong>{{ armCount }} / {{ disarmCount }}</strong>
        </div>
        <div class="next-run">
          <span>最近执行</span>
          <strong>{{ nextSchedule }}</strong>
        </div>
      </section>

      <section class="schedule-list panel">
        <div class="list-toolbar">
          <div>
            <strong>计划列表</strong>
            <span>共 {{ filteredSchedules.length }} 项</span>
          </div>
          <div class="filter-tabs" role="tablist" aria-label="计划筛选">
            <button type="button" :class="{ active: activeFilter === 'all' }" @click="activeFilter = 'all'">全部</button>
            <button type="button" :class="{ active: activeFilter === 'enabled' }" @click="activeFilter = 'enabled'">运行中</button>
            <button type="button" :class="{ active: activeFilter === 'disabled' }" @click="activeFilter = 'disabled'">已停用</button>
          </div>
        </div>

        <div class="schedule-table">
          <div class="schedule-row table-header">
            <span>状态</span>
            <span>计划名称</span>
            <span>目标区域</span>
            <span>执行策略</span>
            <span>下次执行</span>
            <span>最近执行</span>
            <span>操作</span>
          </div>

          <div v-for="schedule in filteredSchedules" :key="schedule.id" class="schedule-row">
            <div class="enable-cell">
              <el-switch v-model="schedule.enabled" @change="toggleSchedule(schedule)" />
              <span :class="schedule.enabled ? 'enabled' : 'disabled'">{{ schedule.enabled ? '运行中' : '已停用' }}</span>
            </div>
            <div class="name-cell">
              <strong>{{ schedule.name }}</strong>
              <small>{{ schedule.id }}</small>
            </div>
            <span class="area-cell" :title="schedule.areas">{{ schedule.areas }}</span>
            <div class="strategy-cell">
              <span class="mode-pill" :class="schedule.mode">
                <ShieldCheck v-if="schedule.mode === 'arm'" :size="14" />
                <ShieldOff v-else :size="14" />
                {{ modeLabel(schedule.mode) }}
              </span>
              <small>{{ schedule.repeat }} {{ schedule.executionTime }}</small>
            </div>
            <span>{{ schedule.nextRun }}</span>
            <span>{{ schedule.lastRun }}</span>
            <div class="schedule-actions">
              <button class="run-button" type="button" title="立即执行" @click="executeSchedule(schedule)">
                <PlayCircle :size="15" />
                执行
              </button>
              <button type="button" title="编辑计划" aria-label="编辑计划" @click="openEdit(schedule)">
                <Edit3 :size="16" />
              </button>
              <button class="danger" type="button" title="删除计划" aria-label="删除计划" @click="removeSchedule(schedule)">
                <Trash2 :size="16" />
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>

    <el-dialog v-model="dialogVisible" :title="editingId ? '编辑自动计划' : '新增自动计划'" width="600px">
      <div class="schedule-form">
        <label class="full-width">
          <span>计划名称</span>
          <input v-model="form.name" maxlength="40" placeholder="请输入计划名称" />
        </label>
        <label class="full-width">
          <span>目标区域</span>
          <input v-model="form.areas" placeholder="例如：1号办公楼、2号研发楼" />
        </label>
        <label>
          <span>重复周期</span>
          <select v-model="form.repeat">
            <option>每天</option>
            <option>周一至周五</option>
            <option>每周六、周日</option>
            <option>仅执行一次</option>
          </select>
        </label>
        <label>
          <span>执行时间</span>
          <input v-model="form.executionTime" type="time" />
        </label>
        <label>
          <span>执行动作</span>
          <select v-model="form.mode">
            <option value="arm">布防</option>
            <option value="disarm">撤防</option>
          </select>
        </label>
        <label class="switch-field">
          <span>计划状态</span>
          <el-switch v-model="form.enabled" active-text="启用" inactive-text="停用" />
        </label>
      </div>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveSchedule">保存计划</el-button>
      </template>
    </el-dialog>
  </PlatformLayout>
</template>

<style scoped lang="scss">
.schedule-page {
  gap: 12px;
}

.schedule-toolbar {
  display: flex;
  min-height: 70px;
  align-items: center;
  justify-content: space-between;
  padding: 14px 18px;
}

.schedule-toolbar > div {
  display: flex;
  align-items: center;
  gap: 12px;
}

.schedule-toolbar svg {
  color: #6eb2ff;
}

.schedule-toolbar h1 {
  margin: 0 0 4px;
  font-size: 20px;
  letter-spacing: 0;
}

.schedule-toolbar span,
.list-toolbar span,
.schedule-summary span {
  color: var(--text-secondary);
  font-size: 12px;
}

.create-button {
  display: inline-flex;
  height: 36px;
  align-items: center;
  gap: 7px;
  border: 1px solid #1677ff;
  border-radius: 7px;
  background: #1268dc;
  color: #fff;
  cursor: pointer;
  padding: 0 14px;
}

.schedule-summary {
  display: grid;
  grid-template-columns: 150px 150px 180px minmax(260px, 1fr);
  min-height: 76px;
  padding: 0 18px;
}

.schedule-summary > div {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 6px;
  border-right: 1px solid rgba(44, 68, 98, 0.62);
  padding: 0 20px;
}

.schedule-summary > div:first-child {
  padding-left: 0;
}

.schedule-summary > div:last-child {
  border-right: 0;
}

.schedule-summary strong {
  font-size: 22px;
}

.schedule-summary strong.success {
  color: var(--armed);
}

.schedule-summary .next-run strong {
  color: #cfe2f8;
  font-size: 15px;
}

.schedule-list {
  display: flex;
  flex: 1;
  flex-direction: column;
  min-height: 0;
  overflow: hidden;
  padding: 0 16px 14px;
}

.list-toolbar {
  display: flex;
  min-height: 58px;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid rgba(44, 68, 98, 0.62);
}

.list-toolbar > div:first-child {
  display: flex;
  align-items: baseline;
  gap: 10px;
}

.filter-tabs {
  display: inline-flex;
  overflow: hidden;
  border: 1px solid var(--border-color);
  border-radius: 7px;
}

.filter-tabs button {
  min-width: 68px;
  height: 30px;
  border: 0;
  border-right: 1px solid var(--border-color);
  background: rgba(255, 255, 255, 0.025);
  color: var(--text-secondary);
  cursor: pointer;
}

.filter-tabs button:last-child {
  border-right: 0;
}

.filter-tabs button.active {
  background: rgba(22, 119, 255, 0.2);
  color: #85bdff;
}

.schedule-table {
  flex: 1;
  min-height: 0;
  overflow: auto;
}

.schedule-row {
  display: grid;
  grid-template-columns: 110px minmax(150px, 1fr) minmax(190px, 1.25fr) 180px 165px 165px 150px;
  min-width: 1240px;
  min-height: 66px;
  align-items: center;
  gap: 14px;
  border-bottom: 1px solid rgba(44, 68, 98, 0.46);
  color: var(--text-secondary);
  font-size: 13px;
  padding: 0 12px;
}

.schedule-row.table-header {
  position: sticky;
  z-index: 2;
  top: 0;
  min-height: 40px;
  background: #101d2e;
  color: #cfe2f8;
  font-weight: 700;
}

.enable-cell,
.strategy-cell,
.name-cell {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 5px;
}

.enable-cell {
  flex-direction: row;
  align-items: center;
  gap: 8px;
}

.enable-cell span.enabled {
  color: var(--armed);
}

.enable-cell span.disabled {
  color: var(--text-secondary);
}

.name-cell strong {
  color: var(--text-primary);
  font-size: 14px;
}

.name-cell small,
.strategy-cell small {
  color: #6f8195;
}

.area-cell {
  overflow: hidden;
  color: #d6e0ec;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.mode-pill {
  display: inline-flex;
  width: fit-content;
  align-items: center;
  gap: 5px;
  border-radius: 5px;
  padding: 3px 7px;
  font-weight: 700;
}

.mode-pill.arm {
  background: rgba(56, 178, 73, 0.14);
  color: #57c667;
}

.mode-pill.disarm {
  background: rgba(111, 129, 149, 0.16);
  color: #aebdcd;
}

.schedule-actions {
  display: flex;
  align-items: center;
  gap: 7px;
}

.schedule-actions button {
  display: inline-flex;
  width: 32px;
  height: 30px;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.035);
  color: var(--text-secondary);
  cursor: pointer;
}

.schedule-actions button.run-button {
  width: auto;
  border-color: rgba(22, 119, 255, 0.45);
  color: #80bdff;
  padding: 0 9px;
}

.schedule-actions button.danger:hover {
  border-color: rgba(229, 57, 53, 0.6);
  color: #ff7673;
}

.schedule-form {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
}

.schedule-form label {
  display: grid;
  gap: 7px;
  color: var(--text-secondary);
  font-size: 13px;
}

.schedule-form label.full-width {
  grid-column: 1 / -1;
}

.schedule-form input,
.schedule-form select {
  width: 100%;
  height: 38px;
  border: 1px solid var(--border-color);
  border-radius: 7px;
  outline: none;
  background: rgba(4, 12, 23, 0.75);
  color: var(--text-primary);
  padding: 0 10px;
}

.schedule-form input:focus,
.schedule-form select:focus {
  border-color: rgba(22, 119, 255, 0.75);
}

.switch-field {
  align-content: start;
}

@media (max-width: 1500px) {
  .schedule-summary {
    grid-template-columns: 130px 130px 160px minmax(220px, 1fr);
  }

  .schedule-row {
    grid-template-columns: 105px 160px 210px 175px 160px 160px 145px;
  }
}
</style>
