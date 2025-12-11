"use client"

import * as React from "react"
import Link from "next/link"
import { Activity, Server, AlertTriangle, Clock, Plus } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { StatsCard } from "@/components/stats-card"
import { MonitorStatusBadge } from "@/components/monitor-status-badge"
import { loadMonitors, loadAgents } from "@/lib/storage"
import type { Monitor, Agent } from "@/types/monitor"

export default function DashboardPage() {
  const [monitors, setMonitors] = React.useState<Monitor[]>([])
  const [agents, setAgents] = React.useState<Agent[]>([])

  React.useEffect(() => {
    setMonitors(loadMonitors())
    setAgents(loadAgents())
  }, [])

  const onlineMonitors = monitors.filter((m) => m.status === "up").length
  const offlineMonitors = monitors.filter((m) => m.status === "down").length
  const avgUptime = monitors.length > 0
    ? (monitors.reduce((acc, m) => acc + (m.uptimePercent ?? 100), 0) / monitors.length).toFixed(1)
    : "100"
  const avgResponseTime = monitors.length > 0
    ? Math.round(monitors.reduce((acc, m) => acc + (m.responseTimeMs ?? 0), 0) / monitors.length)
    : 0

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Dashboard</h1>
          <p className="text-muted-foreground">
            Visão geral do seu monitoramento
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/dashboard/monitors/new">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Novo Monitor
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Monitores Online"
          value={onlineMonitors}
          description={`de ${monitors.length} total`}
          icon={Activity}
          trend="up"
          trendValue={monitors.length > 0 ? `${((onlineMonitors / monitors.length) * 100).toFixed(0)}%` : "0%"}
        />
        <StatsCard
          title="Monitores Offline"
          value={offlineMonitors}
          description="requerem atenção"
          icon={AlertTriangle}
          trend={offlineMonitors > 0 ? "down" : "neutral"}
        />
        <StatsCard
          title="Uptime Médio"
          value={`${avgUptime}%`}
          description="últimas 24h"
          icon={Clock}
        />
        <StatsCard
          title="Agentes Ativos"
          value={agents.filter((a) => a.status === "online").length}
          description={`de ${agents.length} configurados`}
          icon={Server}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Monitores Recentes</CardTitle>
            <CardDescription>
              Últimos monitores atualizados
            </CardDescription>
          </CardHeader>
          <CardContent>
            {monitors.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Nenhum monitor configurado</p>
                <Link href="/dashboard/monitors/new">
                  <Button variant="link">Criar primeiro monitor</Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {monitors.slice(0, 5).map((monitor) => (
                  <Link
                    key={monitor.id}
                    href={`/dashboard/monitors/${monitor.id}`}
                    className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <MonitorStatusBadge status={monitor.status} />
                      <div>
                        <p className="font-medium">{monitor.name}</p>
                        <p className="text-sm text-muted-foreground truncate max-w-[200px]">
                          {monitor.target}
                        </p>
                      </div>
                    </div>
                    <div className="text-right text-sm">
                      <p className="font-medium">
                        {monitor.responseTimeMs ? `${monitor.responseTimeMs}ms` : "-"}
                      </p>
                      <p className="text-muted-foreground">
                        {monitor.lastCheckedAt
                          ? new Date(monitor.lastCheckedAt).toLocaleTimeString()
                          : "Nunca"}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Agentes</CardTitle>
            <CardDescription>
              Status dos agentes de monitoramento
            </CardDescription>
          </CardHeader>
          <CardContent>
            {agents.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Server className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Nenhum agente configurado</p>
                <Link href="/dashboard/agents/new">
                  <Button variant="link">Configurar agente</Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {agents.slice(0, 5).map((agent) => (
                  <Link
                    key={agent.id}
                    href={`/dashboard/agents/${agent.id}`}
                    className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`h-2 w-2 rounded-full ${
                          agent.status === "online" ? "bg-green-500" : "bg-gray-400"
                        }`}
                      />
                      <div>
                        <p className="font-medium">{agent.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {agent.region || "Região não definida"}
                        </p>
                      </div>
                    </div>
                    <div className="text-right text-sm">
                      <p className="text-muted-foreground">
                        {agent.monitors.length} monitores
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}