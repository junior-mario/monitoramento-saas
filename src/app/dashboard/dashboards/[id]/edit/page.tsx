"use client"

import * as React from "react"
import { useParams, useRouter } from "next/navigation"
import { toast } from "sonner"
import { ArrowLeft, Save } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import { DashboardCanvas } from "@/components/dashboard/DashboardCanvas"
import { WidgetPalette } from "@/components/dashboard/WidgetPalette"
import { WidgetEditor } from "@/components/dashboard/WidgetEditor"
import { GroupManager } from "@/components/dashboard/GroupManager"
import { getDashboard, upsertDashboard, createWidget } from "@/lib/dashboards"
import { loadMonitors } from "@/lib/storage"
import type { Dashboard, DashboardWidget, MonitorGroup } from "@/types/dashboard"
import type { Monitor } from "@/types/monitor"

export default function EditDashboardPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string

  const [name, setName] = React.useState("")
  const [widgets, setWidgets] = React.useState<DashboardWidget[]>([])
  const [groups, setGroups] = React.useState<MonitorGroup[]>([])
  const [monitors, setMonitors] = React.useState<Monitor[]>([])
  const [selectedWidgetId, setSelectedWidgetId] = React.useState<string | null>(null)
  const [editorOpen, setEditorOpen] = React.useState(false)
  const [loading, setLoading] = React.useState(true)
  const [originalDashboard, setOriginalDashboard] = React.useState<Dashboard | null>(null)

  React.useEffect(() => {
    setMonitors(loadMonitors())
    const d = getDashboard(id)
    if (!d) {
      toast.error("Painel não encontrado")
      router.push("/dashboard/dashboards")
      return
    }
    setOriginalDashboard(d)
    setName(d.name)
    setWidgets(d.widgets)
    setGroups(d.groups)
    setLoading(false)
  }, [id, router])

  const selectedWidget = widgets.find((w) => w.id === selectedWidgetId)

  function addWidget(type: DashboardWidget["type"], chartType?: DashboardWidget["chartType"]) {
    const widget = createWidget(type, chartType)
    const maxY = widgets.reduce((max, w) => Math.max(max, w.layout.y + w.layout.h), 0)
    widget.layout.y = maxY
    setWidgets([...widgets, widget])
    setSelectedWidgetId(widget.id)
    setEditorOpen(true)
    toast.success("Widget adicionado")
  }

  function updateWidget(updated: DashboardWidget) {
    setWidgets(widgets.map((w) => (w.id === updated.id ? updated : w)))
    toast.success("Widget atualizado")
  }

  function deleteWidget(widgetId: string) {
    setWidgets(widgets.filter((w) => w.id !== widgetId))
    setSelectedWidgetId(null)
    setEditorOpen(false)
    toast.success("Widget removido")
  }

  function selectWidget(widgetId: string) {
    setSelectedWidgetId(widgetId)
    setEditorOpen(true)
  }

  function saveDashboard() {
    if (!name.trim()) {
      toast.error("Digite um nome para o painel")
      return
    }
    if (!originalDashboard) return

    const dashboard: Dashboard = {
      ...originalDashboard,
      name,
      widgets,
      groups,
    }
    upsertDashboard(dashboard)
    toast.success("Painel salvo!")
    router.push(`/dashboard/dashboards/${id}`)
  }

  if (loading) {
    return (
      <div className="p-6">
        <p className="text-muted-foreground">Carregando...</p>
      </div>
    )
  }

  return (
    <div className="h-[calc(100vh-56px)] flex flex-col">
      <div className="flex items-center justify-between p-4 border-b bg-background">
        <div className="flex items-center gap-4">
          <Link href={`/dashboard/dashboards/${id}`}>
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div className="space-y-1">
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="text-lg font-semibold h-8 w-[300px]"
              placeholder="Nome do painel"
            />
            <p className="text-xs text-muted-foreground">
              {widgets.length} widget(s) • {groups.length} grupo(s)
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Link href={`/dashboard/dashboards/${id}`}>
            <Button variant="outline">Cancelar</Button>
          </Link>
          <Button onClick={saveDashboard}>
            <Save className="h-4 w-4 mr-2" />
            Salvar Alterações
          </Button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        <div className="w-[280px] border-r bg-background overflow-hidden flex flex-col">
          <Tabs defaultValue="widgets" className="flex-1 flex flex-col">
            <TabsList className="w-full rounded-none border-b">
              <TabsTrigger value="widgets" className="flex-1">Widgets</TabsTrigger>
              <TabsTrigger value="groups" className="flex-1">Grupos</TabsTrigger>
            </TabsList>
            <ScrollArea className="flex-1 p-4">
              <TabsContent value="widgets" className="mt-0">
                <WidgetPalette onAdd={addWidget} />
              </TabsContent>
              <TabsContent value="groups" className="mt-0">
                <GroupManager groups={groups} monitors={monitors} onChange={setGroups} />
              </TabsContent>
            </ScrollArea>
          </Tabs>
        </div>

        <div className="flex-1 overflow-auto p-4 bg-muted/20">
          <DashboardCanvas
            widgets={widgets}
            monitors={monitors}
            groups={groups}
            onLayoutChange={setWidgets}
            onSelectWidget={selectWidget}
            selectedWidgetId={selectedWidgetId || undefined}
          />
        </div>

        <Sheet open={editorOpen} onOpenChange={setEditorOpen}>
          <SheetContent className="w-[350px] p-0">
            {selectedWidget && (
              <WidgetEditor
                widget={selectedWidget}
                monitors={monitors}
                groups={groups}
                onUpdate={updateWidget}
                onDelete={() => deleteWidget(selectedWidget.id)}
                onClose={() => setEditorOpen(false)}
              />
            )}
          </SheetContent>
        </Sheet>
      </div>
    </div>
  )
}