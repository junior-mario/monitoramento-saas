"use client"

import * as React from "react"
import Link from "next/link"
import { Plus, MoreHorizontal, Trash2, Eye } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { loadDashboards, deleteDashboard } from "@/lib/dashboards"
import type { Dashboard } from "@/types/dashboard"

export default function DashboardsPage() {
  const [dashboards, setDashboards] = React.useState<Dashboard[]>([])

  React.useEffect(() => {
    setDashboards(loadDashboards())
  }, [])

  function handleDelete(id: string) {
    deleteDashboard(id)
    setDashboards(loadDashboards())
    toast.success("Painel removido")
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Painéis</h1>
          <p className="text-muted-foreground">
            Crie e personalize dashboards do seu jeito
          </p>
        </div>
        <Link href="/dashboard/dashboards/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Novo Painel
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Meus Painéis</CardTitle>
          <CardDescription>{dashboards.length} painel(is)</CardDescription>
        </CardHeader>
        <CardContent>
          {dashboards.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground">
              <p>Nenhum painel criado</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Widgets</TableHead>
                  <TableHead>Criado em</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {dashboards.map((d) => (
                  <TableRow key={d.id}>
                    <TableCell className="font-medium">
                      <Link href={`/dashboard/dashboards/${d.id}`} className="hover:underline">
                        {d.name}
                      </Link>
                    </TableCell>
                    <TableCell>{d.widgets.length}</TableCell>
                    <TableCell>{new Date(d.createdAt).toLocaleString()}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link href={`/dashboard/dashboards/${d.id}`}>
                              <Eye className="h-4 w-4 mr-2" />
                              Abrir
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => handleDelete(d.id)}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Remover
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}