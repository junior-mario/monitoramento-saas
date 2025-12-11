"use client"

import * as React from "react"
import Link from "next/link"
import { Plus, Server, MoreHorizontal, Trash2, Edit, Copy } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { loadAgents, deleteAgent } from "@/lib/storage"
import type { Agent } from "@/types/monitor"

export default function AgentsPage() {
  const [agents, setAgents] = React.useState<Agent[]>([])

  React.useEffect(() => {
    setAgents(loadAgents())
  }, [])

  function handleDelete(id: string) {
    deleteAgent(id)
    setAgents(loadAgents())
    toast.success("Agente removido")
  }

  function copyApiKey(key: string) {
    navigator.clipboard.writeText(key)
    toast.success("API Key copiada")
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Agentes</h1>
          <p className="text-muted-foreground">
            Configure agentes para monitoramento interno
          </p>
        </div>
        <Link href="/dashboard/agents/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Novo Agente
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Agentes Configurados</CardTitle>
          <CardDescription>
            Agentes permitem monitorar recursos internos da sua rede
          </CardDescription>
        </CardHeader>
        <CardContent>
          {agents.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Server className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="mb-2">Nenhum agente configurado</p>
              <p className="text-sm mb-4">
                Agentes permitem monitorar servidores e serviços internos
              </p>
              <Link href="/dashboard/agents/new">
                <Button>Criar primeiro agente</Button>
              </Link>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Região</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Monitores</TableHead>
                  <TableHead>Última Atividade</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {agents.map((agent) => (
                  <TableRow key={agent.id}>
                    <TableCell className="font-medium">{agent.name}</TableCell>
                    <TableCell>{agent.region || "-"}</TableCell>
                    <TableCell>
                      <Badge
                        className={
                          agent.status === "online"
                            ? "bg-green-600 text-white"
                            : "bg-gray-400 text-white"
                        }
                      >
                        {agent.status === "online" ? "Online" : "Offline"}
                      </Badge>
                    </TableCell>
                    <TableCell>{agent.monitors.length}</TableCell>
                    <TableCell>
                      {agent.lastSeenAt
                        ? new Date(agent.lastSeenAt).toLocaleString()
                        : "Nunca"}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => copyApiKey(agent.apiKey)}>
                            <Copy className="h-4 w-4 mr-2" />
                            Copiar API Key
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link href={`/dashboard/agents/${agent.id}`}>
                              <Edit className="h-4 w-4 mr-2" />
                              Editar
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => handleDelete(agent.id)}
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