import { defineStore } from 'pinia'
import type { SecurityArea, SecurityEvent, SecurityEventType, SecurityStatus } from '@/types/security'

const nowText = () => {
  const date = new Date()
  const pad = (value: number) => String(value).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`
}

const makeEventId = () => `${Date.now()}-${Math.random().toString(16).slice(2)}`

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
    position: { left: '43%', top: '8.5%' },
    polygon: '281,75 438,68 468,123 432,203 282,197 255,132',
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
    position: { left: '76%', top: '23%' },
    polygon: '545,180 708,148 751,239 575,292 528,229',
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
    position: { left: '19%', top: '31%' },
    polygon: '102,196 242,170 326,317 168,366 83,261',
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
    position: { left: '84%', top: '50%' },
    polygon: '630,305 773,264 810,374 650,423 578,354',
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
    position: { left: '63%', top: '70%' },
    polygon: '434,350 526,337 587,398 480,425 415,389',
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
    position: { left: '15%', top: '89%' },
    polygon: '36,365 206,358 238,452 38,455',
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
    position: { left: '42%', top: '89%' },
    polygon: '257,384 398,380 434,442 287,460',
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
    position: { left: '77%', top: '85%' },
    polygon: '585,393 735,388 760,443 594,462',
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

interface SecurityState {
  areas: SecurityArea[]
  selectedAreaId: string
  events: SecurityEvent[]
  activeEventFilter: 'all' | SecurityEventType
  sidebarCollapsed: boolean
}

export const useSecurityStore = defineStore('security', {
  state: (): SecurityState => ({
    areas: structuredClone(initialAreas),
    selectedAreaId: 'floor-1',
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
      if (this.areas.some((area) => area.id === areaId)) this.selectedAreaId = areaId
    },
    updateAreaPolygon(areaId: string, polygon: string) {
      const area = this.areas.find((item) => item.id === areaId)
      if (area) area.polygon = polygon
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
