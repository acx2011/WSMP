<script setup lang="ts">
import { computed } from 'vue'
import { ShieldCheck } from '@/icons/lucide'
import { statusColors, statusLabels, useSecurityStore } from '@/stores/security'
import type { SecurityArea } from '@/types/security'

const store = useSecurityStore()
const mapAreas = computed(() => store.areas.filter((area) => area.type !== 'floor' && area.polygon))

const polygonCenter = (area: SecurityArea) => {
  const points = area.polygon?.split(' ').map((point) => {
    const [x, y] = point.split(',').map(Number)
    return { x, y }
  }) ?? []
  if (points.length === 0) return { x: 0, y: 0 }
  const sum = points.reduce(
    (total, point) => ({
      x: total.x + point.x,
      y: total.y + point.y,
    }),
    { x: 0, y: 0 },
  )
  return {
    x: Math.round(sum.x / points.length),
    y: Math.round(sum.y / points.length),
  }
}

const labelWidth = (area: SecurityArea) => Math.max(86, area.name.length * 13 + 30)
</script>

<template>
  <section class="campus-map panel">
    <div class="map-stage">
      <img src="@/assets/campus-overview.png" alt="园区可视化" />
      <svg
        class="campus-overlay"
        viewBox="0 0 819 542"
        preserveAspectRatio="xMidYMid meet"
        aria-label="园区建筑轮廓覆盖层"
      >
        <defs>
          <filter id="buildingGlow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <g
          v-for="area in mapAreas"
          :key="area.id"
          class="building-zone"
          :class="{
            selected: store.selectedAreaId === area.id,
            alarm: area.status === 'alarm',
          }"
          :style="{ '--zone-color': statusColors[area.status] }"
          role="button"
          tabindex="0"
          @click="store.selectArea(area.id)"
          @keydown.enter.prevent="store.selectArea(area.id)"
          @keydown.space.prevent="store.selectArea(area.id)"
        >
          <polygon
            class="outline-hit"
            :points="area.polygon"
            fill="transparent"
            pointer-events="all"
          />
          <polygon
            class="outline-glow"
            :points="area.polygon"
            fill="transparent"
            :stroke="statusColors[area.status]"
            filter="url(#buildingGlow)"
            vector-effect="non-scaling-stroke"
          />
          <polygon
            class="outline-main"
            :points="area.polygon"
            fill="transparent"
            :stroke="statusColors[area.status]"
            vector-effect="non-scaling-stroke"
          />
          <polygon
            v-if="store.selectedAreaId === area.id"
            class="outline-selected"
            :points="area.polygon"
            fill="transparent"
            :stroke="statusColors[area.status]"
            vector-effect="non-scaling-stroke"
          />

          <g class="svg-label" :transform="`translate(${polygonCenter(area).x}, ${polygonCenter(area).y - 38})`">
            <rect
              :x="-labelWidth(area) / 2"
              y="-22"
              :width="labelWidth(area)"
              height="44"
              rx="6"
              :stroke="statusColors[area.status]"
            />
            <ShieldCheck class="label-icon" :x="-labelWidth(area) / 2 + 10" y="-9" :size="14" />
            <text x="2" y="-4" text-anchor="middle">{{ area.name }}</text>
            <text class="status-text" x="2" y="14" text-anchor="middle">{{ statusLabels[area.status] }}</text>
          </g>
        </g>
      </svg>
    </div>
  </section>
</template>

<style scoped lang="scss">
.campus-map {
  display: flex;
  flex: 1;
  flex-direction: column;
  min-height: 0;
  padding: 0;
}

.map-stage {
  position: relative;
  flex: 1;
  min-height: 430px;
  overflow: hidden;
  border-radius: 8px;
  background: #07111f;
}

.map-stage::after {
  position: absolute;
  inset: 0;
  pointer-events: none;
  content: "";
  background:
    linear-gradient(rgba(22, 119, 255, 0.06) 1px, transparent 1px),
    linear-gradient(90deg, rgba(22, 119, 255, 0.06) 1px, transparent 1px);
  background-size: 42px 42px;
  mix-blend-mode: screen;
}

img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  opacity: 0.96;
}

.campus-overlay {
  position: absolute;
  inset: 0;
  z-index: 2;
  width: 100%;
  height: 100%;
}

.building-zone {
  --zone-color: #38b249;
  cursor: pointer;
  outline: none;
}

.outline-glow {
  stroke-width: 12;
  stroke-linejoin: round;
  opacity: 0.34;
  transition: opacity 0.22s ease, stroke-width 0.22s ease;
}

.outline-main {
  stroke-width: 2.4;
  stroke-linejoin: round;
  opacity: 0.96;
  transition: opacity 0.22s ease, stroke-width 0.22s ease;
}

.outline-selected {
  animation: selectedDash 7s linear infinite;
  stroke-dasharray: 12 10;
  stroke-linejoin: round;
  stroke-width: 3.2;
  opacity: 0.95;
}

.building-zone:hover .outline-glow,
.building-zone:focus-visible .outline-glow {
  stroke-width: 18;
  opacity: 0.58;
}

.building-zone:hover .outline-main,
.building-zone:focus-visible .outline-main {
  stroke-width: 3.8;
}

.building-zone.alarm .outline-glow {
  animation: alarmPulse 2.8s ease-in-out infinite;
}

.svg-label rect {
  fill: rgba(7, 17, 31, 0.78);
  stroke-width: 1.2;
}

.svg-label text {
  fill: var(--text-primary);
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0;
  pointer-events: none;
}

.svg-label .status-text {
  fill: var(--zone-color);
  font-size: 12px;
  font-weight: 600;
}

.label-icon {
  color: var(--zone-color);
}

@keyframes selectedDash {
  to {
    stroke-dashoffset: -176;
  }
}

@keyframes alarmPulse {
  0%,
  100% {
    opacity: 0.28;
    stroke-width: 12;
  }
  50% {
    opacity: 0.68;
    stroke-width: 18;
  }
}
</style>
