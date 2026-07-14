<script setup lang="ts">
import { reactive, ref } from 'vue'
import { ElMessage } from 'element-plus/es/components/message/index'
import { Plus, UserCog, UserPlus } from '@/icons/lucide'
import PlatformLayout from '@/components/PlatformLayout.vue'

interface UserRow {
  name: string
  role: string
  status: '启用' | '停用'
  lastLogin: string
  permissions: string[]
}

const users = ref<UserRow[]>([
  { name: 'Admin', role: '系统管理员', status: '启用', lastLogin: '2026-07-13 13:50:20' },
  { name: 'Operator01', role: '值班员', status: '启用', lastLogin: '2026-07-13 09:12:11' },
  { name: 'Auditor', role: '审计员', status: '停用', lastLogin: '2026-07-10 17:42:03' },
].map((user) => ({ ...user, permissions: user.role === '审计员' ? ['事件记录', '系统日志'] : ['园区总览', '报警监控', '布防管理', '事件记录'] })))

const createVisible = ref(false)
const permissionVisible = ref(false)
const activeUser = ref<UserRow | null>(null)
const newUser = reactive({
  name: '',
  role: '值班员',
  status: '启用' as UserRow['status'],
})
const permissionOptions = ['园区总览', '报警监控', '布防管理', '设备管理', '事件记录', '视频联动', '系统配置']

const openCreate = () => {
  newUser.name = ''
  newUser.role = '值班员'
  newUser.status = '启用'
  createVisible.value = true
}

const createUser = () => {
  if (!newUser.name.trim()) {
    ElMessage.warning('请输入用户名称')
    return
  }
  users.value.unshift({
    name: newUser.name.trim(),
    role: newUser.role,
    status: newUser.status,
    lastLogin: '尚未登录',
    permissions: ['园区总览', '报警监控'],
  })
  createVisible.value = false
  ElMessage.success('用户已新增')
}

const openPermissions = (user: UserRow) => {
  activeUser.value = user
  permissionVisible.value = true
}

const togglePermission = (permission: string) => {
  if (!activeUser.value) return
  const permissions = activeUser.value.permissions
  const index = permissions.indexOf(permission)
  if (index >= 0) permissions.splice(index, 1)
  else permissions.push(permission)
}

const savePermissions = () => {
  permissionVisible.value = false
  ElMessage.success('权限已保存')
}
</script>

<template>
  <PlatformLayout>
    <div class="module-page">
      <section class="module-hero panel">
        <div>
          <span>Identity & Access</span>
          <h1>用户与权限</h1>
        </div>
        <div class="hero-actions">
          <button type="button" @click="openCreate">
            <Plus :size="17" />
            新增用户
          </button>
        </div>
      </section>

      <section class="panel module-table">
        <div class="table-row table-head">
          <span>用户</span>
          <span>角色</span>
          <span>状态</span>
          <span>最近登录</span>
          <span>操作</span>
        </div>
        <div v-for="user in users" :key="user.name" class="table-row">
          <strong><UserCog :size="15" /> {{ user.name }}</strong>
          <span>{{ user.role }}</span>
          <span>{{ user.status }}</span>
          <span>{{ user.lastLogin }}</span>
          <div class="row-actions">
            <button type="button" @click="user.status = user.status === '启用' ? '停用' : '启用'">{{ user.status === '启用' ? '停用' : '启用' }}</button>
            <button type="button" class="mini-btn" @click="openPermissions(user)">权限</button>
          </div>
        </div>
      </section>
    </div>

    <el-dialog v-model="createVisible" title="新增用户" width="460px">
      <div class="user-form">
        <label>
          用户名
          <input v-model="newUser.name" placeholder="请输入用户名" />
        </label>
        <label>
          角色
          <select v-model="newUser.role">
            <option>系统管理员</option>
            <option>值班员</option>
            <option>审计员</option>
          </select>
        </label>
        <label>
          状态
          <select v-model="newUser.status">
            <option>启用</option>
            <option>停用</option>
          </select>
        </label>
      </div>
      <template #footer>
        <el-button @click="createVisible = false">取消</el-button>
        <el-button type="primary" @click="createUser">
          <UserPlus :size="15" />
          创建用户
        </el-button>
      </template>
    </el-dialog>

    <el-drawer v-model="permissionVisible" title="权限矩阵" size="420px">
      <div v-if="activeUser" class="permission-panel">
        <strong>{{ activeUser.name }} · {{ activeUser.role }}</strong>
        <label v-for="permission in permissionOptions" :key="permission">
          <input type="checkbox" :checked="activeUser.permissions.includes(permission)" @change="togglePermission(permission)" />
          {{ permission }}
        </label>
        <el-button type="primary" @click="savePermissions">保存权限</el-button>
      </div>
    </el-drawer>
  </PlatformLayout>
</template>

<style scoped lang="scss">
.user-form,
.permission-panel {
  display: grid;
  gap: 12px;
}

.user-form label {
  display: grid;
  grid-template-columns: 80px 1fr;
  align-items: center;
  gap: 12px;
  color: var(--text-secondary);
}

.user-form input,
.user-form select {
  height: 36px;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  outline: none;
  background: rgba(4, 12, 23, 0.75);
  color: var(--text-primary);
  padding: 0 10px;
}

.permission-panel strong {
  color: var(--text-primary);
}

.permission-panel label {
  display: flex;
  align-items: center;
  gap: 10px;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  color: var(--text-secondary);
  padding: 10px 12px;
}
</style>
