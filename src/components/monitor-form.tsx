"use client"

import * as React from "react"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Card } from "@/components/ui/card"
import { toast } from "sonner"
import type { Monitor, MonitorType } from "@/types/monitor"

const schema = z.object({
  name: z.string().min(2, "Nome muito curto"),
  type: z.enum(["http", "ping"]),
  target: z.string().min(3, "Alvo inválido"),
  interval: z.coerce.number().min(30, "Intervalo mínimo: 30s").default(300),
})

type Values = z.infer<typeof schema>

interface Props {
  onCreate: (monitor: Monitor) => void
}

export function MonitorForm({ onCreate }: Props) {
  const form = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      type: "http",
      target: "",
      interval: 300,
    },
  })

  function handleSubmit(values: Values) {
    const id = typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : Math.random().toString(36).slice(2)
    const monitor: Monitor = {
      id,
      name: values.name,
      type: values.type as MonitorType,
      target: values.target,
      interval: values.interval,
      status: "unknown",
    }
    onCreate(monitor)
    toast.success("Monitor criado")
    form.reset({ name: "", type: "http", target: "", interval: 300 })
  }

  return (
    <Card className="p-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome</FormLabel>
                <FormControl>
                  <Input placeholder="Meu site" {...field} />
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
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="http">HTTP/HTTPS</SelectItem>
                    <SelectItem value="ping">Ping</SelectItem>
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
              <FormItem className="sm:col-span-2">
                <FormLabel>Alvo</FormLabel>
                <FormControl>
                  <Input placeholder="https://example.com ou 8.8.8.8" {...field} />
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
          <div className="sm:col-span-2">
            <Button type="submit" className="w-full">Adicionar Monitor</Button>
          </div>
        </form>
      </Form>
    </Card>
  )
}