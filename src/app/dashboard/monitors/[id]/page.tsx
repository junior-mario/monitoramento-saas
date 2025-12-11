"use client"

import * as React from "react"
import { useRouter, useParams } from "next/navigation"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { ArrowLeft, Trash2 } from "lucide-react"
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { getMonitor, upsertMonitor, deleteMonitor, loadAgents } from "@/lib/storage"
import type { Agent } from "@/types/monitor"

const schema = z.object({
  name: z.string().min(2, "Nome muito curto"),
  type: z.enum(["http", "ping", "tcp", "ssl"]),
  target: z.string().min(3, "Alvo inválido"),
  interval: z.coerce.number().min(30),
  agentId: z.string().optional(),
})

type FormValues = z.infer<typeof schema>

export default function EditMonitorPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string
  const [agents, setAgents] = React.useState<Agent[]>([])
  const [loading, setLoading] = React.useState(true)

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

  React.useEffect(() => {
    setAgents(loadAgents())
    const monitor = getMonitor(id)
    if (monitor) {
      form.reset({
        name: monitor.name,
        type: monitor.type,
        target: monitor.target,
        interval: monitor.interval,
        agentId: monitor.agentId || "",
      })
    } else {
      toast.error("Monitor não encontrado")
      router.push("/dashboard/monitors")
    }
    setLoading(false)
  }, [id, form, router])

  function onSubmit(values: FormValues) {
    const existing = getMonitor(id)
    if (!existing) return
    upsertMonitor({
      ...existing,
      name: values.name,
      type: values.type,
      target: values.target,
      interval: values.interval,
      agentId: values.agentId || undefined,
    })
    toast.success("Monitor atualizado")
    router.push("/dashboard/monitors")
  }

  function handleDelete() {
    deleteMonitor(id)
    toast.success("Monitor removido")
    router.push("/dashboard/monitors")
  }

  if (loading) {
    return (
      <div className="p-6">
        <p className="text-muted-foreground">Carregando...</p>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6 max-w-2xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/monitors">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-semibold">Editar Monitor</h1>
            <p className="text-muted-foreground">Atualize as configurações</p>
          </div>
        </div>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" size="sm">
              <Trash2 className="h-4 w-4 mr-2" />
              Excluir
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
              <AlertDialogDescription>
                Esta ação não pode ser desfeita. O monitor e seu histórico serão removidos.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete}>Excluir</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Configurações</CardTitle>
          <CardDescription>Edite os parâmetros do monitor</CardDescription>
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
                      <Input {...field} />
                    </FormControl>
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
                      <Input {...field} />
                    </FormControl>
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
                      <FormLabel>Agente</FormLabel>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione" />
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
                <Button type="submit">Salvar Alterações</Button>
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