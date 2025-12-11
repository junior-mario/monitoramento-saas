"use client"

import * as React from "react"
import { X, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import type { DashboardWidget, MonitorGroup } from "@/types/dashboard"
import type { Monitor } from "@/types/monitor"

interface Props {
  widget: DashboardWidget
  monitors: Monitor[]
  groups: MonitorGroup[]
  onUpdate: (widget: DashboardWidget) => void
  onDelete: () => void
  onClose: () => void
}

export function WidgetEditor({ widget, monitors, groups, onUpdate, onDelete, onClose }: Props) {
  const [title, setTitle] = React.useState(widget.title)
  const [selectedMonitors, setSelectedMonitors] = React.useState<string[]>(widget.monitorIds || [])
  const [selectedGroup, setSelectedGroup] = React.useState(widget.groupId || "")
  const [chartType, setChartType] = React.useState(widget.chartType || "line")

  React.useEffect(() => {
    setTitle(widget.title)
    setSelectedMonitors(widget.monitorIds || [])
    setSelectedGroup(widget.groupId || "")
    setChartType(widget.chartType || "line")
  }, [widget])

  function save() {
    onUpdate({
      ...widget,
      title,
      monitorIds: selectedMonitors,
      groupId: selectedGroup || undefined,
      chartType: widget.type === "chart" ? chartType : undefined,
    })
  }

  function toggleMonitor(id: string) {
    setSelectedMonitors((prev) =>
      prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id]
    )
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between p-4 border-b">
        <h3 className="font-semibold">Configurar Widget</h3>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <ScrollArea className="flex-1 p-4">
        <div className="space-y-6">
          <div className="space-y-2">
            <Label>Título</Label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>

          {widget.type === "chart" && (
            <div className="space-y-2">
              <Label>Tipo de Gráfico</Label>
              <Select value={chartType} onValueChange={(v) => setChartType(v as typeof chartType)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="line">Linha</SelectItem>
                  <SelectItem value="bar">Barra</SelectItem>
                  <SelectItem value="area">Área</SelectItem>
                  <SelectItem value="gauge">Gauge</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {widget.type === "group-status" && groups.length > 0 && (
            <div className="space-y-2">
              <Label>Grupo</Label>
              <Select value={selectedGroup} onValueChange={setSelectedGroup}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um grupo" />
                </SelectTrigger>
                <SelectContent>
                  {groups.map((g) => (
                    <SelectItem key={g.id} value={g.id}>
                      <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full" style={{ backgroundColor: g.color }} />
                        {g.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {(widget.type === "chart" || widget.type === "status") && (
            <>
              <Separator />
              <div className="space-y-2">
                <Label>Monitores</Label>
                <p className="text-xs text-muted-foreground mb-2">
                  Selecione os monitores para este widget
                </p>
                {monitors.length === 0 ? (
                  <p className="text-sm text-muted-foreground">Nenhum monitor disponível</p>
                ) : (
                  <div className="space-y-2 max-h-[200px] overflow-y-auto">
                    {monitors.map((m) => (
                      <div key={m.id} className="flex items-center gap-2">
                        <Checkbox
                          checked={selectedMonitors.includes(m.id)}
                          onCheckedChange={() => toggleMonitor(m.id)}
                        />
                        <span className="text-sm">{m.name}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </ScrollArea>

      <div className="p-4 border-t space-y-2">
        <Button className="w-full" onClick={save}>
          Salvar Alterações
        </Button>
        <Button variant="destructive" className="w-full" onClick={onDelete}>
          <Trash2 className="h-4 w-4 mr-2" />
          Remover Widget
        </Button>
      </div>
    </div>
  )
}