"use client"

import React from "react"

export function BrandGradient() {
  return (
    <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <div className="absolute left-1/2 top-[-20%] h-[480px] w-[900px] -translate-x-1/2 rounded-full bg-gradient-to-r from-blue-500/25 via-violet-500/25 to-emerald-500/25 blur-3xl" />
      <div className="absolute left-[-10%] bottom-[-10%] h-[320px] w-[520px] rounded-full bg-gradient-to-br from-violet-500/20 to-blue-500/20 blur-2xl" />
      <div className="absolute right-[-10%] bottom-[-15%] h-[280px] w-[480px] rounded-full bg-gradient-to-tr from-emerald-500/20 to-blue-500/20 blur-2xl" />
    </div>
  )
}

export default BrandGradient