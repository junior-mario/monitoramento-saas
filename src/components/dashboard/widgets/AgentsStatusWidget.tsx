"use client"

import * as React from "react"
import type { Agent } from "@/types/monitor"

interface Props {
  agents: Agent[]
  tvMode?: boolean
}

export function AgentsStatusWidget({ agents, tvMode }: Props) {
  if (agents.length === 0) {
    return <p className="text-muted-foreground">Nenhum agente configurado</p>
  }

  return (
    <div className={`grid ${tvMode ? "gap-4 lg:grid-cols-3" : "gap-3 md:grid-cols-3"}`}>
      {agents.map((a) => (
        <div
          key={a.id}
          className={`flex items-center justify-between rounded-lg border p-3 ${tvMode ? "lg:p-4" : ""}`}
        >
          <div className="flex items-center gap-3">
            <div className={`h-3 w-3 rounded-full ${a.status === "online" ? "bg-green-500" : "bg-gray-400"}`} />
            <div>
              <p className={`${tvMode ? "text-xl lg:text-2xl font-semibold" : "font-medium"}`}>{a.name}</p>
              <p className={`${tvMode ? "text-base lg:text-lg" : "text-sm"} text-muted-foreground`}>
                {a.region || "Região não definida"}
              </p>
            </div>
          </div>
          <div className={`${tvMode ? "text-base lg:text-lg" : "text-sm"} text-muted-foreground`}>
            {a.monitors.length} monitores
          </div>
        </div>
      ))}
    </div>
  )
}