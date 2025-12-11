"use client"

import type { Monitor, Agent, Report, CheckResult } from "@/types/monitor"

const MONITORS_KEY = "saas_monitors_v1"
const AGENTS_KEY = "saas_agents_v1"
const REPORTS_KEY = "saas_reports_v1"
const CHECKS_KEY = "saas_checks_v1"

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

// Monitors
export function loadMonitors(): Monitor[] {
  return getItem<Monitor[]>(MONITORS_KEY, [])
}

export function saveMonitors(monitors: Monitor[]) {
  setItem(MONITORS_KEY, monitors)
}

export function getMonitor(id: string): Monitor | undefined {
  return loadMonitors().find((m) => m.id === id)
}

export function upsertMonitor(monitor: Monitor) {
  const monitors = loadMonitors()
  const idx = monitors.findIndex((m) => m.id === monitor.id)
  if (idx >= 0) {
    monitors[idx] = monitor
  } else {
    monitors.push(monitor)
  }
  saveMonitors(monitors)
  return monitors
}

export function deleteMonitor(id: string) {
  const monitors = loadMonitors().filter((m) => m.id !== id)
  saveMonitors(monitors)
  return monitors
}

// Agents
export function loadAgents(): Agent[] {
  return getItem<Agent[]>(AGENTS_KEY, [])
}

export function saveAgents(agents: Agent[]) {
  setItem(AGENTS_KEY, agents)
}

export function getAgent(id: string): Agent | undefined {
  return loadAgents().find((a) => a.id === id)
}

export function upsertAgent(agent: Agent) {
  const agents = loadAgents()
  const idx = agents.findIndex((a) => a.id === agent.id)
  if (idx >= 0) {
    agents[idx] = agent
  } else {
    agents.push(agent)
  }
  saveAgents(agents)
  return agents
}

export function deleteAgent(id: string) {
  const agents = loadAgents().filter((a) => a.id !== id)
  saveAgents(agents)
  return agents
}

// Reports
export function loadReports(): Report[] {
  return getItem<Report[]>(REPORTS_KEY, [])
}

export function saveReports(reports: Report[]) {
  setItem(REPORTS_KEY, reports)
}

export function upsertReport(report: Report) {
  const reports = loadReports()
  const idx = reports.findIndex((r) => r.id === report.id)
  if (idx >= 0) {
    reports[idx] = report
  } else {
    reports.push(report)
  }
  saveReports(reports)
  return reports
}

export function deleteReport(id: string) {
  const reports = loadReports().filter((r) => r.id !== id)
  saveReports(reports)
  return reports
}

// Check Results (últimos 100 por monitor)
export function loadChecks(): CheckResult[] {
  return getItem<CheckResult[]>(CHECKS_KEY, [])
}

export function saveChecks(checks: CheckResult[]) {
  setItem(CHECKS_KEY, checks.slice(-500))
}

export function addCheck(check: CheckResult) {
  const checks = loadChecks()
  checks.push(check)
  saveChecks(checks)
}

export function getChecksByMonitor(monitorId: string): CheckResult[] {
  return loadChecks().filter((c) => c.monitorId === monitorId)
}

// Helpers
export function generateId(): string {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2) + Date.now().toString(36)
}

export function generateApiKey(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
  let key = "agent_"
  for (let i = 0; i < 32; i++) {
    key += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return key
}