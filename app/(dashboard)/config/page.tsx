import { ConfigWizard } from "@/components/dashboard/ConfigWizard";

export default function PaginaConfiguracao() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-gray-900">
          Configuração do Agente
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          Segue os 4 passos para configurar o teu assistente de IA para WhatsApp.
        </p>
      </div>

      <ConfigWizard />
    </div>
  );
}
