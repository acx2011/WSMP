<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus/es/components/message/index'
import { Plus, UserCog } from '@/icons/lucide'
import PlatformLayout from '@/components/PlatformLayout.vue'

const users = ref([
  { name: 'Admin', role: '系统管理员', status: '启用', lastLogin: '2026-07-13 13:50:20' },
  { name: 'Operator01', role: '值班员', status: '启用', lastLogin: '2026-07-13 09:12:11' },
  { name: 'Auditor', role: '审计员', status: '停用', lastLogin: '2026-07-10 17:42:03' },
])
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
          <button type="button" @click="ElMessage.info('新增用户弹窗开发中')">
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
          <button type="button" class="mini-btn" @click="ElMessage.info('权限矩阵开发中')">权限</button>
        </div>
      </section>
    </div>
  </PlatformLayout>
</template>
