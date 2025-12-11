export type DashboardSize = 12 | 6 | 4

export type DashboardWidgetType = "stats-summary" | "monitors-status" | "agents-status"

export interface DashboardWidget {
  id: string
  type: DashboardWidgetType
  size: DashboardSize
  title?: string
}

export interface Dashboard {
  id: string
  name: string
  createdAt: string
  widgets: DashboardWidget[]
  autoRefreshSec?: number
}