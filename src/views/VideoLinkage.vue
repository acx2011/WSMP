<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus/es/components/message/index'
import { MonitorPlay, Video } from '@/icons/lucide'
import PlatformLayout from '@/components/PlatformLayout.vue'

const cameras = ['办公楼大厅摄像机', '研发楼东侧摄像机', '宿舍楼走廊摄像机', '大门入口摄像机']
const activeCamera = ref(cameras[0])
</script>

<template>
  <PlatformLayout>
    <div class="module-page video-page">
      <section class="module-hero panel">
        <div>
          <span>Video Linkage</span>
          <h1>视频联动</h1>
        </div>
        <div class="hero-actions">
          <button type="button" @click="ElMessage.info('录像回放功能开发中')">
            <MonitorPlay :size="17" />
            回放
          </button>
        </div>
      </section>

      <section class="video-grid">
        <aside class="panel camera-list">
          <button v-for="camera in cameras" :key="camera" type="button" :class="{ active: activeCamera === camera }" @click="activeCamera = camera">
            <Video :size="16" />
            {{ camera }}
          </button>
        </aside>
        <div class="panel video-preview">
          <Video :size="64" />
          <strong>{{ activeCamera }}</strong>
          <span>Mock 视频画面占位 · 报警联动时自动切换</span>
        </div>
      </section>
    </div>
  </PlatformLayout>
</template>

<style scoped lang="scss">
.video-grid {
  display: grid;
  grid-template-columns: 280px minmax(0, 1fr);
  gap: 14px;
  min-height: 0;
}

.camera-list {
  display: grid;
  align-content: start;
  gap: 8px;
  padding: 16px;
}

.camera-list button {
  display: flex;
  align-items: center;
  gap: 8px;
  height: 40px;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.03);
  color: var(--text-secondary);
  cursor: pointer;
  padding: 0 12px;
}

.camera-list button.active,
.camera-list button:hover {
  border-color: rgba(22, 119, 255, 0.65);
  background: rgba(22, 119, 255, 0.16);
  color: var(--text-primary);
}

.video-preview {
  display: grid;
  place-items: center;
  align-content: center;
  min-height: 520px;
  color: var(--text-secondary);
  padding: 18px;
}

.video-preview svg {
  color: var(--primary);
}

.video-preview strong {
  margin-top: 18px;
  color: var(--text-primary);
  font-size: 22px;
}
</style>
