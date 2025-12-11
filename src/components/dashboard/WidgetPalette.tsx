"use client"

import * as React from "react"
import { Card } from "@/components/ui/card"
import { BarChart3, LineChart, Activity, Grid3X3, Gauge, PieChart } from "lucide-react"

interface WidgetOption {
  type: "chart" | "status" | "stats" | "group-status"
  chartType?: "line" | "bar" | "area" | "gauge" | "status-grid" | "stats-summary"
  label: string
  icon: React.ReactNode
  description: string
}

const widgetOptions: WidgetOption[] = [
  { type: "stats", label: "Resumo", icon: <Activity className="h-5 w-5" />, description: "Estatísticas gerais" },
  { type: "status", label: "Status Grid", icon: <Grid3X3 className="h-5 w-5" />, description: "Grid de monitores" },
  { type: "chart", chartType: "line", label: "Gráfico Linha", icon: <LineChart className="h-5 w-5" />, description: "Tempo de resposta" },
  { type: "chart", chartType: "bar", label: "Gráfico Barra", icon: <BarChart3 className="h-5 w-5" />, description: "Comparativo" },
  { type: "chart", chartType: "area", label: "Gráfico Área", icon: <PieChart className="h-5 w-5" />, description: "Uptime ao longo do tempo" },
  { type: "chart", chartType: "gauge", label: "Gauge", icon: <Gauge className="h-5 w-5" />, description: "Indicador de saúde" },
  { type: "group-status", label: "Grupo", icon: <Grid3X3 className="h-5 w-5" />, description: "Status por grupo" },
]

interface Props {
  onAdd: (type: WidgetOption["type"], chartType?: WidgetOption["chartType"]) => void
}

export function WidgetPalette({ onAdd }: Props) {
  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium text-muted-foreground mb-3">Arraste ou clique para adicionar</h3>
      <div className="grid grid-cols-2 gap-2">
        {widgetOptions.map((opt) => (
          <Card
            key={`${opt.type}-${opt.chartType || ""}`}
            className="p-3 cursor-pointer hover:border-primary hover:bg-primary/5 transition-colors"
            onClick={() => onAdd(opt.type, opt.chartType)}
            draggable
            onDragStart={(e) => {
              e.dataTransfer.setData("widget-type", opt.type)
              e.dataTransfer.setData("chart-type", opt.chartType || "")
            }}
          >
            <div className="flex items-center gap-2">
              <div className="text-primary">{opt.icon}</div>
              <div>
                <p className="text-sm font-medium">{opt.label}</p>
                <p className="text-xs text-muted-foreground">{opt.description}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}