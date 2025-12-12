import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Activity, Server, FileText, CheckCircle2, HelpCircle, MessageSquare } from "lucide-react";
import { MadeWithDyad } from "@/components/made-with-dyad";

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Header simples */}
      <header className="sticky top-0 z-30 w-full border-b bg-background/80 backdrop-blur">
        <div className="mx-auto max-w-6xl px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image src="/globe.svg" alt="Conecta Pro" width={28} height={28} />
            <span className="font-semibold tracking-tight">Conecta Pro</span>
          </div>
          <nav className="hidden md:flex items-center gap-4">
            <Link href="/dashboard" className="text-sm text-muted-foreground hover:text-foreground">Dashboard</Link>
            <Link href="/dashboard/monitors" className="text-sm text-muted-foreground hover:text-foreground">Monitores</Link>
            <Link href="/dashboard/reports" className="text-sm text-muted-foreground hover:text-foreground">Relatórios</Link>
          </nav>
          <div className="flex items-center gap-2">
            <Link href="/dashboard">
              <Button size="sm">Entrar</Button>
            </Link>
          </div>
        </div>
      </header>

      <main>
        {/* Hero */}
        <section className="mx-auto max-w-6xl px-6 pt-16 pb-8">
          <div className="grid items-center gap-8 lg:grid-cols-2">
            <div className="space-y-5">
              <Badge className="bg-primary/15 text-primary">MVP • Conecta Pro</Badge>
              <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">
                Monitoramento de dispositivos rápido, simples e moderno
              </h1>
              <p className="text-muted-foreground max-w-prose">
                Acompanhe uptime, configure agentes internos e gere relatórios elegantes. Pronto para validar sua ideia e impressionar seus usuários.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link href="/dashboard">
                  <Button size="lg">Começar agora</Button>
                </Link>
                <Link href="/dashboard/monitors/new">
                  <Button size="lg" variant="outline">Criar monitor</Button>
                </Link>
              </div>
              <div className="flex items-center gap-4 pt-3 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  <span>Sem backend necessário</span>
                </div>
                <div className="flex items-center gap-1">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  <span>Interface em Tailwind + Shadcn</span>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="relative mx-auto flex w-full max-w-lg items-center justify-center">
                <Image
                  src="/window.svg"
                  alt="Exemplo de monitoramento"
                  width={560}
                  height={360}
                  className="rounded-lg border shadow-sm"
                  priority
                />
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="mx-auto max-w-6xl px-6 py-10">
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
        </section>

        {/* Depoimentos */}
        <section className="mx-auto max-w-6xl px-6 py-10">
          <h2 className="text-2xl font-semibold mb-6">O que dizem nossos usuários</h2>
          <div className="grid gap-6 sm:grid-cols-2">
            <Card>
              <CardContent className="p-6 space-y-3">
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-primary" />
                  <span className="text-sm text-muted-foreground">Equipe de TI, Saúde</span>
                </div>
                <p className="text-sm">
                  “Conecta Pro simplificou nosso monitoramento. Em poucos minutos tínhamos monitores em produção e relatórios claros para a diretoria.”
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 space-y-3">
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-primary" />
                  <span className="text-sm text-muted-foreground">Startup, Fintech</span>
                </div>
                <p className="text-sm">
                  “A interface é muito intuitiva e os relatórios ficaram excelentes para compartilhar com nosso time de produto.”
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* FAQ */}
        <section className="mx-auto max-w-6xl px-6 py-10">
          <h2 className="text-2xl font-semibold mb-6">Perguntas frequentes</h2>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>
                <div className="flex items-center gap-2">
                  <HelpCircle className="h-5 w-5 text-primary" />
                  Preciso de backend para começar?
                </div>
              </AccordionTrigger>
              <AccordionContent>
                Não. A versão atual funciona sem backend e mantém dados localmente para validação rápida.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>
                <div className="flex items-center gap-2">
                  <HelpCircle className="h-5 w-5 text-primary" />
                  Consigo criar monitores HTTP?
                </div>
              </AccordionTrigger>
              <AccordionContent>
                Sim. Vá em “Criar monitor” e configure endpoints HTTP/HTTPS para acompanhar disponibilidade e latência.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>
                <div className="flex items-center gap-2">
                  <HelpCircle className="h-5 w-5 text-primary" />
                  Há suporte a relatórios?
                </div>
              </AccordionTrigger>
              <AccordionContent>
                Sim. Crie e compartilhe relatórios com gráficos a partir dos dados coletados pelos monitores.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </section>

        {/* CTA final */}
        <section className="mx-auto max-w-6xl px-6 py-12">
          <div className="flex flex-col items-center gap-4 rounded-lg border p-8 text-center">
            <h3 className="text-xl font-semibold">Pronto para começar?</h3>
            <p className="text-sm text-muted-foreground">
              Crie seu primeiro monitor e acompanhe tudo em um único painel.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/dashboard">
                <Button size="lg">Ir para o Dashboard</Button>
              </Link>
              <Link href="/dashboard/monitors/new">
                <Button size="lg" variant="outline">Criar monitor</Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t">
        <div className="mx-auto max-w-6xl px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Image src="/next.svg" alt="Next.js" width={20} height={20} />
            <Image src="/vercel.svg" alt="Vercel" width={20} height={20} />
            <span>Construído com Next.js + Tailwind + Shadcn</span>
          </div>
          <div className="text-xs text-muted-foreground">© {new Date().getFullYear()} Conecta Pro</div>
        </div>
        <div className="mx-auto max-w-6xl px-6 pb-6">
          <MadeWithDyad />
        </div>
      </footer>
    </div>
  );
}