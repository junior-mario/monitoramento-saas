"use client"

import * as React from "react"
import GridLayout, { Layout } from "react-grid-layout"
import "react-grid-layout/css/styles.css"
import "react-resizable/css/styles.css"
import { Card } from "@/components/ui/card"
import { Settings2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { DashboardWidget, MonitorGroup } from "@/types/dashboard"
import type { Monitor } from "@/types/monitor"
import { WidgetPreview } from "./WidgetPreview"

interface Props {
  widgets: DashboardWidget[]
  monitors: Monitor[]
  groups: MonitorGroup[]
  columns?: number
  rowHeight?: number
  onLayoutChange: (widgets: DashboardWidget[]) => void
  onSelectWidget: (id: string) => void
  selectedWidgetId?: string
}

export function DashboardCanvas({
  widgets,
  monitors,
  groups,
  columns = 12,
  rowHeight = 80,
  onLayoutChange,
  onSelectWidget,
  selectedWidgetId,
}: Props) {
  const containerRef = React.useRef<HTMLDivElement>(null)
  const [width, setWidth] = React.useState(1200)

  React.useEffect(() => {
    function updateWidth() {
      if (containerRef.current) {
        setWidth(containerRef.current.offsetWidth)
      }
    }
    updateWidth()
    window.addEventListener("resize", updateWidth)
    return () => window.removeEventListener("resize", updateWidth)
  }, [])

  const layout: Layout[] = widgets.map((w) => ({
    i: w.id,
    x: w.layout.x,
    y: w.layout.y,
    w: w.layout.w,
    h: w.layout.h,
    minW: w.layout.minW || 2,
    minH: w.layout.minH || 2,
  }))

  function handleLayoutChange(newLayout: Layout[]) {
    const updated = widgets.map((widget) => {
      const item = newLayout.find((l) => l.i === widget.id)
      if (item) {
        return {
          ...widget,
          layout: {
            ...widget.layout,
            x: item.x,
            y: item.y,
            w: item.w,
            h: item.h,
          },
        }
      }
      return widget
    })
    onLayoutChange(updated)
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    const type = e.dataTransfer.getData("widget-type") as DashboardWidget["type"]
    const chartType = e.dataTransfer.getData("chart-type") as DashboardWidget["chartType"]
    if (type) {
      // Handled by parent
    }
  }

  return (
    <div
      ref={containerRef}
      className="bg-muted/30 rounded-lg border-2 border-dashed border-muted-foreground/20 min-h-[600px] p-2"
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
    >
      {widgets.length === 0 ? (
        <div className="flex items-center justify-center h-[400px] text-muted-foreground">
          <p>Arraste widgets da paleta para começar</p>
        </div>
      ) : (
        <GridLayout
          className="layout"
          layout={layout}
          cols={columns}
          rowHeight={rowHeight}
          width={width - 16}
          onLayoutChange={handleLayoutChange}
          draggableHandle=".drag-handle"
          isResizable
          isDraggable
          compactType="vertical"
          preventCollision={false}
        >
          {widgets.map((widget) => (
            <div
              key={widget.id}
              className={`group ${selectedWidgetId === widget.id ? "ring-2 ring-primary" : ""}`}
            >
              <Card className="h-full overflow-hidden">
                <div className="drag-handle flex items-center justify-between px-3 py-2 bg-muted/50 cursor-move border-b">
                  <span className="text-sm font-medium truncate">{widget.title}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => onSelectWidget(widget.id)}
                  >
                    <Settings2 className="h-4 w-4" />
                  </Button>
                </div>
                <div className="p-3 h-[calc(100%-40px)] overflow-auto">
                  <WidgetPreview widget={widget} monitors={monitors} groups={groups} />
                </div>
              </Card>
            </div>
          ))}
        </GridLayout>
      )}
    </div>
  )
}