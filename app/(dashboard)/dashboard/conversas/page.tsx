import { MessageSquare } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function PaginaConversas() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-gray-900">Conversas</h2>
        <p className="mt-1 text-sm text-gray-500">
          Histórico de todas as conversas do teu agente.
        </p>
      </div>

      <Card className="border-0 shadow-sm">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-blue-50 p-2">
              <MessageSquare className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <CardTitle>Sem conversas</CardTitle>
              <CardDescription>Ainda não existem conversas registadas</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500">
            Depois de ligar o teu número de WhatsApp e o agente começar a responder,
            todas as conversas aparecerão aqui.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
