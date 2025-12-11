"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { ArrowLeft, Copy } from "lucide-react"
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
import { upsertAgent, generateId, generateApiKey } from "@/lib/storage"
import type { Agent } from "@/types/monitor"

const schema = z.object({
  name: z.string().min(2, "Nome muito curto"),
  description: z.string().optional(),
  region: z.string().optional(),
})

type FormValues = z.infer<typeof schema>

export default function NewAgentPage() {
  const router = useRouter()
  const [apiKey] = React.useState(() => generateApiKey())

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      description: "",
      region: "",
    },
  })

  function onSubmit(values: FormValues) {
    const agent: Agent = {
      id: generateId(),
      name: values.name,
      description: values.description,
      region: values.region,
      apiKey,
      status: "offline",
      monitors: [],
      createdAt: new Date().toISOString(),
    }
    upsertAgent(agent)
    toast.success("Agente criado com sucesso")
    router.push("/dashboard/agents")
  }

  function copyKey() {
    navigator.clipboard.writeText(apiKey)
    toast.success("API Key copiada")
  }

  return (
    <div className="p-6 space-y-6 max-w-2xl">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/agents">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-semibold">Novo Agente</h1>
          <p className="text-muted-foreground">Configure um agente de monitoramento</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Configurações do Agente</CardTitle>
          <CardDescription>
            Agentes permitem monitorar recursos internos da sua rede
          </CardDescription>
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
                      <Input placeholder="Servidor Principal" {...field} />
                    </FormControl>
                    <FormDescription>Nome identificador do agente</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descrição (opcional)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Agente instalado no datacenter principal..."
                        {...field}
                      />
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
                    <FormLabel>Região (opcional)</FormLabel>
                    <FormControl>
                      <Input placeholder="São Paulo, Brasil" {...field} />
                    </FormControl>
                    <FormDescription>Localização física do agente</FormDescription>
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
                </div>
                <p className="text-sm text-muted-foreground">
                  Use esta chave para autenticar o agente. Guarde-a em local seguro.
                </p>
              </div>

              <div className="flex gap-3">
                <Button type="submit">Criar Agente</Button>
                <Link href="/dashboard/agents">
                  <Button type="button" variant="outline">Cancelar</Button>
                </Link>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Instalação do Agente</CardTitle>
          <CardDescription>Execute o comando abaixo no servidor</CardDescription>
        </CardHeader>
        <CardContent>
          <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto">
            <code>{`docker run -d \\
  --name uptimewatch-agent \\
  -e API_KEY=${apiKey} \\
  -e REGION=${form.watch("region") || "default"} \\
  --restart unless-stopped \\
  uptimewatch/agent:latest`}</code>
          </pre>
        </CardContent>
      </Card>
    </div>
  )
}