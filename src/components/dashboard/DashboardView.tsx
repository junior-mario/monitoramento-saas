"use client"

import * as React from "react"
import type { Dashboard } from "@/types/dashboard"
import type { Monitor, Agent } from "@/types/monitor"
import { Card } from "@/components/ui/card"
import { loadMonitors, loadAgents } from "@/lib/storage"
import { StatsSummaryWidget } from "@/components/dashboard/widgets/StatsSummaryWidget"
import { MonitorsStatusWidget } from "@/components/dashboard/widgets/MonitorsStatusWidget"
import { AgentsStatusWidget } from "@/components/dashboard/widgets/AgentsStatusWidget"

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

  function colClass(size: 12 | 6 | 4) {
    if (size === 12) return "col-span-12"
    if (size === 6) return "col-span-12 lg:col-span-6"
    return "col-span-12 lg:col-span-4"
  }

  return (
    <div className={`p-4 ${tvMode ? "md:p-6 lg:p-8" : ""}`}>
      <div className={`grid gap-4 grid-cols-12`}>
        {dashboard.widgets.map((w) => (
          <Card key={w.id} className={`${colClass(w.size)} ${tvMode ? "p-4 lg:p-6" : "p-4"}`}>
            {w.title && <div className={`mb-2 ${tvMode ? "text-xl lg:text-2xl font-semibold" : "text-sm font-medium text-muted-foreground"}`}>{w.title}</div>}
            {w.type === "stats-summary" && (
              <StatsSummaryWidget monitors={monitors} agents={agents} tvMode={tvMode} />
            )}
            {w.type === "monitors-status" && (
              <MonitorsStatusWidget monitors={monitors} tvMode={tvMode} />
            )}
            {w.type === "agents-status" && (
              <AgentsStatusWidget agents={agents} tvMode={tvMode} />
            )}
          </Card>
        ))}
      </div>
    </div>
  )
}