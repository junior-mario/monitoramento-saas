export type MonitorType = "http" | "ping"

export type MonitorStatus = "unknown" | "up" | "down"

export interface Monitor {
  id: string
  name: string
  type: MonitorType
  target: string
  interval: number // em segundos
  status: MonitorStatus
  lastCheckedAt?: string
  responseTimeMs?: number
}