"use client"

import * as React from "react"
import type { Monitor } from "@/types/monitor"
import { MonitorStatusBadge } from "@/components/monitor-status-badge"

interface Props {
  monitors: Monitor[]
  tvMode?: boolean
}

export function MonitorsStatusWidget({ monitors, tvMode }: Props) {
  if (monitors.length === 0) {
    return <p className="text-muted-foreground">Nenhum monitor configurado</p>
  }

  return (
    <div className={`grid ${tvMode ? "gap-4 lg:grid-cols-3" : "gap-3 md:grid-cols-3"}`}>
      {monitors.map((m) => (
        <div
          key={m.id}
          className={`flex items-center justify-between rounded-lg border p-3 ${tvMode ? "lg:p-4" : ""}`}
        >
          <div className="min-w-0">
            <p className={`${tvMode ? "text-xl lg:text-2xl font-semibold" : "font-medium"}`}>{m.name}</p>
            <p className={`${tvMode ? "text-base lg:text-lg" : "text-sm"} text-muted-foreground truncate`}>
              {m.target}
            </p>
          </div>
          <div className="text-right">
            <div className={`${tvMode ? "scale-125 lg:scale-150" : ""} inline-block`}>
              <MonitorStatusBadge status={m.status} />
            </div>
            <p className={`${tvMode ? "text-base lg:text-lg" : "text-xs"} text-muted-foreground`}>
              {m.responseTimeMs ? `${m.responseTimeMs}ms` : "-"}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}