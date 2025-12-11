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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { upsertDashboard } from "@/lib/dashboards"
import { generateId } from "@/lib/storage"
import type { Dashboard, DashboardWidgetType, DashboardSize } from "@/types/dashboard"

const schema = z.object({
  name: z.string().min(2, "Nome muito curto"),
  widgets: z.array(z.object({
    type: z.enum(["stats-summary", "monitors-status", "agents-status"]),
    size: z.enum(["12", "6", "4"]),
  })).min(1, "Selecione ao menos um widget"),
})

type FormValues = z.infer<typeof schema>

export default function NewCustomDashboardPage() {
  const router = useRouter()
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      widgets: [],
    },
  })

  const widgetOptions: { type: DashboardWidgetType; label: string }[] = [
    { type: "stats-summary", label: "Resumo" },
    { type: "monitors-status", label: "Monitores" },
    { type: "agents-status", label: "Agentes" },
  ]

  function toggleWidget(type: DashboardWidgetType, checked: boolean) {
    const current = form.getValues("widgets") || []
    const exists = current.find((w) => w.type === type)
    if (checked && !exists) {
      form.setValue("widgets", [...current, { type, size: "12" }])
    } else if (!checked && exists) {
      form.setValue("widgets", current.filter((w) => w.type !== type))
    }
  }

  function setWidgetSize(type: DashboardWidgetType, size: DashboardSize) {
    const current = form.getValues("widgets") || []
    form.setValue("widgets", current.map((w) => w.type === type ? { ...w, size: String(size) as "12" | "6" | "4" } : w))
  }

  function onSubmit(values: FormValues) {
    const dashboard: Dashboard = {
      id: generateId(),
      name: values.name,
      createdAt: new Date().toISOString(),
      autoRefreshSec: 30,
      widgets: values.widgets.map((w) => ({
        id: generateId(),
        type: w.type,
        size: Number(w.size) as DashboardSize,
        title: widgetOptions.find((o) => o.type === w.type)?.label,
      })),
    }
    upsertDashboard(dashboard)
    toast.success("Painel criado com sucesso")
    router.push(`/dashboard/dashboards/${dashboard.id}`)
  }

  const selected = form.watch("widgets")

  return (
    <div className="p-6 space-y-6 max-w-2xl">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/dashboards">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-semibold">Novo Painel</h1>
          <p className="text-muted-foreground">Selecione widgets e tamanhos</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Configurações do Painel</CardTitle>
          <CardDescription>Defina nome e widgets</CardDescription>
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
                      <Input placeholder="Painel da equipe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-4">
                {widgetOptions.map((opt) => {
                  const isSelected = !!selected?.find((w) => w.type === opt.type)
                  const size = selected?.find((w) => w.type === opt.type)?.size || "12"
                  return (
                    <div key={opt.type} className="flex items-center justify-between rounded-lg border p-3">
                      <div className="flex items-center gap-3">
                        <Checkbox
                          checked={isSelected}
                          onCheckedChange={(checked) => toggleWidget(opt.type, !!checked)}
                        />
                        <span className="font-medium">{opt.label}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">Tamanho</span>
                        <Select value={size} onValueChange={(v) => setWidgetSize(opt.type, Number(v) as DashboardSize)}>
                          <SelectTrigger className="w-[120px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="12">Full</SelectItem>
                            <SelectItem value="6">Metade</SelectItem>
                            <SelectItem value="4">Terço</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  )
                })}
              </div>

              <div className="flex gap-3">
                <Button type="submit">Criar Painel</Button>
                <Link href="/dashboard/dashboards">
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