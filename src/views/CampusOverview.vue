<script setup lang="ts">
import CampusMap from '@/components/CampusMap.vue'
import CampusTabs from '@/components/CampusTabs.vue'
import CampusTree from '@/components/CampusTree.vue'
import PlatformLayout from '@/components/PlatformLayout.vue'
import QuickActions from '@/components/QuickActions.vue'
import RealtimeEvents from '@/components/RealtimeEvents.vue'
import SelectedAreaPanel from '@/components/SelectedAreaPanel.vue'
import StatusStatistics from '@/components/StatusStatistics.vue'
</script>

<template>
  <PlatformLayout>
    <div class="content-grid">
      <CampusTree />
      <section class="center-column">
        <CampusTabs />
        <CampusMap />
        <RealtimeEvents />
      </section>
      <aside class="right-column">
        <StatusStatistics />
        <QuickActions />
        <SelectedAreaPanel />
      </aside>
    </div>
  </PlatformLayout>
</template>

<style scoped lang="scss">
.content-grid {
  display: grid;
  grid-template-columns: clamp(194px, 12.5vw, 240px) minmax(420px, 1fr) clamp(286px, 17.7vw, 340px);
  gap: 14px;
  min-height: 0;
  padding: 14px;
  flex: 1;
}

.center-column,
.right-column {
  display: flex;
  min-height: 0;
  flex-direction: column;
  gap: 14px;
}

.right-column {
  overflow: hidden;
}

.right-column > :deep(.selected-panel) {
  flex: 1;
  min-height: 270px;
}

@media (max-width: 1500px) {
  .content-grid {
    gap: 10px;
    padding: 10px;
  }
}
</style>
