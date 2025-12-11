"use client"

import * as React from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { createDefaultDashboard, getDashboard, upsertDashboard } from "@/lib/dashboards"
import { DashboardView } from "../../../components/dashboard/DashboardView"

export default function TVDashboardPage() {
  const [ready, setReady] = React.useState(false)
  const [dashboard, setDashboard] = React.useState(createDefaultDashboard())

  React.useEffect(() => {
    const existing = getDashboard("tv-default")
    if (existing) {
      setDashboard(existing)
    } else {
      const def = createDefaultDashboard()
      upsertDashboard(def)
      setDashboard(def)
    }
    setReady(true)
  }, [])

  function fullscreen() {
    const el = document.documentElement
    if (el.requestFullscreen) {
      el.requestFullscreen()
      toast.success("Entrando em tela cheia")
    }
  }

  if (!ready) {
    return <div className="p-6"><p className="text-muted-foreground">Carregando...</p></div>
  }

  return (
    <div className="p-2 md:p-4">
      <div className="flex justify-end">
        <Button variant="outline" onClick={fullscreen}>Tela cheia</Button>
      </div>
      <DashboardView dashboard={dashboard} tvMode />
    </div>
  )
}