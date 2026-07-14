<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { ElMessage } from 'element-plus/es/components/message/index'
import { Copy, Download, MousePointer2, Plus, Save, Trash2, Upload } from '@/icons/lucide'
import PlatformLayout from '@/components/PlatformLayout.vue'
import { statusColors, statusLabels, useSecurityStore } from '@/stores/security'
import type { SecurityArea, SecurityStatus } from '@/types/security'

interface Point {
  x: number
  y: number
}

interface ActivePoint {
  areaId: string
  index: number
}

const viewBoxWidth = 819
const viewBoxHeight = 542
const store = useSecurityStore()
const svgRef = ref<SVGSVGElement>()
const activePoint = ref<ActivePoint | null>(null)
const polygonText = ref('')
const areaName = ref('')
const areaStatus = ref<SecurityStatus>('armed')
const saving = ref(false)
const importInputRef = ref<HTMLInputElement>()

const persistenceLabel = computed(() => ({
  loading: '正在连接云端',
  cloud: '云端已连接',
  local: '仅本机保存',
})[store.areaSettingsPersistence])

const statusOptions = (Object.entries(statusLabels) as [SecurityStatus, string][]).map(([value, label]) => ({ value, label }))

const editableAreas = computed(() => store.areas.filter((area) => area.type !== 'floor' && area.polygon))
const selectedEditableArea = computed(() => {
  const selected = editableAreas.value.find((area) => area.id === store.selectedAreaId)
  return selected ?? editableAreas.value[0]
})

const parsePolygon = (polygon = ''): Point[] =>
  polygon
    .split(' ')
    .map((point) => {
      const [x, y] = point.split(',').map(Number)
      return Number.isFinite(x) && Number.isFinite(y) ? { x, y } : null
    })
    .filter((point): point is Point => Boolean(point))

const stringifyPolygon = (points: Point[]) => points.map((point) => `${Math.round(point.x)},${Math.round(point.y)}`).join(' ')

const selectedPoints = computed(() => parsePolygon(selectedEditableArea.value?.polygon))

const svgPointFromEvent = (event: PointerEvent | MouseEvent): Point | null => {
  const svg = svgRef.value
  if (!svg) return null
  const point = svg.createSVGPoint()
  point.x = event.clientX
  point.y = event.clientY
  const matrix = svg.getScreenCTM()
  if (!matrix) return null
  const transformed = point.matrixTransform(matrix.inverse())
  return {
    x: Math.min(viewBoxWidth, Math.max(0, transformed.x)),
    y: Math.min(viewBoxHeight, Math.max(0, transformed.y)),
  }
}

const updateSelectedPolygon = (points: Point[]) => {
  const area = selectedEditableArea.value
  if (!area) return
  store.updateAreaPolygon(area.id, stringifyPolygon(points))
}

const beginDrag = (event: PointerEvent, areaId: string, index: number) => {
  event.preventDefault()
  event.stopPropagation()
  store.setActiveMap('overview', areaId)
  activePoint.value = { areaId, index }
  ;(event.currentTarget as SVGCircleElement).setPointerCapture(event.pointerId)
}

const dragPoint = (event: PointerEvent) => {
  if (!activePoint.value || activePoint.value.areaId !== selectedEditableArea.value?.id) return
  const point = svgPointFromEvent(event)
  if (!point) return
  const next = [...selectedPoints.value]
  next[activePoint.value.index] = point
  updateSelectedPolygon(next)
}

const endDrag = () => {
  activePoint.value = null
}

const addPoint = (event?: MouseEvent) => {
  const current = selectedPoints.value
  const point = event ? svgPointFromEvent(event) : null
  const fallback = current.length > 0 ? current[current.length - 1] : { x: viewBoxWidth / 2, y: viewBoxHeight / 2 }
  updateSelectedPolygon([...current, point ?? { x: fallback.x + 12, y: fallback.y + 12 }])
  ElMessage.success('已新增顶点')
}

const removePoint = (index: number) => {
  const current = selectedPoints.value
  if (current.length <= 3) {
    ElMessage.warning('轮廓至少需要 3 个顶点')
    return
  }
  updateSelectedPolygon(current.filter((_, pointIndex) => pointIndex !== index))
  ElMessage.success('已删除顶点')
}

