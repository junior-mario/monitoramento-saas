"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { loadMonitors, upsertReport, generateId, getChecksByMonitor } from "@/lib/storage"
import type { Monitor, Report, ReportData } from "@/types/monitor"

const schema = z.object({
  name: z.string().min(2, "Nome muito curto"),
  type: z.enum(["uptime", "response-time", "incidents"]),
  period: z.enum(["24h", "7d", "30d", "custom"]),
  monitorIds: z.array(z.string()).min(1, "Selecione ao menos um monitor"),
})

type FormValues = z.infer<typeof schema>

function generateReportData(monitorIds: string[], period: string): ReportData {
  const days = period === "24h" ? 1 : period === "7d" ? 7 : 30
  const timeline: ReportData["timeline"] = []
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date()
    date.setDate(date.getDate() - i)
    timeline.push({
      date: date.toISOString().split("T")[0],
      uptime: 95 + Math.random() * 5,
      responseTime: 100 + Math.random() * 200,
      incidents: Math.floor(Math.random() * 3),
    })
  }

  const avgUptime = timeline.reduce((acc, t) => acc + t.uptime, 0) / timeline.length
  const avgResponseTime = timeline.reduce((acc, t) => acc + t.responseTime, 0) / timeline.length
  const totalIncidents = timeline.reduce((acc, t) => acc + t.incidents, 0)

  return {
    summary: {
      avgUptime: Math.round(avgUptime * 100) / 100,
      avgResponseTime: Math.round(avgResponseTime),
      totalIncidents,
    },
    timeline,
  }
}

export default function NewReportPage() {
  const router = useRouter()
  const [monitors, setMonitors] = React.useState<Monitor[]>([])

  React.useEffect(() => {
    setMonitors(loadMonitors())
  }, [])

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      type: "uptime",
      period: "7d",
      monitorIds: [],
    },
  })

  function onSubmit(values: FormValues) {
    const data = generateReportData(values.monitorIds, values.period)
    const report: Report = {
      id: generateId(),
      name: values.name,
      type: values.type,
      period: values.period,
      monitorIds: values.monitorIds,
      createdAt: new Date().toISOString(),
      data,
    }
    upsertReport(report)
    toast.success("Relatório gerado com sucesso")
    router.push(`/dashboard/reports/${report.id}`)
  }

  return (
    <div className="p-6 space-y-6 max-w-2xl">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/reports">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-semibold">Novo Relatório</h1>
          <p className="text-muted-foreground">Configure e gere um relatório</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Configurações do Relatório</CardTitle>
          <CardDescription>Defina os parâmetros do relatório</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome</FormLabel>
                    <FormControl>
                      <Input placeholder="Relatório Semanal" {...field} />
                    </FormControl>
                    <FormDescription>Nome identificador do relatório</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="uptime">Uptime</SelectItem>
                        <SelectItem value="response-time">Tempo de Resposta</SelectItem>
                        <SelectItem value="incidents">Incidentes</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>Tipo de análise do relatório</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="period"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Período</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="24h">Últimas 24 horas</SelectItem>
                        <SelectItem value="7d">Últimos 7 dias</SelectItem>
                        <SelectItem value="30d">Últimos 30 dias</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>Período de análise</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="monitorIds"
                render={() => (
                  <FormItem>
                    <FormLabel>Monitores</FormLabel>
                    <FormDescription>Selecione os monitores para incluir</FormDescription>
                    {monitors.length === 0 ? (
                      <p className="text-sm text-muted-foreground py-4">
                        Nenhum monitor disponível.{" "}
                        <Link href="/dashboard/monitors/new" className="underline">
                          Crie um monitor
                        </Link>{" "}
                        primeiro.
                      </p>
                    ) : (
                      <div className="space-y-2 border rounded-lg p-4">
                        {monitors.map((monitor) => (
                          <FormField
                            key={monitor.id}
                            control={form.control}
                            name="monitorIds"
                            render={({ field }) => (
                              <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(monitor.id)}
                                    onCheckedChange={(checked) => {
                                      const current = field.value || []
                                      if (checked) {
                                        field.onChange([...current, monitor.id])
                                      } else {
                                        field.onChange(
                                          current.filter((id) => id !== monitor.id)
                                        )
                                      }
                                    }}
                                  />
                                </FormControl>
                                <FormLabel className="font-normal cursor-pointer">
                                  {monitor.name}
                                  <span className="text-muted-foreground ml-2 text-xs">
                                    ({monitor.target})
                                  </span>
                                </FormLabel>
                              </FormItem>
                            )}
                          />
                        ))}
                      </div>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex gap-3">
                <Button type="submit" disabled={monitors.length === 0}>
                  Gerar Relatório
                </Button>
                <Link href="/dashboard/reports">
                  <Button type="button" variant="outline">Cancelar</Button>
                </Link>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}