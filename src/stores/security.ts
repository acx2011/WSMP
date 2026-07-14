import { defineStore } from 'pinia'
import type { SecurityArea, SecurityEvent, SecurityEventType, SecurityStatus } from '@/types/security'

const nowText = () => {
  const date = new Date()
  const pad = (value: number) => String(value).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`
}

const makeEventId = () => `${Date.now()}-${Math.random().toString(16).slice(2)}`
const areaSettingsStorageKey = 'winpoint-security-area-settings'

export const statusLabels: Record<SecurityStatus, string> = {
  armed: '已布防',
  disarmed: '已撤防',
  partially_disarmed: '部分撤防',
  alarm: '报警',
  offline: '离线',
  fault: '故障',
}

export const statusColors: Record<SecurityStatus, string> = {
  armed: '#38b249',
  disarmed: '#6f8195',
  partially_disarmed: '#d7a800',
  alarm: '#e53935',
  offline: '#8b4bc2',
  fault: '#e19a18',
}

const initialAreas: SecurityArea[] = [
  {
    id: 'building-1',
    name: '1号办公楼',
    type: 'building',
    status: 'armed',
    online: true,
    totalZones: 32,
    alarmZones: 0,
    openZones: 0,
    lastOperator: 'Admin',
    lastOperationTime: '2026-07-13 13:20:00',
    position: { left: '45%', top: '14%' },
    polygon: '284,76 443,62 492,119 457,210 285,210 254,125',
    mapPolygons: {
      overview: '284,76 443,62 492,119 457,210 285,210 254,125',
      'building-1': '140,96 672,96 704,442 110,442',
    },
  },
  {
    id: 'building-2',
    name: '2号研发楼',
    type: 'building',
    status: 'partially_disarmed',
    online: true,
    totalZones: 28,
    alarmZones: 0,
    openZones: 2,
    lastOperator: 'Admin',
    lastOperationTime: '2026-07-13 12:44:18',
    position: { left: '72%', top: '25%' },
    polygon: '545,177 690,158 729,238 566,295 510,226',
    mapPolygons: {
      overview: '545,177 690,158 729,238 566,295 510,226',
      'building-2': '114,126 708,126 728,432 92,432',
    },
  },
  {
    id: 'building-3',
    name: '3号宿舍楼',
    type: 'building',
    status: 'alarm',
    previousStatus: 'armed',
    online: true,
    totalZones: 24,
    alarmZones: 1,
    openZones: 1,
    lastOperator: '系统',
    lastOperationTime: '2026-07-13 13:18:21',
    position: { left: '21%', top: '36%' },
    polygon: '96,188 247,165 312,292 156,349 77,248',
    mapPolygons: {
      overview: '96,188 247,165 312,292 156,349 77,248',
      'building-3': '116,128 698,128 730,418 88,418',
    },
  },
  {
    id: 'building-4',
    name: '4号仓库',
    type: 'building',
    status: 'disarmed',
    online: true,
    totalZones: 18,
    alarmZones: 0,
    openZones: 3,
    lastOperator: 'Admin',
    lastOperationTime: '2026-07-13 11:09:52',
    position: { left: '80%', top: '54%' },
    polygon: '574,304 731,281 776,375 598,430 536,355',
    mapPolygons: {
      overview: '574,304 731,281 776,375 598,430 536,355',
      'building-4': '102,150 716,150 742,410 78,410',
    },
  },
  {
    id: 'guard',
    name: '5号门卫室',
    type: 'building',
    status: 'offline',
    online: false,
    totalZones: 8,
    alarmZones: 0,
    openZones: 0,
    lastOperator: '系统',
    lastOperationTime: '2026-07-13 10:31:05',
    position: { left: '59%', top: '79%' },
    polygon: '430,423 540,412 584,466 456,500 400,456',
    mapPolygons: {
      overview: '430,423 540,412 584,466 456,500 400,456',
      external: '568,272 714,272 744,386 552,398',
    },
  },
  {
    id: 'parking',
    name: '停车场',
    type: 'external',
    status: 'armed',
    online: true,
    totalZones: 14,
    alarmZones: 0,
    openZones: 0,
    lastOperator: 'Admin',
    lastOperationTime: '2026-07-13 08:00:00',
    position: { left: '20%', top: '74%' },
    polygon: '92,370 282,360 320,461 82,474',
    mapPolygons: {
      overview: '92,370 282,360 320,461 82,474',
      external: '92,120 356,120 378,286 72,300',
    },
  },
  {
    id: 'perimeter',
    name: '围墙周界',
    type: 'external',
    status: 'armed',
    online: true,
    totalZones: 36,
    alarmZones: 0,
    openZones: 0,
    lastOperator: 'Admin',
    lastOperationTime: '2026-07-13 08:00:00',
    position: { left: '44%', top: '80%' },
    polygon: '286,382 450,372 492,438 314,464',
    mapPolygons: {
      overview: '286,382 450,372 492,438 314,464',
      external: '74,322 746,316 760,386 58,396',
    },
  },
  {
    id: 'gate',
    name: '大门入口',
    type: 'external',
    status: 'armed',
    online: true,
    totalZones: 10,
    alarmZones: 0,
    openZones: 0,
    lastOperator: 'Admin',
    lastOperationTime: '2026-07-13 08:00:00',
    position: { left: '68%', top: '84%' },
    polygon: '486,426 620,418 656,482 492,510',
    mapPolygons: {
      overview: '486,426 620,418 656,482 492,510',
      external: '384,126 532,126 552,272 372,286',
    },
  },
  {
    id: 'floor-1',
    name: '1层',
    type: 'floor',
    status: 'armed',
    online: true,
    totalZones: 8,
    alarmZones: 0,
    openZones: 0,
    lastOperator: 'Admin',
    lastOperationTime: '2026-07-13 13:20:00',
    position: { left: '33%', top: '44%' },
    mapPolygons: {
      'building-1': '156,330 654,330 680,426 132,426',
      'floor-1': '96,118 716,118 742,420 74,420',
    },
  },
  {
    id: 'floor-2',
    name: '2层',
    type: 'floor',
    status: 'armed',
    online: true,
    totalZones: 8,
    alarmZones: 0,
    openZones: 0,
    lastOperator: 'Admin',
    lastOperationTime: '2026-07-13 13:20:00',
    position: { left: '33%', top: '38%' },
    mapPolygons: {
      'building-1': '164,252 646,252 670,322 140,322',
      'floor-2': '96,118 716,118 742,420 74,420',
    },
  },
  {
    id: 'floor-3',
    name: '3层',
    type: 'floor',
    status: 'armed',
    online: true,
    totalZones: 8,
    alarmZones: 0,
    openZones: 0,
    lastOperator: 'Admin',
    lastOperationTime: '2026-07-13 13:20:00',
    position: { left: '33%', top: '32%' },
    mapPolygons: {
      'building-1': '172,174 638,174 660,244 148,244',
      'floor-3': '96,118 716,118 742,420 74,420',
    },
  },
  {
    id: 'floor-4',
    name: '4层',
    type: 'floor',
    status: 'armed',
    online: true,
    totalZones: 8,
    alarmZones: 0,
    openZones: 0,
    lastOperator: 'Admin',
    lastOperationTime: '2026-07-13 13:20:00',
    position: { left: '33%', top: '26%' },
    mapPolygons: {
      'building-1': '180,100 630,100 650,166 156,166',
      'floor-4': '96,118 716,118 742,420 74,420',
    },
  },
]

const initialEvents: SecurityEvent[] = [
  {
    id: 'event-1',
    time: '2026-07-13 13:18:21',
    type: 'alarm',
    areaId: 'building-3',
    areaName: '3号宿舍楼',
    description: '3层东侧走廊红外探测器触发报警',
    operator: '系统',
  },
  {
    id: 'event-2',
    time: '2026-07-13 13:10:08',
    type: 'arm',
    areaId: 'building-1',
    areaName: '1号办公楼',
    description: '布防成功',
    operator: 'Admin',
  },
  {
    id: 'event-3',
    time: '2026-07-13 12:44:18',
    type: 'disarm',
    areaId: 'building-2',
    areaName: '2号研发楼',
    description: '研发楼西侧实验区撤防',
    operator: 'Admin',
  },
  {
    id: 'event-4',
    time: '2026-07-13 11:20:35',
    type: 'fault',
    areaId: 'guard',
    areaName: '5号门卫室',
    description: '门卫室通讯链路中断',
    operator: '系统',
  },
  {
    id: 'event-5',
    time: '2026-07-13 10:15:42',
    type: 'restore',
    areaId: 'perimeter',
    areaName: '围墙周界',
    description: '周界北段防区恢复正常',
    operator: '系统',
  },
]

interface PersistedAreaSettings {
  id: string
  name: string
  status: SecurityStatus
  polygon?: string
}

const loadAreas = (): SecurityArea[] => {
  const areas = structuredClone(initialAreas)
  if (typeof window === 'undefined') return areas

  try {
    const saved = JSON.parse(window.localStorage.getItem(areaSettingsStorageKey) ?? '[]') as PersistedAreaSettings[]
    saved.forEach((settings) => {
      const area = areas.find((item) => item.id === settings.id)
      if (!area) return
      area.name = settings.name
      area.status = settings.status
      area.online = settings.status !== 'offline'
      area.alarmZones = settings.status === 'alarm' ? Math.max(1, area.alarmZones) : 0
      area.openZones = settings.status === 'disarmed' || settings.status === 'partially_disarmed' ? Math.max(1, area.openZones) : 0
      if (settings.polygon) {
        area.polygon = settings.polygon
        area.mapPolygons = { ...area.mapPolygons, overview: settings.polygon }
      }
    })
  } catch {
    window.localStorage.removeItem(areaSettingsStorageKey)
  }

  return areas
}

interface SecurityState {
  areas: SecurityArea[]
  selectedAreaId: string
  activeMapId: string
  events: SecurityEvent[]
  activeEventFilter: 'all' | SecurityEventType
  sidebarCollapsed: boolean
}

const mapIdForArea = (area: SecurityArea) => {
  if (area.type === 'floor') return area.id
  if (area.type === 'external' || area.id === 'guard') return 'external'
  return area.id
}

export const useSecurityStore = defineStore('security', {
  state: (): SecurityState => ({
    areas: loadAreas(),
    selectedAreaId: 'floor-1',
    activeMapId: 'overview',
    events: structuredClone(initialEvents),
    activeEventFilter: 'all',
    sidebarCollapsed: false,
  }),
  getters: {
    selectedArea: (state) => state.areas.find((area) => area.id === state.selectedAreaId) ?? state.areas[0],
    statusStatistics: (state) => [
      { key: 'armed' as const, label: '已布防', value: state.areas.filter((area) => area.status === 'armed').length, color: statusColors.armed },
      { key: 'disarmed' as const, label: '已撤防', value: state.areas.filter((area) => area.status === 'disarmed').length, color: statusColors.disarmed },
      { key: 'partially_disarmed' as const, label: '部分撤防', value: state.areas.filter((area) => area.status === 'partially_disarmed').length, color: statusColors.partially_disarmed },
      { key: 'alarm' as const, label: '报警中', value: state.areas.filter((area) => area.status === 'alarm').length, color: statusColors.alarm },
      { key: 'offline' as const, label: '离线设备', value: state.areas.filter((area) => area.status === 'offline').length, color: statusColors.offline },
      { key: 'fault' as const, label: '故障设备', value: state.areas.filter((area) => area.status === 'fault').length, color: statusColors.fault },
    ],
    filteredEvents: (state) => {
      if (state.activeEventFilter === 'all') return state.events
      return state.events.filter((event) => event.type === state.activeEventFilter)
    },
  },
  actions: {
    selectArea(areaId: string) {
      const area = this.areas.find((item) => item.id === areaId)
      if (area) {
        this.selectedAreaId = areaId
        this.activeMapId = mapIdForArea(area)
      }
    },
    setActiveMap(mapId: string, selectedAreaId?: string) {
      this.activeMapId = mapId
      if (selectedAreaId && this.areas.some((area) => area.id === selectedAreaId)) this.selectedAreaId = selectedAreaId
    },
    updateAreaPolygon(areaId: string, polygon: string) {
      const area = this.areas.find((item) => item.id === areaId)
      if (!area) return
      area.polygon = polygon
      area.mapPolygons = { ...area.mapPolygons, overview: polygon }
    },
    saveAreaMapSettings(areaId: string, name: string, status: SecurityStatus, polygon: string) {
      const area = this.areas.find((item) => item.id === areaId)
      if (!area) return false

      area.name = name.trim()
      area.status = status
      area.online = status !== 'offline'
      area.alarmZones = status === 'alarm' ? Math.max(1, area.alarmZones) : 0
      area.openZones = status === 'disarmed' || status === 'partially_disarmed' ? Math.max(1, area.openZones) : 0
      area.lastOperator = 'Admin'
      area.lastOperationTime = nowText()
      this.updateAreaPolygon(areaId, polygon)

      const settings: PersistedAreaSettings[] = this.areas
        .filter((item) => item.type !== 'floor' && item.polygon)
        .map((item) => ({ id: item.id, name: item.name, status: item.status, polygon: item.polygon }))
      try {
        window.localStorage.setItem(areaSettingsStorageKey, JSON.stringify(settings))
        return true
      } catch {
        return false
      }
    },
    setEventFilter(filter: 'all' | SecurityEventType) {
      this.activeEventFilter = filter
    },
    toggleSidebar() {
      this.sidebarCollapsed = !this.sidebarCollapsed
    },
    addEvent(type: SecurityEventType, area: SecurityArea, description: string, operator = 'Admin') {
      this.events.unshift({
        id: makeEventId(),
        time: nowText(),
        type,
        areaId: area.id,
        areaName: area.name,
        description,
        operator,
      })
    },
    updateAreaStatus(areaId: string, status: SecurityStatus, eventType: SecurityEventType, description: string, operator = 'Admin') {
      const area = this.areas.find((item) => item.id === areaId)
      if (!area || area.status === 'offline') return
      if (status === 'alarm') area.previousStatus = area.status
      area.status = status
      area.online = status !== 'offline'
      area.alarmZones = status === 'alarm' ? Math.max(1, area.alarmZones) : 0
      area.openZones = status === 'disarmed' || status === 'partially_disarmed' ? Math.max(1, area.openZones) : 0
      area.lastOperator = operator
      area.lastOperationTime = nowText()
      this.addEvent(eventType, area, description, operator)
    },
    armArea(areaId: string) {
      this.updateAreaStatus(areaId, 'armed', 'arm', '布防成功')
    },
    disarmArea(areaId: string) {
      this.updateAreaStatus(areaId, 'disarmed', 'disarm', '撤防成功')
    },
    bypassArea(areaId: string, reason: string) {
      this.updateAreaStatus(areaId, 'partially_disarmed', 'bypass', `旁路成功：${reason}`)
    },
    triggerAlarm(areaId: string) {
      this.updateAreaStatus(areaId, 'alarm', 'alarm', '模拟报警触发')
    },
    restoreArea(areaId: string) {
      const area = this.areas.find((item) => item.id === areaId)
      if (!area || area.status === 'offline') return
      const targetStatus = area.previousStatus && area.previousStatus !== 'alarm' ? area.previousStatus : 'armed'
      this.updateAreaStatus(areaId, targetStatus, 'restore', '区域恢复正常')
    },
    armAll() {
      this.areas.filter((area) => area.status !== 'offline').forEach((area) => {
        area.status = 'armed'
        area.alarmZones = 0
        area.openZones = 0
        area.lastOperator = 'Admin'
        area.lastOperationTime = nowText()
      })
      this.addEvent('arm', this.selectedArea, '全部可用区域布防成功')
    },
    disarmAll() {
      this.areas.filter((area) => area.status !== 'offline').forEach((area) => {
        area.status = 'disarmed'
        area.alarmZones = 0
        area.openZones = Math.max(1, area.openZones)
        area.lastOperator = 'Admin'
        area.lastOperationTime = nowText()
      })
      this.addEvent('disarm', this.selectedArea, '全部可用区域撤防成功')
    },
    nightArm() {
      const ids = new Set(['building-1', 'building-2', 'building-3', 'building-4'])
      this.areas.filter((area) => ids.has(area.id) && area.status !== 'offline').forEach((area) => {
        area.status = 'armed'
        area.alarmZones = 0
        area.openZones = 0
        area.lastOperator = 'Admin'
        area.lastOperationTime = nowText()
      })
      this.addEvent('arm', this.selectedArea, '夜间布防计划执行成功')
    },
    emergencyDisarm() {
      this.areas.filter((area) => area.status !== 'offline').forEach((area) => {
        area.status = 'disarmed'
        area.alarmZones = 0
        area.openZones = Math.max(1, area.openZones)
        area.lastOperator = 'Admin'
        area.lastOperationTime = nowText()
      })
      this.addEvent('disarm', this.selectedArea, '紧急撤防执行成功')
    },
  },
})