const applyPolygonText = () => {
  const points = parsePolygon(polygonText.value)
  if (points.length < 3) {
    ElMessage.warning('polygon 坐标至少需要 3 个有效点')
    return
  }
  updateSelectedPolygon(points)
  ElMessage.success('轮廓预览已更新，请点击保存修改')
}

const saveChanges = async () => {
  const area = selectedEditableArea.value
  const points = parsePolygon(polygonText.value)
  if (!area) return
  if (!areaName.value.trim()) {
    ElMessage.warning('区域名称不能为空')
    return
  }
  if (points.length < 3) {
    ElMessage.warning('polygon 坐标至少需要 3 个有效点')
    return
  }

  saving.value = true
  try {
    const polygon = stringifyPolygon(points)
    const result = await store.saveAreaMapSettings(area.id, areaName.value, areaStatus.value, polygon)
    polygonText.value = polygon
    if (result === 'cloud') {
      ElMessage.success('地图轮廓、区域名称和布防状态已保存到云端')
    } else if (result === 'local') {
      ElMessage.warning('云端存储暂不可用，修改仅保存在当前浏览器')
    } else {
      ElMessage.error('保存失败，请稍后重试')
    }
  } finally {
    saving.value = false
  }
}

const copyPolygon = async () => {
  await navigator.clipboard.writeText(selectedEditableArea.value?.polygon ?? '')
  ElMessage.success('polygon 坐标已复制')
}

const exportSettings = () => {
  const contents = JSON.stringify(store.getPersistedAreaSettings(), null, 2)
  const url = URL.createObjectURL(new Blob([contents], { type: 'application/json' }))
  const link = document.createElement('a')
  link.href = url
  link.download = `winpoint-map-settings-${new Date().toISOString().slice(0, 10)}.json`
  link.click()
  URL.revokeObjectURL(url)
  ElMessage.success('全部地图配置已导出')
}

const importSettings = async (event: Event) => {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  input.value = ''
  if (!file) return

  saving.value = true
  try {
    const parsed = JSON.parse(await file.text()) as unknown
    const result = await store.importAreaMapSettings(parsed)
    if (result === 'failed') {
      ElMessage.error('配置文件格式无效，未导入任何修改')
      return
    }
    polygonText.value = selectedEditableArea.value?.polygon ?? ''
    areaName.value = selectedEditableArea.value?.name ?? ''
    areaStatus.value = selectedEditableArea.value?.status ?? 'armed'
    if (result === 'cloud') ElMessage.success('全部地图配置已导入并保存到云端')
    else ElMessage.warning('配置已导入，但云端不可用，仅保存在当前浏览器')
  } catch {
    ElMessage.error('无法读取配置文件，请选择有效的 JSON 文件')
  } finally {
    saving.value = false
  }
}

const selectArea = (area: SecurityArea) => {
  store.setActiveMap('overview', area.id)
}

watch(
  () => selectedEditableArea.value?.id,
  () => {
    polygonText.value = selectedEditableArea.value?.polygon ?? ''
    areaName.value = selectedEditableArea.value?.name ?? ''
    areaStatus.value = selectedEditableArea.value?.status ?? 'armed'
  },
  { immediate: true },
)

watch(
  () => selectedEditableArea.value?.polygon,
  (polygon) => {
    polygonText.value = polygon ?? ''
  },
)
</script>

