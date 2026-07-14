<script setup lang="ts">
import { reactive, ref } from 'vue'
import { ElMessage } from 'element-plus/es/components/message/index'
import { ElMessageBox } from 'element-plus/es/components/message-box/index'
import { CalendarClock, Plus } from '@/icons/lucide'
import PlatformLayout from '@/components/PlatformLayout.vue'
import { useSecurityStore } from '@/stores/security'

interface Schedule {
  id: string
  name: string
  areas: string
  time: string
  mode: string
  enabled: boolean
}

const store = useSecurityStore()
const schedules = ref<Schedule[]>([
  { id: 'S-001', name: '工作日夜间布防', areas: '办公楼、研发楼、仓库', time: '周一至周五 20:00', mode: '布防', enabled: true },
  { id: 'S-002', name: '清晨撤防计划', areas: '办公楼、研发楼', time: '周一至周五 07:30', mode: '撤防', enabled: true },
  { id: 'S-003', name: '周末园区布防', areas: '全园区可用区域', time: '周六 18:00', mode: '布防', enabled: false },
])
const dialogVisible = ref(false)
const editingId = ref<string | null>(null)
const form = reactive<Omit<Schedule, 'id'>>({
  name: '',
  areas: '',
  time: '',
  mode: '布防',
  enabled: true,
})

const resetForm = () => {
  editingId.value = null
  form.name = ''
  form.areas = '办公楼、研发楼、仓库'
  form.time = '周一至周五 20:00'
  form.mode = '布防'
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
  form.time = schedule.time
  form.mode = schedule.mode
  form.enabled = schedule.enabled
  dialogVisible.value = true
}

const saveSchedule = () => {
  if (!form.name.trim() || !form.areas.trim() || !form.time.trim()) {
    ElMessage.warning('请填写计划名称、区域和执行时间')
    return
  }
  if (editingId.value) {
    const target = schedules.value.find((item) => item.id === editingId.value)
    if (target) Object.assign(target, form)
    ElMessage.success('计划已更新')
  } else {
    schedules.value.unshift({ id: `S-${String(schedules.value.length + 1).padStart(3, '0')}`, ...form })
    store.addEvent('arm', store.selectedArea, `新增自动布防计划：${form.name}`)
    ElMessage.success('计划已新增')
  }
  dialogVisible.value = false
}

const executeSchedule = async (schedule: Schedule) => {
  await ElMessageBox.confirm(`确认立即执行“${schedule.name}”？`, '执行计划', { type: 'warning' })
  if (schedule.mode === '撤防') store.disarmAll()
  else store.nightArm()
  store.addEvent(schedule.mode === '撤防' ? 'disarm' : 'arm', store.selectedArea, `手动执行计划：${schedule.name}`)
  ElMessage.success('计划已执行')
}

const removeSchedule = async (schedule: Schedule) => {
  await ElMessageBox.confirm(`确认删除“${schedule.name}”？`, '删除计划', { type: 'warning' })
  schedules.value = schedules.value.filter((item) => item.id !== schedule.id)
  ElMessage.success('计划已删除')
}

const toggleSchedule = (schedule: Schedule) => {
  store.addEvent('restore', store.selectedArea, `${schedule.enabled ? '启用' : '停用'}自动计划：${schedule.name}`)
  ElMessage.success(schedule.enabled ? '计划已启用' : '计划已停用')
}
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
          <button type="button" @click="openCreate">
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
            <el-switch v-model="schedule.enabled" @change="toggleSchedule(schedule)" />
          </div>
          <p>{{ schedule.areas }}</p>
          <span>{{ schedule.time }} · {{ schedule.mode }}</span>
          <div class="row-actions">
            <button type="button" @click="executeSchedule(schedule)">立即执行</button>
            <button type="button" @click="openEdit(schedule)">编辑</button>
            <button type="button" @click="removeSchedule(schedule)">删除</button>
          </div>
        </article>
      </section>
    </div>

    <el-dialog v-model="dialogVisible" :title="editingId ? '编辑布防计划' : '新增布防计划'" width="520px">
      <div class="schedule-form">
        <label>
          计划名称
          <input v-model="form.name" placeholder="请输入计划名称" />
        </label>
        <label>
          目标区域
          <input v-model="form.areas" placeholder="例如：办公楼、研发楼、仓库" />
        </label>
        <label>
          执行时间
          <input v-model="form.time" placeholder="例如：周一至周五 20:00" />
        </label>
        <label>
          执行动作
          <select v-model="form.mode">
            <option>布防</option>
            <option>撤防</option>
          </select>
        </label>
        <label>
          是否启用
          <el-switch v-model="form.enabled" />
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

.row-actions {
  margin-top: 14px;
}

.schedule-form {
  display: grid;
  gap: 12px;
}

.schedule-form label {
  display: grid;
  grid-template-columns: 96px 1fr;
  align-items: center;
  gap: 12px;
  color: var(--text-secondary);
}

.schedule-form input,
.schedule-form select {
  height: 36px;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  outline: none;
  background: rgba(4, 12, 23, 0.75);
  color: var(--text-primary);
  padding: 0 10px;
}
</style>
