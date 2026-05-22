import { Settings } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function PaginaDefinicoes() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-gray-900">Definições</h2>
        <p className="mt-1 text-sm text-gray-500">
          Gere a tua conta, plano e preferências.
        </p>
      </div>

      <Card className="border-0 shadow-sm">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-gray-100 p-2">
              <Settings className="h-5 w-5 text-gray-600" />
            </div>
            <div>
              <CardTitle>Em construção</CardTitle>
              <CardDescription>Esta secção estará disponível em breve</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500">
            Aqui poderás gerir os dados da tua conta, mudar de plano e configurar
            notificações e preferências gerais.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