<template>
  <PlatformLayout>
    <div class="editor-page">
      <aside class="editor-side panel">
        <div class="panel-title">
          <span>轮廓区域</span>
          <MousePointer2 :size="18" />
        </div>
        <div class="area-list">
          <button
            v-for="area in editableAreas"
            :key="area.id"
            type="button"
            class="area-item"
            :class="{ active: selectedEditableArea?.id === area.id }"
            @click="selectArea(area)"
          >
            <span class="status-dot" :style="{ background: statusColors[area.status] }"></span>
            <span>{{ area.name }}</span>
            <strong>{{ statusLabels[area.status] }}</strong>
          </button>
        </div>
      </aside>

      <section class="editor-canvas panel">
        <div class="editor-toolbar">
          <div>
            <strong>地图轮廓编辑</strong>
            <span>
              {{ selectedEditableArea?.name }} · {{ selectedPoints.length }} 个顶点
              <i class="sync-state" :class="store.areaSettingsPersistence">{{ persistenceLabel }}</i>
            </span>
          </div>
          <button type="button" @click="addPoint()">
            <Plus :size="16" />
            新增顶点
          </button>
          <button class="primary-action" type="button" :disabled="saving" @click="saveChanges">
            <Save :size="16" />
            {{ saving ? '正在保存' : '保存修改' }}
          </button>
        </div>

        <div class="map-editor-stage">
          <img src="@/assets/campus-overview.png" alt="园区底图" />
          <svg
            ref="svgRef"
            class="editor-overlay"
            :viewBox="`0 0 ${viewBoxWidth} ${viewBoxHeight}`"
            preserveAspectRatio="xMidYMid meet"
            @pointermove="dragPoint"
            @pointerup="endDrag"
            @pointerleave="endDrag"
            @dblclick="addPoint"
          >
            <g
              v-for="area in editableAreas"
              :key="area.id"
              class="editable-zone"
              :class="{ active: selectedEditableArea?.id === area.id }"
              :style="{ '--zone-color': statusColors[area.status] }"
              @click="selectArea(area)"
            >
              <polygon class="zone-fill" :points="area.polygon" />
              <polygon class="zone-line glow" :points="area.polygon" vector-effect="non-scaling-stroke" />
              <polygon class="zone-line main" :points="area.polygon" vector-effect="non-scaling-stroke" />
            </g>

            <g v-if="selectedEditableArea" class="vertex-layer">
              <circle
                v-for="(point, index) in selectedPoints"
                :key="`${selectedEditableArea.id}-${index}`"
                class="vertex"
                :cx="point.x"
                :cy="point.y"
                r="7"
                @pointerdown="beginDrag($event, selectedEditableArea.id, index)"
                @contextmenu.prevent="removePoint(index)"
              />
            </g>
          </svg>
        </div>
      </section>

      <aside class="editor-inspector panel">
        <div class="panel-title">坐标属性</div>
        <div class="field-group">
          <label>当前区域</label>
          <input v-model="areaName" class="field-control" maxlength="30" />
        </div>
        <div class="field-group">
          <label>布防状态</label>
          <select v-model="areaStatus" class="field-control">
            <option v-for="option in statusOptions" :key="option.value" :value="option.value">
              {{ option.label }}
            </option>
          </select>
        </div>
        <div class="field-group">
          <label>SVG viewBox</label>
          <code>0 0 {{ viewBoxWidth }} {{ viewBoxHeight }}</code>
        </div>
        <div class="field-group grow">
          <label>polygon 坐标</label>
          <textarea v-model="polygonText" spellcheck="false"></textarea>
        </div>
        <div class="inspector-actions">
          <button type="button" @click="applyPolygonText">
            <Save :size="16" />
            预览轮廓
          </button>
          <button type="button" @click="copyPolygon">
            <Copy :size="16" />
            复制
          </button>
          <button type="button" @click="exportSettings">
            <Download :size="16" />
            导出全部
          </button>
          <button type="button" @click="importInputRef?.click()">
            <Upload :size="16" />
            导入配置
          </button>
        </div>
        <input ref="importInputRef" class="file-input" type="file" accept="application/json,.json" @change="importSettings" />
        <div class="hint">
          <Trash2 :size="16" />
          拖动圆点调整坐标，双击地图新增顶点，右键顶点删除。
        </div>
      </aside>
    </div>
  </PlatformLayout>
</template>

<style scoped lang="scss">
.editor-page {
  display: grid;
  grid-template-columns: 250px minmax(560px, 1fr) 330px;
  gap: 14px;
  flex: 1;
  min-height: 0;
  padding: 14px;
}

.editor-side,
.editor-canvas,
.editor-inspector {
  min-height: 0;
  padding: 16px;
}

.area-list {
  display: grid;
  gap: 8px;
  margin-top: 14px;
}

