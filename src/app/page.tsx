import { MadeWithDyad } from "@/components/made-with-dyad";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Activity, Server, FileText } from "lucide-react";
import BrandGradient from "@/components/BrandGradient";

export default function Home() {
  return (
    <div className="relative min-h-screen">
      <BrandGradient />
      <div className="grid grid-rows-[1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 sm:p-20 font-[family-name:var(--font-geist-sans)]">
        <main className="flex flex-col gap-10 row-start-1 items-center sm:items-start max-w-5xl w-full">
          <div className="text-center sm:text-left space-y-4">
            <Badge className="bg-primary/15 text-primary">MVP • Agora mais bonito</Badge>
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight bg-gradient-to-r from-blue-600 via-violet-600 to-emerald-600 bg-clip-text text-transparent">
              Monitoramento de dispositivos rápido, simples e colorido
            </h1>
            <p className="text-muted-foreground max-w-2xl">
              Acompanhe o uptime, configure agentes internos e gere relatórios com um design moderno.
              Pronto para validar sua ideia e impressionar seus usuários.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/dashboard">
                <Button size="lg">Começar agora</Button>
              </Link>
              <Link href="/dashboard/monitors/new">
                <Button size="lg" variant="outline">Criar monitor</Button>
              </Link>
            </div>
          </div>

          <div className="grid w-full gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <Card className="border-primary/30 hover:border-primary transition-colors">
              <CardContent className="p-6 space-y-3">
                <Activity className="h-6 w-6 text-blue-600" />
                <h3 className="font-semibold">Uptime e Latência</h3>
                <p className="text-sm text-muted-foreground">
                  Monitore HTTP/HTTPS e veja tempos de resposta com feedback imediato.
                </p>
              </CardContent>
            </Card>
            <Card className="border-violet-500/30 hover:border-violet-500 transition-colors">
              <CardContent className="p-6 space-y-3">
                <Server className="h-6 w-6 text-violet-600" />
                <h3 className="font-semibold">Agentes Internos</h3>
                <p className="text-sm text-muted-foreground">
                  Configure agentes para monitorar recursos em redes privadas.
                </p>
              </CardContent>
            </Card>
            <Card className="border-emerald-500/30 hover:border-emerald-500 transition-colors">
              <CardContent className="p-6 space-y-3">
                <FileText className="h-6 w-6 text-emerald-600" />
                <h3 className="font-semibold">Relatórios Elegantes</h3>
                <p className="text-sm text-muted-foreground">
                  Gere relatórios com gráficos e compartilhe resultados com sua equipe.
                </p>
              </CardContent>
            </Card>
          </div>
        </main>
        <MadeWithDyad />
      </div>
    </div>
  );
}