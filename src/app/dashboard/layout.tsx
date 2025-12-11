"use client"

import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { Separator } from "@/components/ui/separator"
import { usePathname } from "next/navigation"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const showHeader = pathname !== "/dashboard/tv"

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        {showHeader && (
          <header className="flex h-14 items-center gap-4 border-b px-4">
            <SidebarTrigger />
            <Separator orientation="vertical" className="h-6" />
            <span className="text-sm text-muted-foreground">
              Monitoramento em tempo real
            </span>
          </header>
        )}
        <div className="flex-1 overflow-auto">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  )
}