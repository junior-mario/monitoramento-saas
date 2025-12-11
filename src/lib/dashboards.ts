"use client"

import type { Dashboard, DashboardWidget, MonitorGroup, WidgetLayout } from "@/types/dashboard"
import { generateId } from "@/lib/storage"

const DASHBOARDS_KEY = "saas_dashboards_v2"
const GROUPS_KEY = "saas_monitor_groups_v1"

function getItem<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

function setItem<T>(key: string, value: T) {
  if (typeof window === "undefined") return
  localStorage.setItem(key, JSON.stringify(value))
}

// Dashboards
export function loadDashboards(): Dashboard[] {
  return getItem<Dashboard[]>(DASHBOARDS_KEY, [])
}

export function saveDashboards(dashboards: Dashboard[]) {
  setItem(DASHBOARDS_KEY, dashboards)
}

export function getDashboard(id: string): Dashboard | undefined {
  return loadDashboards().find((d) => d.id === id)
}

export function upsertDashboard(dashboard: Dashboard) {
  const dashboards = loadDashboards()
  const idx = dashboards.findIndex((d) => d.id === dashboard.id)
  if (idx >= 0) {
    dashboards[idx] = dashboard
  } else {
    dashboards.push(dashboard)
  }
  saveDashboards(dashboards)
  return dashboards
}

export function deleteDashboard(id: string) {
  const dashboards = loadDashboards().filter((d) => d.id !== id)
  saveDashboards(dashboards)
  return dashboards
}

// Monitor Groups
export function loadGroups(): MonitorGroup[] {
  return getItem<MonitorGroup[]>(GROUPS_KEY, [])
}

export function saveGroups(groups: MonitorGroup[]) {
  setItem(GROUPS_KEY, groups)
}

export function upsertGroup(group: MonitorGroup) {
  const groups = loadGroups()
  const idx = groups.findIndex((g) => g.id === group.id)
  if (idx >= 0) {
    groups[idx] = group
  } else {
    groups.push(group)
  }
  saveGroups(groups)
  return groups
}

export function deleteGroup(id: string) {
  const groups = loadGroups().filter((g) => g.id !== id)
  saveGroups(groups)
  return groups
}

// Default dashboard for TV
export function createDefaultDashboard(): Dashboard {
  const widgets: DashboardWidget[] = [
    {
      id: generateId(),
      type: "stats",
      title: "Resumo Geral",
      layout: { x: 0, y: 0, w: 12, h: 2, minW: 4, minH: 2 },
    },
    {
      id: generateId(),
      type: "status",
      title: "Status dos Monitores",
      layout: { x: 0, y: 2, w: 8, h: 4, minW: 4, minH: 3 },
    },
    {
      id: generateId(),
      type: "chart",
      chartType: "line",
      title: "Tempo de Resposta",
      layout: { x: 8, y: 2, w: 4, h: 4, minW: 3, minH: 3 },
    },
  ]
  return {
    id: "tv-default",
    name: "TV Padrão",
    createdAt: new Date().toISOString(),
    widgets,
    groups: [],
    autoRefreshSec: 30,
    columns: 12,
    rowHeight: 80,
  }
}

// Create empty widget
export function createWidget(type: DashboardWidget["type"], chartType?: DashboardWidget["chartType"]): DashboardWidget {
  return {
    id: generateId(),
    type,
    chartType,
    title: type === "chart" ? "Gráfico" : type === "stats" ? "Estatísticas" : type === "group-status" ? "Grupo" : "Status",
    layout: { x: 0, y: 0, w: 4, h: 3, minW: 2, minH: 2 },
    monitorIds: [],
  }
}