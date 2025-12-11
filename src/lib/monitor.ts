"use client"

import { Monitor } from "@/types/monitor"

const STORAGE_KEY = "mvp_monitors_v1"

export function loadMonitors(): Monitor[] {
  if (typeof window === "undefined") return []
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as Monitor[]) : []
  } catch {
    return []
  }
}

export function saveMonitors(monitors: Monitor[]) {
  if (typeof window === "undefined") return
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(monitors))
}

export function addMonitor(monitors: Monitor[], monitor: Monitor): Monitor[] {
  const next = [...monitors, monitor]
  saveMonitors(next)
  return next
}

export function removeMonitor(monitors: Monitor[], id: string): Monitor[] {
  const next = monitors.filter((m) => m.id !== id)
  saveMonitors(next)
  return next
}

export async function runCheck(monitor: Monitor): Promise<Monitor> {
  const start = performance.now()
  let status: Monitor["status"] = "unknown"
  let responseTimeMs: number | undefined = undefined

  if (monitor.type === "http") {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 15000)
    try {
      // HEAD fornece tempos rápidos; se falhar, marcamos como down.
      const res = await fetch(monitor.target, {
        method: "HEAD",
        signal: controller.signal,
        cache: "no-store",
        mode: "cors",
      })
      clearTimeout(timeout)
      responseTimeMs = Math.round(performance.now() - start)
      // Considera qualquer resposta como "up"; para CORS, status pode ser 0/opaque,
      // mas se não lançar erro, tratamos como disponível.
      status = res.ok || res.type === "opaque" ? "up" : "down"
    } catch {
      clearTimeout(timeout)
      status = "down"
      responseTimeMs = Math.round(performance.now() - start)
    }
  } else {
    // Ping simulado no MVP (sem ICMP no browser).
    await new Promise((r) => setTimeout(r, 300 + Math.random() * 700))
    responseTimeMs = Math.round(performance.now() - start)
    // Simulação simples: 85% de chance de "up".
    status = Math.random() < 0.85 ? "up" : "down"
  }

  return {
    ...monitor,
    status,
    responseTimeMs,
    lastCheckedAt: new Date().toISOString(),
  }
}