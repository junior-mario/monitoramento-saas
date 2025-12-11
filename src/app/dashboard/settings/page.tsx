"use client"

import * as React from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"

export default function SettingsPage() {
  const [emailNotifications, setEmailNotifications] = React.useState(true)
  const [slackNotifications, setSlackNotifications] = React.useState(false)

  function handleSave() {
    toast.success("Configurações salvas")
  }

  function handleClearData() {
    if (confirm("Tem certeza? Todos os dados serão removidos.")) {
      localStorage.clear()
      toast.success("Dados removidos. Recarregue a página.")
    }
  }

  return (
    <div className="p-6 space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-semibold">Configurações</h1>
        <p className="text-muted-foreground">
          Gerencie as configurações da sua conta
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Perfil</CardTitle>
          <CardDescription>Informações básicas da conta</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome</Label>
            <Input id="name" placeholder="Seu nome" defaultValue="Usuário MVP" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="seu@email.com" defaultValue="usuario@exemplo.com" />
          </div>
          <Button onClick={handleSave}>Salvar</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Notificações</CardTitle>
          <CardDescription>Configure como receber alertas</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Notificações por Email</p>
              <p className="text-sm text-muted-foreground">
                Receba alertas de downtime por email
              </p>
            </div>
            <Switch checked={emailNotifications} onCheckedChange={setEmailNotifications} />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Integração Slack</p>
              <p className="text-sm text-muted-foreground">
                Envie alertas para um canal do Slack
              </p>
            </div>
            <Switch checked={slackNotifications} onCheckedChange={setSlackNotifications} />
          </div>
          {slackNotifications && (
            <div className="space-y-2">
              <Label htmlFor="webhook">Webhook URL</Label>
              <Input id="webhook" placeholder="https://hooks.slack.com/..." />
            </div>
          )}
          <Button onClick={handleSave}>Salvar Notificações</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Dados</CardTitle>
          <CardDescription>Gerenciamento de dados locais (MVP)</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            No MVP, os dados são armazenados localmente no navegador.
            Em produção, serão sincronizados com o servidor.
          </p>
          <Button variant="destructive" onClick={handleClearData}>
            Limpar Todos os Dados
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}