type SecurityStatus = 'armed' | 'disarmed' | 'partially_disarmed' | 'alarm' | 'offline' | 'fault'

interface PersistedAreaSettings {
  id: string
  name: string
  status: SecurityStatus
  polygon?: string
}

interface KvNamespace {
  get(key: string, type: 'json'): Promise<unknown>
  put(key: string, value: string): Promise<void>
}

interface Env {
  WSMP_CONFIG?: KvNamespace
}

interface PagesContext {
  env: Env
  request: Request
}

const storageKey = 'security-area-settings'
const validIds = new Set(['building-1', 'building-2', 'building-3', 'building-4', 'guard', 'parking', 'perimeter', 'gate'])
const validStatuses = new Set<SecurityStatus>(['armed', 'disarmed', 'partially_disarmed', 'alarm', 'offline', 'fault'])

const jsonResponse = (body: unknown, status = 200) => new Response(JSON.stringify(body), {
  status,
  headers: {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
  },
})

const isAreaSettings = (value: unknown): value is PersistedAreaSettings => {
  if (!value || typeof value !== 'object') return false
  const candidate = value as Partial<PersistedAreaSettings>
  if (typeof candidate.id !== 'string' || !validIds.has(candidate.id)) return false
  if (typeof candidate.name !== 'string' || candidate.name.trim().length === 0 || candidate.name.length > 30) return false
  if (typeof candidate.status !== 'string' || !validStatuses.has(candidate.status as SecurityStatus)) return false
  if (typeof candidate.polygon !== 'string') return false

  const points = candidate.polygon.trim().split(/\s+/)
  return points.length >= 3 && points.every((point) => {
    const [xText, yText, extra] = point.split(',')
    const x = Number(xText)
    const y = Number(yText)
    return extra === undefined && Number.isFinite(x) && Number.isFinite(y) && x >= 0 && x <= 819 && y >= 0 && y <= 542
  })
}

export const onRequestGet = async ({ env }: PagesContext) => {
  if (!env.WSMP_CONFIG) return jsonResponse({ error: 'WSMP_CONFIG binding is not configured' }, 503)
  const areas = await env.WSMP_CONFIG.get(storageKey, 'json')
  return jsonResponse({ areas: Array.isArray(areas) ? areas : [] })
}

export const onRequestPut = async ({ env, request }: PagesContext) => {
  if (!env.WSMP_CONFIG) return jsonResponse({ error: 'WSMP_CONFIG binding is not configured' }, 503)

  let payload: unknown
  try {
    payload = await request.json()
  } catch {
    return jsonResponse({ error: 'Invalid JSON body' }, 400)
  }

  const areas = payload && typeof payload === 'object' ? (payload as { areas?: unknown }).areas : undefined
  if (!Array.isArray(areas) || areas.length === 0 || areas.length > validIds.size || !areas.every(isAreaSettings)) {
    return jsonResponse({ error: 'Invalid area settings' }, 400)
  }

  await env.WSMP_CONFIG.put(storageKey, JSON.stringify(areas))
  return jsonResponse({ saved: true, count: areas.length })
}
