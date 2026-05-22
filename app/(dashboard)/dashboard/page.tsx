import Link from "next/link";
import {
  MessageSquare,
  CheckCircle2,
  ArrowUpRight,
  Wifi,
  WifiOff,
  Bot,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const metricas = [
  {
    titulo: "Conversas este mês",
    valor: "0",
    descricao: "Nenhuma conversa registada",
    icone: MessageSquare,
    cor: "text-blue-600",
    fundo: "bg-blue-50",
  },
  {
    titulo: "Mensagens respondidas",
    valor: "0",
    descricao: "Taxa de resposta: —",
    icone: CheckCircle2,
    cor: "text-green-600",
    fundo: "bg-green-50",
  },
  {
    titulo: "Escalamentos",
    valor: "0",
    descricao: "Transferências para humano",
    icone: ArrowUpRight,
    cor: "text-orange-600",
    fundo: "bg-orange-50",
  },
];

export default function PaginaPainel() {
  return (
    <div className="space-y-6">
      {/* Cabeçalho da página */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-gray-900">Dashboard</h2>
        <p className="mt-1 text-sm text-gray-500">
          Bem-vindo ao Chat 5.0. Aqui tens uma visão geral da tua conta.
        </p>
      </div>

      {/* Cards de métricas */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {metricas.map((metrica) => {
          const Icone = metrica.icone;
          return (
            <Card key={metrica.titulo} className="border-0 shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  {metrica.titulo}
                </CardTitle>
                <div className={`rounded-lg p-2 ${metrica.fundo}`}>
                  <Icone className={`h-4 w-4 ${metrica.cor}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900">{metrica.valor}</div>
                <p className="mt-1 text-xs text-gray-500">{metrica.descricao}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Segunda linha: Estado WhatsApp + Agente */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Card estado WhatsApp */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-gray-100 p-2">
                  <WifiOff className="h-5 w-5 text-gray-500" />
                </div>
                <div>
                  <CardTitle className="text-base">WhatsApp</CardTitle>
                  <CardDescription className="text-xs">Estado da ligação</CardDescription>
                </div>
              </div>
              <Badge variant="warning" className="gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-yellow-500" />
                Desconectado
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500">
              O teu número de WhatsApp ainda não está ligado. Vai às configurações para conectar
              o teu agente.
            </p>
            <div className="mt-4">
              <Link href="/dashboard/config">
                <Button variant="outline" size="sm" className="gap-2">
                  <Wifi className="h-3.5 w-3.5" />
                  Ligar WhatsApp
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Card configurar agente */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-primary/10 p-2">
                <Bot className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-base">Agente de IA</CardTitle>
                <CardDescription className="text-xs">Personalização do assistente</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500">
              Configura o comportamento, personalidade e respostas automáticas do teu agente de
              inteligência artificial.
            </p>
            <div className="mt-4">
              <Link href="/dashboard/config">
                <Button size="sm" className="gap-2">
                  <Bot className="h-3.5 w-3.5" />
                  Configurar Agente
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Card actividade recente */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="text-base">Actividade Recente</CardTitle>
          <CardDescription>As últimas conversas e eventos da tua conta</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <MessageSquare className="h-10 w-10 text-gray-300" />
            <p className="mt-3 text-sm font-medium text-gray-500">Sem actividade ainda</p>
            <p className="mt-1 text-xs text-gray-400">
              As conversas do WhatsApp aparecerão aqui depois de ligar o teu número.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
