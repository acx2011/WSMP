<script setup lang="ts">
import { useRouter } from 'vue-router'
import { Bell, Map, Save, Settings } from '@/icons/lucide'
import PlatformLayout from '@/components/PlatformLayout.vue'

const router = useRouter()
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
        <button class="panel config-card" type="button">
          <Bell :size="26" />
          <strong>报警规则</strong>
          <span>报警等级、声音和通知策略</span>
        </button>
        <button class="panel config-card" type="button">
          <Settings :size="26" />
          <strong>系统参数</strong>
          <span>平台名称、时间格式和默认策略</span>
        </button>
        <button class="panel config-card" type="button">
          <Save :size="26" />
          <strong>备份配置</strong>
          <span>导入导出当前 Mock 配置</span>
        </button>
      </section>
    </div>
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
</style>
