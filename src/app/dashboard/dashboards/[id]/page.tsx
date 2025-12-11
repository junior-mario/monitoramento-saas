"use client"

import * as React from "react"
import { useParams, useRouter } from "next/navigation"
import { toast } from "sonner"
import Link from "next/link"
import { ArrowLeft, MoveUp, MoveDown, Maximize2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getDashboard, upsertDashboard } from "@/lib/dashboards"
import type { Dashboard, DashboardSize } from "@/types/dashboard"
import { DashboardView } from "../../../../components/dashboard/DashboardView"

export default function ViewCustomDashboardPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string
  const [dashboard, setDashboard] = React.useState<Dashboard | null>(null)

  React.useEffect(() => {
    const d = getDashboard(id)
    if (!d) {
      toast.error("Painel não encontrado")
      router.push("/dashboard/dashboards")
      return
    }
    setDashboard(d)
  }, [id, router])

  function moveWidget(index: number, dir: "up" | "down") {
    if (!dashboard) return
    const widgets = [...dashboard.widgets]
    const target = dir === "up" ? index - 1 : index + 1
    if (target < 0 || target >= widgets.length) return
    ;[widgets[index], widgets[target]] = [widgets[target], widgets[index]]
    const next = { ...dashboard, widgets }
    setDashboard(next)
    upsertDashboard(next)
  }

  function changeSize(index: number, size: DashboardSize) {
    if (!dashboard) return
    const widgets = [...dashboard.widgets]
    widgets[index] = { ...widgets[index], size }
    const next = { ...dashboard, widgets }
    setDashboard(next)
    upsertDashboard(next)
  }

  function fullscreen() {
    const el = document.documentElement
    if (el.requestFullscreen) {
      el.requestFullscreen()
      toast.success("Entrando em tela cheia")
    }
  }

  if (!dashboard) {
    return <div className="p-6"><p className="text-muted-foreground">Carregando...</p></div>
  }

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/dashboard/dashboards">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-2xl font-semibold">{dashboard.name}</h1>
        </div>
        <Button variant="outline" onClick={fullscreen}>
          <Maximize2 className="h-4 w-4 mr-2" />
          Tela cheia
        </Button>
      </div>

      <Card className="p-3">
        <div className="flex flex-wrap gap-2">
          {dashboard.widgets.map((w, i) => (
            <div key={w.id} className="flex items-center gap-2 rounded-lg border px-2 py-1">
              <span className="text-sm">{w.title || w.type}</span>
              <Button variant="ghost" size="icon" onClick={() => moveWidget(i, "up")}>
                <MoveUp className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => moveWidget(i, "down")}>
                <MoveDown className="h-4 w-4" />
              </Button>
              <Select value={String(w.size)} onValueChange={(v) => changeSize(i, Number(v) as DashboardSize)}>
                <SelectTrigger className="h-8 w-[110px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="12">Full</SelectItem>
                  <SelectItem value="6">Metade</SelectItem>
                  <SelectItem value="4">Terço</SelectItem>
                </SelectContent>
              </Select>
            </div>
          ))}
        </div>
      </Card>

      <DashboardView dashboard={dashboard} />
    </div>
  )
}