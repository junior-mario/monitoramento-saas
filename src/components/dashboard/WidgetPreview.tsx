"use client"

import * as React from "react"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"
import type { DashboardWidget, MonitorGroup } from "@/types/dashboard"
import type { Monitor } from "@/types/monitor"
import { MonitorStatusBadge } from "@/components/monitor-status-badge"

interface Props {
  widget: DashboardWidget
  monitors: Monitor[]
  groups: MonitorGroup[]
}

export function WidgetPreview({ widget, monitors, groups }: Props) {
  const filteredMonitors = widget.monitorIds?.length
    ? monitors.filter((m) => widget.monitorIds?.includes(m.id))
    : widget.groupId
    ? monitors.filter((m) => groups.find((g) => g.id === widget.groupId)?.monitorIds.includes(m.id))
    : monitors

  // Generate mock chart data
  const chartData = React.useMemo(() => {
    return Array.from({ length: 12 }, (_, i) => ({
      time: `${i * 5}m`,
      value: Math.round(50 + Math.random() * 150),
      uptime: 95 + Math.random() * 5,
    }))
  }, [])

  if (widget.type === "stats") {
    const online = filteredMonitors.filter((m) => m.status === "up").length
    const offline = filteredMonitors.filter((m) => m.status === "down").length
    const avgResp = filteredMonitors.length
      ? Math.round(filteredMonitors.reduce((a, m) => a + (m.responseTimeMs ?? 0), 0) / filteredMonitors.length)
      : 0

    return (
      <div className="grid grid-cols-3 gap-4 text-center">
        <div>
          <div className="text-2xl font-bold text-green-600">{online}</div>
          <div className="text-xs text-muted-foreground">Online</div>
        </div>
        <div>
          <div className="text-2xl font-bold text-red-600">{offline}</div>
          <div className="text-xs text-muted-foreground">Offline</div>
        </div>
        <div>
          <div className="text-2xl font-bold">{avgResp}ms</div>
          <div className="text-xs text-muted-foreground">Média</div>
        </div>
      </div>
    )
  }

  if (widget.type === "status" || widget.type === "group-status") {
    const group = widget.groupId ? groups.find((g) => g.id === widget.groupId) : null

    return (
      <div className="space-y-2">
        {group && (
          <div className="flex items-center gap-2 mb-2">
            <div className="h-3 w-3 rounded-full" style={{ backgroundColor: group.color }} />
            <span className="text-sm font-medium">{group.name}</span>
          </div>
        )}
        {filteredMonitors.length === 0 ? (
          <p className="text-sm text-muted-foreground">Nenhum monitor</p>
        ) : (
          <div className="grid gap-2">
            {filteredMonitors.slice(0, 6).map((m) => (
              <div key={m.id} className="flex items-center justify-between text-sm">
                <span className="truncate">{m.name}</span>
                <MonitorStatusBadge status={m.status} />
              </div>
            ))}
            {filteredMonitors.length > 6 && (
              <p className="text-xs text-muted-foreground">+{filteredMonitors.length - 6} mais</p>
            )}
          </div>
        )}
      </div>
    )
  }

  if (widget.type === "chart") {
    const ChartComponent = widget.chartType === "bar" ? BarChart : widget.chartType === "area" ? AreaChart : LineChart
    const DataComponent = widget.chartType === "bar" ? Bar : widget.chartType === "area" ? Area : Line

    return (
      <div className="h-full min-h-[120px]">
        <ResponsiveContainer width="100%" height="100%">
          <ChartComponent data={chartData}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis dataKey="time" className="text-xs" />
            <YAxis className="text-xs" />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
              }}
            />
            <DataComponent
              type="monotone"
              dataKey="value"
              stroke="hsl(var(--primary))"
              fill="hsl(var(--primary))"
              fillOpacity={widget.chartType === "area" ? 0.3 : 1}
              strokeWidth={2}
            />
          </ChartComponent>
        </ResponsiveContainer>
      </div>
    )
  }

  return <p className="text-sm text-muted-foreground">Widget não suportado</p>
}