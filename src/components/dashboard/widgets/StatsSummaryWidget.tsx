"use client"

import * as React from "react"
import type { Monitor, Agent } from "@/types/monitor"

interface Props {
  monitors: Monitor[]
  agents: Agent[]
  tvMode?: boolean
}

export function StatsSummaryWidget({ monitors, agents, tvMode }: Props) {
  const online = monitors.filter((m) => m.status === "up").length
  const offline = monitors.filter((m) => m.status === "down").length
  const avgResp = monitors.length
    ? Math.round(monitors.reduce((a, m) => a + (m.responseTimeMs ?? 0), 0) / monitors.length)
    : 0
  const agentsOnline = agents.filter((a) => a.status === "online").length

  const numClass = tvMode ? "text-4xl lg:text-6xl font-bold" : "text-2xl font-bold"
  const labelClass = tvMode ? "text-base lg:text-lg text-muted-foreground" : "text-xs text-muted-foreground"

  return (
    <div className={`grid ${tvMode ? "gap-6 lg:grid-cols-4" : "gap-4 md:grid-cols-4"}`}>
      <div>
        <div className={numClass}>{online}</div>
        <div className={labelClass}>Monitores Online</div>
      </div>
      <div>
        <div className={`${numClass} text-red-600`}>{offline}</div>
        <div className={labelClass}>Monitores Offline</div>
      </div>
      <div>
        <div className={numClass}>{avgResp}ms</div>
        <div className={labelClass}>Tempo de Resposta Médio</div>
      </div>
      <div>
        <div className={numClass}>{agentsOnline}/{agents.length}</div>
        <div className={labelClass}>Agentes Ativos</div>
      </div>
    </div>
  )
}