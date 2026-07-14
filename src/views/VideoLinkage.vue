<script setup lang="ts">
import { computed, ref } from 'vue'
import { ElMessage } from 'element-plus/es/components/message/index'
import { MonitorPlay, PlayCircle, Video } from '@/icons/lucide'
import PlatformLayout from '@/components/PlatformLayout.vue'
import { useSecurityStore } from '@/stores/security'

interface Camera {
  name: string
  areaId: string
  channel: string
}

const store = useSecurityStore()
const cameras: Camera[] = [
  { name: '办公楼大厅摄像机', areaId: 'building-1', channel: 'CH-0101' },
  { name: '研发楼东侧摄像机', areaId: 'building-2', channel: 'CH-0203' },
  { name: '宿舍楼走廊摄像机', areaId: 'building-3', channel: 'CH-0308' },
  { name: '大门入口摄像机', areaId: 'gate', channel: 'CH-0501' },
]
const activeCamera = ref(cameras[0])
const replayVisible = ref(false)
const replayRows = computed(() => [
  { time: '2026-07-13 13:18:21', type: '报警联动', length: '02:30' },
  { time: '2026-07-13 12:00:00', type: '定时录像', length: '30:00' },
  { time: '2026-07-13 08:00:00', type: '布防巡检', length: '10:00' },
])

const openReplay = () => {
  replayVisible.value = true
}

const playReplay = (time: string) => {
  ElMessage.success(`${activeCamera.value.name} 回放已定位到 ${time}`)
}

const simulateVideoLinkage = () => {
  store.selectArea(activeCamera.value.areaId)
  store.triggerAlarm(activeCamera.value.areaId)
  ElMessage.success('已模拟视频联动报警')
}
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
          <button type="button" @click="openReplay">
            <MonitorPlay :size="17" />
            回放
          </button>
          <button type="button" @click="simulateVideoLinkage">
            <PlayCircle :size="17" />
            联动测试
          </button>
        </div>
      </section>

      <section class="video-grid">
        <aside class="panel camera-list">
          <button v-for="camera in cameras" :key="camera.channel" type="button" :class="{ active: activeCamera === camera }" @click="activeCamera = camera">
            <Video :size="16" />
            {{ camera.name }}
          </button>
        </aside>
        <div class="panel video-preview">
          <Video :size="64" />
          <strong>{{ activeCamera.name }}</strong>
          <span>{{ activeCamera.channel }} · Mock 视频画面占位 · 报警联动时自动切换</span>
        </div>
      </section>
    </div>

    <el-dialog v-model="replayVisible" title="录像回放" width="620px">
      <div class="replay-panel">
        <div class="replay-head">
          <strong>{{ activeCamera.name }}</strong>
          <span>{{ activeCamera.channel }}</span>
        </div>
        <div v-for="row in replayRows" :key="`${activeCamera.channel}-${row.time}`" class="replay-row">
          <span>{{ row.time }}</span>
          <span>{{ row.type }}</span>
          <span>{{ row.length }}</span>
          <button type="button" @click="playReplay(row.time)">播放</button>
        </div>
      </div>
    </el-dialog>
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

.replay-panel {
  display: grid;
  gap: 10px;
}

.replay-head,
.replay-row {
  display: grid;
  grid-template-columns: 1fr 120px 80px 70px;
  align-items: center;
  gap: 10px;
  border-bottom: 1px solid rgba(44, 68, 98, 0.5);
  padding: 10px 0;
}

.replay-head {
  grid-template-columns: 1fr auto;
  color: var(--text-primary);
}

.replay-head span,
.replay-row span {
  color: var(--text-secondary);
}

.replay-row button {
  height: 30px;
  border: 1px solid rgba(22, 119, 255, 0.55);
  border-radius: 8px;
  background: rgba(22, 119, 255, 0.14);
  color: var(--text-primary);
  cursor: pointer;
}
</style>
