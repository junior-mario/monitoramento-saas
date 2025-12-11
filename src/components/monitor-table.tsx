"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { Monitor } from "@/types/monitor"
import { Card } from "@/components/ui/card"

interface Props {
  monitors: Monitor[]
  onRun: (id: string) => void
  onRemove: (id: string) => void
}

function StatusBadge({ status }: { status: Monitor["status"] }) {
  const variants = {
    up: "bg-green-600 text-white",
    down: "bg-red-600 text-white",
    unknown: "bg-gray-300 text-gray-800",
  } as const
  return <Badge className={variants[status]}>{status}</Badge>
}

export function MonitorTable({ monitors, onRun, onRemove }: Props) {
  return (
    <Card className="p-0 overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>Tipo</TableHead>
            <TableHead>Alvo</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Último Check</TableHead>
            <TableHead>Resposta (ms)</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {monitors.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center text-muted-foreground">
                Nenhum monitor criado ainda.
              </TableCell>
            </TableRow>
          ) : (
            monitors.map((m) => (
              <TableRow key={m.id}>
                <TableCell className="font-medium">{m.name}</TableCell>
                <TableCell>{m.type.toUpperCase()}</TableCell>
                <TableCell className="truncate max-w-[220px]">{m.target}</TableCell>
                <TableCell><StatusBadge status={m.status} /></TableCell>
                <TableCell>{m.lastCheckedAt ? new Date(m.lastCheckedAt).toLocaleString() : "-"}</TableCell>
                <TableCell>{m.responseTimeMs ?? "-"}</TableCell>
                <TableCell className="text-right">
                  <div className="flex gap-2 justify-end">
                    <Button variant="secondary" onClick={() => onRun(m.id)}>Rodar</Button>
                    <Button variant="destructive" onClick={() => onRemove(m.id)}>Remover</Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </Card>
  )
}