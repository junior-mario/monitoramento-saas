"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { upsertMonitor, generateId, loadAgents } from "@/lib/storage"
import type { Monitor, Agent } from "@/types/monitor"

const schema = z.object({
  name: z.string().min(2, "Nome muito curto"),
  type: z.enum(["http", "ping", "tcp", "ssl"]),
  target: z.string().min(3, "Alvo inválido"),
  interval: z.coerce.number().min(30),
  agentId: z.string().optional(),
})

type FormValues = z.infer<typeof schema>

export default function NewMonitorPage() {
  const router = useRouter()
  const [agents, setAgents] = React.useState<Agent[]>([])

  React.useEffect(() => {
    setAgents(loadAgents())
  }, [])

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      type: "http",
      target: "",
      interval: 300,
      agentId: "",
    },
  })

  function onSubmit(values: FormValues) {
    const monitor: Monitor = {
      id: generateId(),
      name: values.name,
      type: values.type,
      target: values.target,
      interval: values.interval,
      status: "unknown",
      createdAt: new Date().toISOString(),
      agentId: values.agentId || undefined,
    }
    upsertMonitor(monitor)
    toast.success("Monitor criado com sucesso")
    router.push("/dashboard/monitors")
  }

  return (
    <div className="p-6 space-y-6 max-w-2xl">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/monitors">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-semibold">Novo Monitor</h1>
          <p className="text-muted-foreground">Configure um novo monitor de uptime</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Configurações</CardTitle>
          <CardDescription>Defina os parâmetros do monitor</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome</FormLabel>
                    <FormControl>
                      <Input placeholder="Meu Site Principal" {...field} />
                    </FormControl>
                    <FormDescription>Nome identificador do monitor</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="http">HTTP/HTTPS</SelectItem>
                        <SelectItem value="ping">Ping (ICMP)</SelectItem>
                        <SelectItem value="tcp">TCP Port</SelectItem>
                        <SelectItem value="ssl">SSL Certificate</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>Tipo de verificação</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="target"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Alvo</FormLabel>
                    <FormControl>
                      <Input placeholder="https://example.com ou 192.168.1.1:3000" {...field} />
                    </FormControl>
                    <FormDescription>URL ou endereço IP a ser monitorado</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="interval"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Intervalo (segundos)</FormLabel>
                    <FormControl>
                      <Input type="number" min={30} step={30} {...field} />
                    </FormControl>
                    <FormDescription>Frequência de verificação (mínimo 30s)</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {agents.length > 0 && (
                <FormField
                  control={form.control}
                  name="agentId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Agente (opcional)</FormLabel>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione um agente" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="">Nenhum (cloud)</SelectItem>
                          {agents.map((agent) => (
                            <SelectItem key={agent.id} value={agent.id}>
                              {agent.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>Agente para monitoramento interno</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <div className="flex gap-3">
                <Button type="submit">Criar Monitor</Button>
                <Link href="/dashboard/monitors">
                  <Button type="button" variant="outline">Cancelar</Button>
                </Link>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}