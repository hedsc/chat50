import { AlertTriangle, Mail, Phone } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { TagInput } from "@/components/dashboard/wizard/TagInput";
import { type DadosFormulario } from "@/lib/types/agentConfig";

interface Step4Props {
  dados: DadosFormulario;
  erros: Partial<Record<string, string>>;
  onChange: (campo: keyof DadosFormulario, valor: any) => void;
}

const sugestoesKeywords = [
  "falar com humano",
  "falar com alguém",
  "quero reclamar",
  "reclamação",
  "cancelar",
  "reembolso",
  "urgente",
  "problema",
];

export function Step4Escalamento({ dados, erros, onChange }: Step4Props) {
  const adicionarSugestao = (keyword: string) => {
    if (!dados.keywordsEscalamento.includes(keyword)) {
      onChange("keywordsEscalamento", [...dados.keywordsEscalamento, keyword]);
    }
  };

  return (
    <div className="space-y-6">
      {/* Aviso explicativo */}
      <div className="flex gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4">
        <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
        <div className="text-sm text-amber-800">
          <p className="font-medium">O que é o escalamento?</p>
          <p className="mt-0.5 text-xs leading-relaxed">
            Quando o cliente usar uma das palavras-chave abaixo, o agente transfere
            automaticamente a conversa para um humano. Define aqui as situações em que
            queres ser notificado.
          </p>
        </div>
      </div>

      {/* Keywords */}
      <div className="space-y-2">
        <Label>Palavras-chave de Transferência</Label>
        <TagInput
          tags={dados.keywordsEscalamento}
          onChange={(tags) => onChange("keywordsEscalamento", tags)}
          placeholder="Escreve e prime Enter para adicionar…"
        />
        <div className="mt-2">
          <p className="mb-1.5 text-xs text-gray-400">Sugestões:</p>
          <div className="flex flex-wrap gap-1.5">
            {sugestoesKeywords
              .filter((s) => !dados.keywordsEscalamento.includes(s))
              .map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => adicionarSugestao(s)}
                  className="rounded-full border border-dashed border-gray-300 px-2.5 py-1 text-xs text-gray-500 hover:border-primary hover:text-primary transition-colors"
                >
                  + {s}
                </button>
              ))}
          </div>
        </div>
      </div>

      {/* Contactos */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label>Email do Responsável</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              type="email"
              placeholder="email@exemplo.pt"
              value={dados.emailDono}
              onChange={(e) => onChange("emailDono", e.target.value)}
              erro={erros.emailDono}
              className="pl-9"
            />
          </div>
          <p className="text-xs text-gray-400">
            Receberás uma notificação quando o agente transferir uma conversa.
          </p>
        </div>

        <div className="space-y-1.5">
          <Label>Telefone do Responsável</Label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              type="tel"
              placeholder="+351 900 000 000"
              value={dados.telefoneDono}
              onChange={(e) => onChange("telefoneDono", e.target.value)}
              className="pl-9"
            />
          </div>
          <p className="text-xs text-gray-400">
            Usado para contacto directo em casos urgentes.
          </p>
        </div>
      </div>

      {/* Pré-visualização do prompt */}
      <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
          Resumo da Configuração
        </p>
        <div className="mt-3 space-y-1.5 text-xs text-gray-600">
          <div className="flex gap-2">
            <span className="w-28 shrink-0 font-medium text-gray-500">Keywords:</span>
            <span>
              {dados.keywordsEscalamento.length > 0
                ? dados.keywordsEscalamento.join(", ")
                : "Nenhuma definida"}
            </span>
          </div>
          <div className="flex gap-2">
            <span className="w-28 shrink-0 font-medium text-gray-500">Email:</span>
            <span>{dados.emailDono || "—"}</span>
          </div>
          <div className="flex gap-2">
            <span className="w-28 shrink-0 font-medium text-gray-500">Telefone:</span>
            <span>{dados.telefoneDono || "—"}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
