import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { type DadosFormulario } from "@/lib/types/agentConfig";

interface Step2Props {
  dados: DadosFormulario;
  erros: Partial<Record<string, string>>;
  onChange: (campo: keyof DadosFormulario, valor: DadosFormulario[keyof DadosFormulario]) => void;
}

const opcoesTom = [
  {
    valor: "formal" as const,
    titulo: "Formal",
    descricao: "Linguagem profissional e cuidada. Ideal para saúde, advocacia ou finanças.",
  },
  {
    valor: "simpatico" as const,
    titulo: "Simpático",
    descricao: "Tom próximo e amigável. Ideal para comércio, restauração ou beleza.",
  },
  {
    valor: "neutro" as const,
    titulo: "Neutro",
    descricao: "Objectivo e directo. Funciona bem em qualquer sector.",
  },
];

export function Step2Personalidade({ dados, erros, onChange }: Step2Props) {
  return (
    <div className="space-y-5">
      {/* Nome do agente */}
      <div className="space-y-1.5">
        <Label obrigatorio>Nome do Agente</Label>
        <Input
          placeholder="Ex: Sofia, Max, Assistente do Sabor & Arte…"
          value={dados.nomeAgente}
          onChange={(e) => onChange("nomeAgente", e.target.value)}
          erro={erros.nomeAgente}
        />
        <p className="text-xs text-gray-400">
          Este é o nome com que o agente se apresenta aos clientes.
        </p>
      </div>

      {/* Tom de comunicação */}
      <div className="space-y-2">
        <Label>Tom de Comunicação</Label>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {opcoesTom.map((opcao) => {
            const seleccionado = dados.tom === opcao.valor;
            return (
              <button
                key={opcao.valor}
                type="button"
                onClick={() => onChange("tom", opcao.valor)}
                className={cn(
                  "flex flex-col items-start rounded-xl border-2 p-4 text-left transition-all",
                  seleccionado
                    ? "border-primary bg-primary/5 shadow-sm"
                    : "border-gray-200 bg-white hover:border-gray-300"
                )}
              >
                <div className="flex w-full items-center justify-between">
                  <span
                    className={cn(
                      "text-sm font-semibold",
                      seleccionado ? "text-primary" : "text-gray-700"
                    )}
                  >
                    {opcao.titulo}
                  </span>
                  <div
                    className={cn(
                      "h-4 w-4 rounded-full border-2",
                      seleccionado
                        ? "border-primary bg-primary"
                        : "border-gray-300 bg-white"
                    )}
                  >
                    {seleccionado && (
                      <div className="h-full w-full scale-50 rounded-full bg-white" />
                    )}
                  </div>
                </div>
                <p className="mt-1.5 text-xs text-gray-500">{opcao.descricao}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Mensagem de boas-vindas */}
      <div className="space-y-1.5">
        <Label obrigatorio>Mensagem de Boas-Vindas</Label>
        <Textarea
          placeholder='Ex: "Olá! Sou a Sofia do Restaurante Sabor & Arte. Como posso ajudar?"'
          value={dados.mensagemBoasVindas}
          onChange={(e) => onChange("mensagemBoasVindas", e.target.value)}
          rows={3}
          erro={erros.mensagemBoasVindas}
        />
        <p className="text-xs text-gray-400">
          Esta mensagem é enviada automaticamente no início de cada conversa.
        </p>
      </div>
    </div>
  );
}
