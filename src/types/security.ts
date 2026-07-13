export type SecurityStatus =
  | 'armed'
  | 'disarmed'
  | 'partially_disarmed'
  | 'alarm'
  | 'offline'
  | 'fault'

export type AreaType = 'building' | 'floor' | 'external'

export type SecurityEventType = 'alarm' | 'arm' | 'disarm' | 'fault' | 'restore' | 'bypass'

export interface SecurityArea {
  id: string
  name: string
  type: AreaType
  status: SecurityStatus
  previousStatus?: SecurityStatus
  online: boolean
  totalZones: number
  alarmZones: number
  openZones: number
  lastOperator: string
  lastOperationTime: string
  position: {
    left: string
    top: string
  }
  polygon?: string
}

export interface SecurityEvent {
  id: string
  time: string
  type: SecurityEventType
  areaId: string
  areaName: string
  description: string
  operator: string
}

export interface StatusMeta {
  label: string
  color: string
}

export interface StatusStatistic {
  key: SecurityStatus
  label: string
  value: number
  color: string
}
