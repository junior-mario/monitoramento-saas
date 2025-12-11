"use client"

import * as React from "react"
import RGL, { WidthProvider } from "react-grid-layout"
import "react-grid-layout/css/styles.css"
import "react-resizable/css/styles.css"
import { Card } from "@/components/ui/card"
import { Settings2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { DashboardWidget, MonitorGroup } from "@/types/dashboard"
import type { Monitor } from "@/types/monitor"
import { WidgetPreview } from "./WidgetPreview"

const ReactGridLayout = WidthProvider(RGL)

interface LayoutItem {
  i: string
  x: number
  y: number
  w: number
  h: number
  minW?: number
  minH?: number
  static?: boolean
}

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
  const layout: LayoutItem[] = widgets.map((w) => ({
    i: w.id,
    x: w.layout.x,
    y: w.layout.y,
    w: w.layout.w,
    h: w.layout.h,
    minW: w.layout.minW || 2,
    minH: w.layout.minH || 2,
  }))

  function handleLayoutChange(newLayout: LayoutItem[]) {
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

  return (
    <div className="bg-muted/30 rounded-lg border-2 border-dashed border-muted-foreground/20 min-h-[600px] p-2">
      {widgets.length === 0 ? (
        <div className="flex items-center justify-center h-[400px] text-muted-foreground">
          <p>Arraste widgets da paleta para começar</p>
        </div>
      ) : (
        <ReactGridLayout
          className="layout"
          layout={layout as RGL.Layout[]}
          cols={columns}
          rowHeight={rowHeight}
          onLayoutChange={(currentLayout: RGL.Layout[]) => handleLayoutChange(currentLayout as LayoutItem[])}
          draggableHandle=".drag-handle"
          isResizable
          isDraggable
          compactType="vertical"
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
        </ReactGridLayout>
      )}
    </div>
  )
}