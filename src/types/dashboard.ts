export type ChartType = "line" | "bar" | "area" | "gauge" | "status-grid" | "stats-summary"

export interface MonitorGroup {
  id: string
  name: string
  color: string
  monitorIds: string[]
}

export interface WidgetLayout {
  x: number
  y: number
  w: number
  h: number
  minW?: number
  minH?: number
}

export interface DashboardWidget {
  id: string
  type: "chart" | "status" | "stats" | "group-status"
  chartType?: ChartType
  title: string
  layout: WidgetLayout
  monitorIds?: string[]
  groupId?: string
  config?: {
    showLegend?: boolean
    showLabels?: boolean
    refreshInterval?: number
  }
}

export interface Dashboard {
  id: string
  name: string
  createdAt: string
  widgets: DashboardWidget[]
  groups: MonitorGroup[]
  autoRefreshSec?: number
  columns?: number
  rowHeight?: number
}

// Legacy support
export type DashboardSize = 12 | 6 | 4
export type DashboardWidgetType = "stats-summary" | "monitors-status" | "agents-status"