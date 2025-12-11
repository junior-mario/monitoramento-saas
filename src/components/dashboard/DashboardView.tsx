"use client"

import * as React from "react"
import type { Dashboard } from "@/types/dashboard"
import type { Monitor, Agent } from "@/types/monitor"
import { Card } from "@/components/ui/card"
import { loadMonitors, loadAgents } from "@/lib/storage"
import { StatsSummaryWidget } from "@/components/dashboard/widgets/StatsSummaryWidget"
import { MonitorsStatusWidget } from "@/components/dashboard/widgets/MonitorsStatusWidget"
import { AgentsStatusWidget } from "@/components/dashboard/widgets/AgentsStatusWidget"
import { WidgetPreview } from "./WidgetPreview"

interface Props {
  dashboard: Dashboard
  tvMode?: boolean
}

export function DashboardView({ dashboard, tvMode = false }: Props) {
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

  function colClass(w: number) {
    if (w >= 12) return "col-span-12"
    if (w >= 6) return "col-span-12 lg:col-span-6"
    return "col-span-12 lg:col-span-4"
  }

  return (
    <div className={`p-4 ${tvMode ? "md:p-6 lg:p-8" : ""}`}>
      <div className={`grid gap-4 grid-cols-12`}>
        {dashboard.widgets.map((widget) => (
          <Card key={widget.id} className={`${colClass(widget.layout.w)} ${tvMode ? "p-4 lg:p-6" : "p-4"}`}>
            {widget.title && (
              <div className={`mb-2 ${tvMode ? "text-xl lg:text-2xl font-semibold" : "text-sm font-medium text-muted-foreground"}`}>
                {widget.title}
              </div>
            )}
            {widget.type === "stats" && (
              <StatsSummaryWidget monitors={monitors} agents={agents} tvMode={tvMode} />
            )}
            {widget.type === "status" && (
              <MonitorsStatusWidget monitors={monitors} tvMode={tvMode} />
            )}
            {(widget.type === "chart" || widget.type === "group-status") && (
              <WidgetPreview widget={widget} monitors={monitors} groups={dashboard.groups} />
            )}
          </Card>
        ))}
      </div>
    </div>
  )
}