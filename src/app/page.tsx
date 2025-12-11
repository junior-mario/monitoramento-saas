import { MadeWithDyad } from "@/components/made-with-dyad";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="grid grid-rows-[1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-1 items-center sm:items-start max-w-3xl">
        <h1 className="text-3xl font-semibold tracking-tight">Monitoramento Simples e Eficiente</h1>
        <p className="text-muted-foreground">
          Crie monitores HTTP ou Ping, receba feedback instantâneo e visualize status em um dashboard básico.
          Este é o MVP inicial para validar a proposta antes de conectar backend e banco.
        </p>
        <div className="flex gap-3">
          <Link href="/dashboard">
            <Button size="lg">Começar agora</Button>
          </Link>
          <Link href="https://www.dyad.sh/" target="_blank" rel="noopener noreferrer" className="text-sm underline">
            Ver documentação
          </Link>
        </div>
      </main>
      <MadeWithDyad />
    </div>
  );
}