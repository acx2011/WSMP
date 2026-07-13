<script setup lang="ts">
import AppSidebar from '@/components/AppSidebar.vue'
import TopHeader from '@/components/TopHeader.vue'
</script>

<template>
  <div class="platform-shell">
    <AppSidebar />
    <main class="workspace">
      <TopHeader />
      <slot />
    </main>
  </div>
</template>

<style scoped lang="scss">
.platform-shell {
  display: flex;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background:
    radial-gradient(circle at 48% 24%, rgba(22, 119, 255, 0.12), transparent 30%),
    linear-gradient(180deg, #07111f, #050b15);
}

.workspace {
  display: flex;
  flex: 1;
  flex-direction: column;
  min-width: 0;
  min-height: 0;
}
</style>
