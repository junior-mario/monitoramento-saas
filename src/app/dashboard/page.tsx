"use client"

import * as React from "react"
import { toast } from "sonner"
import { Card } from "@/components/ui/card"
import { MonitorForm } from "@/components/monitor-form"
import { MonitorTable } from "@/components/monitor-table"
import type { Monitor } from "@/types/monitor"
import { addMonitor, loadMonitors, removeMonitor, runCheck, saveMonitors } from "@/lib/monitor"

export default function DashboardPage() {
  const [monitors, setMonitors] = React.useState<Monitor[]>([])

  React.useEffect(() => {
    setMonitors(loadMonitors())
  }, [])

  function handleCreate(monitor: Monitor) {
    const next = addMonitor(monitors, monitor)
    setMonitors(next)
  }

  async function handleRun(id: string) {
    const monitor = monitors.find((m) => m.id === id)
    if (!monitor) return
    toast.loading(`Rodando check: ${monitor.name}`, { id })
    const updated = await runCheck(monitor)
    const next = monitors.map((m) => (m.id === id ? updated : m))
    setMonitors(next)
    saveMonitors(next)
    toast.dismiss(id)
    toast[updated.status === "up" ? "success" : "error"](
      updated.status === "up" ? "Tudo OK" : "Indisponível",
      { description: `${updated.name} • ${updated.type.toUpperCase()} • ${updated.responseTimeMs ?? "-"} ms` }
    )
  }

  function handleRemove(id: string) {
    const next = removeMonitor(monitors, id)
    setMonitors(next)
    toast.success("Monitor removido")
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <p className="text-muted-foreground">Crie monitores e rode checks para validar seu MVP.</p>
      </div>

      <MonitorForm onCreate={handleCreate} />

      <Card className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium">Meus Monitores</h2>
          <p className="text-sm text-muted-foreground">
            Persistência local (MVP). Conecte ao backend na próxima etapa.
          </p>
        </div>
        <MonitorTable monitors={monitors} onRun={handleRun} onRemove={handleRemove} />
      </Card>
    </div>
  )
}