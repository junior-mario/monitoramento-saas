"use client"

import * as React from "react"
import { useRouter, useParams } from "next/navigation"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { ArrowLeft, Trash2, Copy, RefreshCw } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
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
import { getAgent, upsertAgent, deleteAgent, generateApiKey } from "@/lib/storage"

const schema = z.object({
  name: z.string().min(2, "Nome muito curto"),
  description: z.string().optional(),
  region: z.string().optional(),
})

type FormValues = z.infer<typeof schema>

export default function EditAgentPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string
  const [apiKey, setApiKey] = React.useState("")
  const [loading, setLoading] = React.useState(true)

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      description: "",
      region: "",
    },
  })

  React.useEffect(() => {
    const agent = getAgent(id)
    if (agent) {
      form.reset({
        name: agent.name,
        description: agent.description || "",
        region: agent.region || "",
      })
      setApiKey(agent.apiKey)
    } else {
      toast.error("Agente não encontrado")
      router.push("/dashboard/agents")
    }
    setLoading(false)
  }, [id, form, router])

  function onSubmit(values: FormValues) {
    const existing = getAgent(id)
    if (!existing) return
    upsertAgent({
      ...existing,
      name: values.name,
      description: values.description,
      region: values.region,
    })
    toast.success("Agente atualizado")
    router.push("/dashboard/agents")
  }

  function handleDelete() {
    deleteAgent(id)
    toast.success("Agente removido")
    router.push("/dashboard/agents")
  }

  function regenerateKey() {
    const existing = getAgent(id)
    if (!existing) return
    const newKey = generateApiKey()
    upsertAgent({ ...existing, apiKey: newKey })
    setApiKey(newKey)
    toast.success("Nova API Key gerada")
  }

  function copyKey() {
    navigator.clipboard.writeText(apiKey)
    toast.success("API Key copiada")
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
          <Link href="/dashboard/agents">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-semibold">Editar Agente</h1>
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
                Esta ação não pode ser desfeita. O agente será removido.
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
          <CardDescription>Edite os dados do agente</CardDescription>
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
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descrição</FormLabel>
                    <FormControl>
                      <Textarea {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="region"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Região</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-2">
                <FormLabel>API Key</FormLabel>
                <div className="flex gap-2">
                  <Input value={apiKey} readOnly className="font-mono text-sm" />
                  <Button type="button" variant="outline" size="icon" onClick={copyKey}>
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button type="button" variant="outline" size="icon" onClick={regenerateKey}>
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground">
                  Regenerar a chave invalidará a anterior
                </p>
              </div>

              <div className="flex gap-3">
                <Button type="submit">Salvar Alterações</Button>
                <Link href="/dashboard/agents">
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