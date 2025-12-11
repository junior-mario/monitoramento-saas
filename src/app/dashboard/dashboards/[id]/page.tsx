"use client"

import * as React from "react"
import { useParams, useRouter } from "next/navigation"
import { toast } from "sonner"
import Link from "next/link"
import { ArrowLeft, Maximize2, Edit } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getDashboard } from "@/lib/dashboards"
import type { Dashboard } from "@/types/dashboard"
import { DashboardViewV2 } from "@/components/dashboard/DashboardViewV2"

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

  function fullscreen() {
    const el = document.documentElement
    if (el.requestFullscreen) {
      el.requestFullscreen()
      toast.success("Entrando em tela cheia")
    }
  }

  if (!dashboard) {
    return (
      <div className="p-6">
        <p className="text-muted-foreground">Carregando...</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-3">
          <Link href="/dashboard/dashboards">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-xl font-semibold">{dashboard.name}</h1>
            <p className="text-xs text-muted-foreground">
              {dashboard.widgets.length} widgets • Atualiza a cada {dashboard.autoRefreshSec || 30}s
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Link href={`/dashboard/dashboards/${id}/edit`}>
            <Button variant="outline">
              <Edit className="h-4 w-4 mr-2" />
              Editar
            </Button>
          </Link>
          <Button variant="outline" onClick={fullscreen}>
            <Maximize2 className="h-4 w-4 mr-2" />
            Tela cheia
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        <DashboardViewV2 dashboard={dashboard} />
      </div>
    </div>
  )
}