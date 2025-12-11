"use client"

import * as React from "react"
import { Plus, Trash2, Edit2, Check, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Card } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import type { MonitorGroup } from "@/types/dashboard"
import type { Monitor } from "@/types/monitor"
import { generateId } from "@/lib/storage"

const colors = [
  "#3b82f6", "#8b5cf6", "#10b981", "#f59e0b", "#ef4444",
  "#ec4899", "#06b6d4", "#84cc16", "#f97316", "#6366f1",
]

interface Props {
  groups: MonitorGroup[]
  monitors: Monitor[]
  onChange: (groups: MonitorGroup[]) => void
}

export function GroupManager({ groups, monitors, onChange }: Props) {
  const [open, setOpen] = React.useState(false)
  const [editingId, setEditingId] = React.useState<string | null>(null)
  const [name, setName] = React.useState("")
  const [color, setColor] = React.useState(colors[0])
  const [selectedMonitors, setSelectedMonitors] = React.useState<string[]>([])

  function resetForm() {
    setName("")
    setColor(colors[0])
    setSelectedMonitors([])
    setEditingId(null)
  }

  function startEdit(group: MonitorGroup) {
    setEditingId(group.id)
    setName(group.name)
    setColor(group.color)
    setSelectedMonitors(group.monitorIds)
    setOpen(true)
  }

  function save() {
    if (!name.trim()) return

    if (editingId) {
      onChange(groups.map((g) =>
        g.id === editingId ? { ...g, name, color, monitorIds: selectedMonitors } : g
      ))
    } else {
      const newGroup: MonitorGroup = {
        id: generateId(),
        name,
        color,
        monitorIds: selectedMonitors,
      }
      onChange([...groups, newGroup])
    }
    resetForm()
    setOpen(false)
  }

  function remove(id: string) {
    onChange(groups.filter((g) => g.id !== id))
  }

  function toggleMonitor(id: string) {
    setSelectedMonitors((prev) =>
      prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id]
    )
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-muted-foreground">Grupos de Monitores</h3>
        <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) resetForm(); }}>
          <DialogTrigger asChild>
            <Button size="sm" variant="outline">
              <Plus className="h-4 w-4 mr-1" />
              Novo Grupo
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingId ? "Editar Grupo" : "Novo Grupo"}</DialogTitle>
              <DialogDescription>
                Agrupe monitores para organizar seu painel
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Nome do Grupo</Label>
                <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Servidores Web" />
              </div>
              <div className="space-y-2">
                <Label>Cor</Label>
                <div className="flex gap-2 flex-wrap">
                  {colors.map((c) => (
                    <button
                      key={c}
                      type="button"
                      className={`h-8 w-8 rounded-full border-2 transition-all ${color === c ? "border-foreground scale-110" : "border-transparent"}`}
                      style={{ backgroundColor: c }}
                      onClick={() => setColor(c)}
                    />
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <Label>Monitores</Label>
                <ScrollArea className="h-[200px] border rounded-lg p-2">
                  {monitors.length === 0 ? (
                    <p className="text-sm text-muted-foreground p-2">Nenhum monitor disponível</p>
                  ) : (
                    <div className="space-y-2">
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
                </ScrollArea>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => { setOpen(false); resetForm(); }}>
                Cancelar
              </Button>
              <Button onClick={save}>
                {editingId ? "Salvar" : "Criar Grupo"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {groups.length === 0 ? (
        <p className="text-sm text-muted-foreground">Nenhum grupo criado</p>
      ) : (
        <div className="space-y-2">
          {groups.map((g) => (
            <Card key={g.id} className="p-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 rounded-full" style={{ backgroundColor: g.color }} />
                <span className="font-medium">{g.name}</span>
                <span className="text-xs text-muted-foreground">({g.monitorIds.length} monitores)</span>
              </div>
              <div className="flex gap-1">
                <Button variant="ghost" size="icon" onClick={() => startEdit(g)}>
                  <Edit2 className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => remove(g.id)}>
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}