"use client"

import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { MonitorStatus } from "@/types/monitor"

const statusConfig: Record<MonitorStatus, { label: string; className: string }> = {
  up: { label: "Online", className: "bg-green-600 hover:bg-green-700 text-white" },
  down: { label: "Offline", className: "bg-red-600 hover:bg-red-700 text-white" },
  degraded: { label: "Degradado", className: "bg-yellow-600 hover:bg-yellow-700 text-white" },
  unknown: { label: "Desconhecido", className: "bg-gray-400 hover:bg-gray-500 text-white" },
}

interface Props {
  status: MonitorStatus
  className?: string
}

export function MonitorStatusBadge({ status, className }: Props) {
  const config = statusConfig[status]
  return (
    <Badge className={cn(config.className, className)}>
      {config.label}
    </Badge>
  )
}