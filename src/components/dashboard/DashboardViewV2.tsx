"use client"

import * as React from "react"
import GridLayout, { WidthProvider } from "react-grid-layout"
import "react-grid-layout/css/styles.css"
import "react-resizable/css/styles.css"
import { Card } from "@/components/ui/card"
import type { Dashboard } from "@/types/dashboard"
import type { Monitor, Agent } from "@/types/monitor"
import { loadMonitors, loadAgents } from "@/lib/storage"
import { WidgetPreview } from "./WidgetPreview"

const ReactGridLayout = WidthProvider(GridLayout)

interface LayoutItem {
  i: string
  x: number
  y: number
  w: number
  h: number
  static?: boolean
}

interface Props {
  dashboard: Dashboard
  tvMode?: boolean
}

export function DashboardViewV2({ dashboard, tvMode = false }: Props) {
  const [monitors, setMonitors] = React.useState<Monitor[]>([])
  const [agents, setAgents] = React.useState<Agent[]>([])

  React.useEffect(() => {
    const refresh = () => {
      setMonitors(loadMonitors())
      setAgents(loadAgents())
    }
    refresh()
    const interval = setInterval(refresh, (dashboard.autoRefreshSec ?? 30) * 1000)
    return () => clearInterval(interval)
  }, [dashboard.autoRefreshSec])

  const layout: LayoutItem[] = dashboard.widgets.map((w) => ({
    i: w.id,
    x: w.layout.x,
    y: w.layout.y,
    w: w.layout.w,
    h: w.layout.h,
    static: true,
  }))

  const rowHeight = tvMode ? 100 : (dashboard.rowHeight || 80)
  const cols = dashboard.columns || 12

  return (
    <div className={`p-4 ${tvMode ? "md:p-6 lg:p-8" : ""}`}>
      {dashboard.widgets.length === 0 ? (
        <div className="flex items-center justify-center h-[400px] text-muted-foreground">
          <p>Este painel não possui widgets</p>
        </div>
      ) : (
        <ReactGridLayout
          className="layout"
          layout={layout as any}
          cols={cols}
          rowHeight={rowHeight}
          isDraggable={false}
          isResizable={false}
        >
          {dashboard.widgets.map((widget) => (
            <div key={widget.id}>
              <Card className={`h-full overflow-hidden ${tvMode ? "shadow-lg" : ""}`}>
                <div className={`px-3 py-2 border-b ${tvMode ? "bg-primary/10" : "bg-muted/50"}`}>
                  <span className={`font-medium ${tvMode ? "text-lg" : "text-sm"}`}>
                    {widget.title}
                  </span>
                </div>
                <div className={`p-3 h-[calc(100%-40px)] overflow-auto ${tvMode ? "p-4" : ""}`}>
                  <WidgetPreview
                    widget={widget}
                    monitors={monitors}
                    groups={dashboard.groups}
                  />
                </div>
              </Card>
            </div>
          ))}
        </ReactGridLayout>
      )}
    </div>
  )
}