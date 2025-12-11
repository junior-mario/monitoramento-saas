export type MonitorType = "http" | "ping" | "tcp" | "ssl"

export type MonitorStatus = "unknown" | "up" | "down" | "degraded"

export interface Monitor {
  id: string
  name: string
  type: MonitorType
  target: string
  interval: number
  status: MonitorStatus
  lastCheckedAt?: string
  responseTimeMs?: number
  uptimePercent?: number
  createdAt: string
  agentId?: string
}

export interface Agent {
  id: string
  name: string
  description?: string
  apiKey: string
  status: "online" | "offline"
  lastSeenAt?: string
  monitors: string[]
  createdAt: string
  region?: string
}

export interface CheckResult {
  id: string
  monitorId: string
  status: MonitorStatus
  responseTimeMs: number
  statusCode?: number
  error?: string
  checkedAt: string
}

export interface Report {
  id: string
  name: string
  type: "uptime" | "response-time" | "incidents"
  period: "24h" | "7d" | "30d" | "custom"
  monitorIds: string[]
  createdAt: string
  data?: ReportData
}

export interface ReportData {
  summary: {
    avgUptime: number
    avgResponseTime: number
    totalIncidents: number
  }
  timeline: {
    date: string
    uptime: number
    responseTime: number
    incidents: number
  }[]
}