"use client"

import * as React from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Download } from "lucide-react"
import { toast } from "sonner"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { StatsCard } from "@/components/stats-card"
import { loadReports, loadMonitors } from "@/lib/storage"
import type { Report, Monitor } from "@/types/monitor"
import { Activity, Clock, AlertTriangle } from "lucide-react"

export default function ViewReportPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string
  const [report, setReport] = React.useState<Report | null>(null)
  const [monitors, setMonitors] = React.useState<Monitor[]>([])

  React.useEffect(() => {
    const reports = loadReports()
    const found = reports.find((r) => r.id === id)
    if (found) {
      setReport(found)
      setMonitors(loadMonitors().filter((m) => found.monitorIds.includes(m.id)))
    } else {
      toast.error("Relatório não encontrado")
      router.push("/dashboard/reports")
    }
  }, [id, router])

  if (!report || !report.data) {
    return (
      <div className="p-6">
        <p className="text-muted-foreground">Carregando...</p>
      </div>
    )
  }

  const { summary, timeline } = report.data

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/reports">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-semibold">{report.name}</h1>
            <p className="text-muted-foreground">
              Gerado em {new Date(report.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
        <Button variant="outline" onClick={() => toast.info("Exportação em desenvolvimento")}>
          <Download className="h-4 w-4 mr-2" />
          Exportar PDF
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <StatsCard
          title="Uptime Médio"
          value={`${summary.avgUptime.toFixed(2)}%`}
          icon={Activity}
          trend={summary.avgUptime >= 99 ? "up" : summary.avgUptime >= 95 ? "neutral" : "down"}
        />
        <StatsCard
          title="Tempo de Resposta Médio"
          value={`${summary.avgResponseTime}ms`}
          icon={Clock}
        />
        <StatsCard
          title="Total de Incidentes"
          value={summary.totalIncidents}
          icon={AlertTriangle}
          trend={summary.totalIncidents === 0 ? "up" : "down"}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Uptime ao Longo do Tempo</CardTitle>
            <CardDescription>Porcentagem de disponibilidade</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={timeline}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis
                    dataKey="date"
                    tickFormatter={(v) => new Date(v).toLocaleDateString("pt-BR", { day: "2-digit", month: "short" })}
                    className="text-xs"
                  />
                  <YAxis domain={[90, 100]} className="text-xs" />
                  <Tooltip
                    contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}
                    labelFormatter={(v) => new Date(v).toLocaleDateString("pt-BR")}
                    formatter={(v: number) => [`${v.toFixed(2)}%`, "Uptime"]}
                  />
                  <Line
                    type="monotone"
                    dataKey="uptime"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tempo de Resposta</CardTitle>
            <CardDescription>Latência média em milissegundos</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={timeline}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis
                    dataKey="date"
                    tickFormatter={(v) => new Date(v).toLocaleDateString("pt-BR", { day: "2-digit", month: "short" })}
                    className="text-xs"
                  />
                  <YAxis className="text-xs" />
                  <Tooltip
                    contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))" }}
                    labelFormatter={(v) => new Date(v).toLocaleDateString("pt-BR")}
                    formatter={(v: number) => [`${Math.round(v)}ms`, "Resposta"]}
                  />
                  <Bar dataKey="responseTime" fill="hsl(var(--chart-1))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Monitores Incluídos</CardTitle>
          <CardDescription>{monitors.length} monitores neste relatório</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {monitors.map((m) => (
              <Link
                key={m.id}
                href={`/dashboard/monitors/${m.id}`}
                className="px-3 py-1 bg-muted rounded-full text-sm hover:bg-muted/80 transition-colors"
              >
                {m.name}
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}