.area-item {
  display: grid;
  grid-template-columns: 10px 1fr auto;
  align-items: center;
  gap: 10px;
  min-height: 38px;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.03);
  color: var(--text-secondary);
  cursor: pointer;
  padding: 0 10px;
}

.area-item:hover,
.area-item.active {
  border-color: rgba(22, 119, 255, 0.65);
  background: rgba(22, 119, 255, 0.16);
  color: var(--text-primary);
}

.area-item strong {
  font-size: 12px;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.editor-canvas {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.editor-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.editor-toolbar > div {
  margin-right: auto;
}

.editor-toolbar div {
  display: grid;
  gap: 4px;
}

.editor-toolbar strong {
  font-size: 18px;
}

.editor-toolbar span {
  color: var(--text-secondary);
  font-size: 13px;
}

.sync-state {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  margin-left: 10px;
  color: #e19a18;
  font-style: normal;
}

.sync-state::before {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: currentColor;
  content: "";
}

.sync-state.cloud {
  color: #57c667;
}

.sync-state.loading {
  color: #6eb2ff;
}

.editor-toolbar button,
.inspector-actions button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  height: 36px;
  border: 1px solid rgba(22, 119, 255, 0.55);
  border-radius: 8px;
  background: rgba(22, 119, 255, 0.15);
  color: var(--text-primary);
  cursor: pointer;
  padding: 0 14px;
}

.editor-toolbar button.primary-action {
  border-color: #1677ff;
  background: #1677ff;
}

.editor-toolbar button:disabled {
  cursor: wait;
  opacity: 0.62;
}

.map-editor-stage {
  position: relative;
  flex: 1;
  min-height: 0;
  overflow: hidden;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  background: #07111f;
}

.map-editor-stage img,
.editor-overlay {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}

.map-editor-stage img {
  object-fit: contain;
  opacity: 0.9;
}

.editor-overlay {
  z-index: 2;
}

.editable-zone {
  --zone-color: #38b249;
  cursor: pointer;
}

.zone-fill {
  fill: color-mix(in srgb, var(--zone-color), transparent 82%);
  stroke: transparent;
}

.zone-line {
  fill: transparent;
  stroke: var(--zone-color);
  stroke-linejoin: round;
}

.zone-line.glow {
  opacity: 0.24;
  stroke-width: 10;
}

.zone-line.main {
  opacity: 0.9;
  stroke-width: 2.2;
}

.editable-zone.active .zone-line.glow {
  opacity: 0.6;
  stroke-width: 16;
}

.editable-zone.active .zone-line.main {
  stroke-dasharray: 10 8;
  stroke-width: 3;
  animation: editorDash 6s linear infinite;
}

.vertex {
  fill: #f2f6fc;
  stroke: #1677ff;
  stroke-width: 2;
  cursor: grab;
}

.vertex:active {
  cursor: grabbing;
}

.editor-inspector {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.field-group {
  display: grid;
  gap: 8px;
}

.field-group.grow {
  flex: 1;
  min-height: 0;
}

label {
  color: var(--text-secondary);
  font-size: 13px;
}

code {
  color: #80bdff;
}

textarea {
  flex: 1;
  min-height: 220px;
  resize: none;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  outline: none;
  background: rgba(4, 12, 23, 0.72);
  color: var(--text-primary);
  line-height: 1.65;
  padding: 12px;
}

.field-control {
  width: 100%;
  height: 38px;
  box-sizing: border-box;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  outline: none;
  background: rgba(4, 12, 23, 0.72);
  color: var(--text-primary);
  padding: 0 11px;
}

.field-control:focus,
textarea:focus {
  border-color: rgba(22, 119, 255, 0.78);
}

.inspector-actions {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
}

.file-input {
  display: none;
}

.hint {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  color: var(--text-secondary);
  font-size: 12px;
  line-height: 1.6;
}

@keyframes editorDash {
  to {
    stroke-dashoffset: -144;
  }
}

@media (max-width: 1500px) {
  .editor-page {
    grid-template-columns: 220px minmax(480px, 1fr) 300px;
    gap: 10px;
    padding: 10px;
  }
}
</style>
