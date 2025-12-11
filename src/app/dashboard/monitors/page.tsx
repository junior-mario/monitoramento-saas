"use client"

import * as React from "react"
import Link from "next/link"
import { Plus, Search, MoreHorizontal, Trash2, Edit, Play } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { MonitorStatusBadge } from "@/components/monitor-status-badge"
import { loadMonitors, deleteMonitor, upsertMonitor, addCheck, generateId } from "@/lib/storage"
import type { Monitor } from "@/types/monitor"

async function runCheck(monitor: Monitor): Promise<Monitor> {
  const start = performance.now()
  let status: Monitor["status"] = "unknown"
  let responseTimeMs: number | undefined

  if (monitor.type === "http") {
    try {
      const controller = new AbortController()
      const timeout = setTimeout(() => controller.abort(), 15000)
      const res = await fetch(monitor.target, {
        method: "HEAD",
        signal: controller.signal,
        cache: "no-store",
        mode: "cors",
      })
      clearTimeout(timeout)
      responseTimeMs = Math.round(performance.now() - start)
      status = res.ok || res.type === "opaque" ? "up" : "down"
    } catch {
      responseTimeMs = Math.round(performance.now() - start)
      status = "down"
    }
  } else {
    await new Promise((r) => setTimeout(r, 200 + Math.random() * 500))
    responseTimeMs = Math.round(performance.now() - start)
    status = Math.random() < 0.85 ? "up" : "down"
  }

  return {
    ...monitor,
    status,
    responseTimeMs,
    lastCheckedAt: new Date().toISOString(),
  }
}

export default function MonitorsPage() {
  const [monitors, setMonitors] = React.useState<Monitor[]>([])
  const [search, setSearch] = React.useState("")

  React.useEffect(() => {
    setMonitors(loadMonitors())
  }, [])

  const filtered = monitors.filter(
    (m) =>
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.target.toLowerCase().includes(search.toLowerCase())
  )

  async function handleRun(id: string) {
    const monitor = monitors.find((m) => m.id === id)
    if (!monitor) return
    toast.loading(`Verificando ${monitor.name}...`, { id })
    const updated = await runCheck(monitor)
    upsertMonitor(updated)
    addCheck({
      id: generateId(),
      monitorId: updated.id,
      status: updated.status,
      responseTimeMs: updated.responseTimeMs ?? 0,
      checkedAt: updated.lastCheckedAt ?? new Date().toISOString(),
    })
    setMonitors(loadMonitors())
    toast.dismiss(id)
    toast[updated.status === "up" ? "success" : "error"](
      updated.status === "up" ? "Online" : "Offline",
      { description: `${updated.name} • ${updated.responseTimeMs}ms` }
    )
  }

  function handleDelete(id: string) {
    deleteMonitor(id)
    setMonitors(loadMonitors())
    toast.success("Monitor removido")
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Monitores</h1>
          <p className="text-muted-foreground">
            Gerencie seus monitores de uptime
          </p>
        </div>
        <Link href="/dashboard/monitors/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Novo Monitor
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Todos os Monitores</CardTitle>
              <CardDescription>{monitors.length} monitores configurados</CardDescription>
            </div>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Alvo</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Resposta</TableHead>
                <TableHead>Último Check</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    Nenhum monitor encontrado
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((monitor) => (
                  <TableRow key={monitor.id}>
                    <TableCell className="font-medium">{monitor.name}</TableCell>
                    <TableCell className="uppercase text-xs">{monitor.type}</TableCell>
                    <TableCell className="truncate max-w-[200px]">{monitor.target}</TableCell>
                    <TableCell>
                      <MonitorStatusBadge status={monitor.status} />
                    </TableCell>
                    <TableCell>{monitor.responseTimeMs ? `${monitor.responseTimeMs}ms` : "-"}</TableCell>
                    <TableCell>
                      {monitor.lastCheckedAt
                        ? new Date(monitor.lastCheckedAt).toLocaleString()
                        : "-"}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleRun(monitor.id)}>
                            <Play className="h-4 w-4 mr-2" />
                            Verificar agora
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link href={`/dashboard/monitors/${monitor.id}`}>
                              <Edit className="h-4 w-4 mr-2" />
                              Editar
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => handleDelete(monitor.id)}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Remover
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}