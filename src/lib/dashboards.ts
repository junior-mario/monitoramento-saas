"use client"

import type { Dashboard, DashboardWidget } from "@/types/dashboard"
import { generateId } from "@/lib/storage"

const DASHBOARDS_KEY = "saas_dashboards_v1"

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

export function createDefaultDashboard(): Dashboard {
  const widgets: DashboardWidget[] = [
    { id: generateId(), type: "stats-summary", size: 12, title: "Resumo" },
    { id: generateId(), type: "monitors-status", size: 12, title: "Monitores" },
    { id: generateId(), type: "agents-status", size: 12, title: "Agentes" },
  ]
  return {
    id: "tv-default",
    name: "TV Padrão",
    createdAt: new Date().toISOString(),
    widgets,
    autoRefreshSec: 30,
  }
}