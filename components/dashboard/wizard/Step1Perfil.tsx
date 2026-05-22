import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { type DadosFormulario, SECTORES, DIAS_SEMANA, HORAS } from "@/lib/types/agentConfig";

interface Step1Props {
  dados: DadosFormulario;
  erros: Partial<Record<string, string>>;
  onChange: (campo: keyof DadosFormulario, valor: DadosFormulario[keyof DadosFormulario]) => void;
}

const selectClass =
  "flex h-10 w-full rounded-md border border-input bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 text-gray-900";

export function Step1Perfil({ dados, erros, onChange }: Step1Props) {
  const toggleDia = (dia: string) => {
    const novos = dados.diasFuncionamento.includes(dia)
      ? dados.diasFuncionamento.filter((d) => d !== dia)
      : [...dados.diasFuncionamento, dia];
    onChange("diasFuncionamento", novos);
  };

  return (
    <div className="space-y-5">
      {/* Nome do negócio */}
      <div className="space-y-1.5">
        <Label obrigatorio>Nome do Negócio</Label>
        <Input
          placeholder="Ex: Restaurante Sabor & Arte"
          value={dados.nomeNegocio}
          onChange={(e) => onChange("nomeNegocio", e.target.value)}
          erro={erros.nomeNegocio}
        />
      </div>

      {/* Sector */}
      <div className="space-y-1.5">
        <Label obrigatorio>Sector de Actividade</Label>
        <select
          value={dados.sector}
          onChange={(e) => onChange("sector", e.target.value)}
          className={selectClass + (erros.sector ? " border-red-400" : "")}
        >
          <option value="">Selecciona o sector…</option>
          {SECTORES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        {erros.sector && <p className="text-xs text-red-500">{erros.sector}</p>}
      </div>

      {/* Descrição */}
      <div className="space-y-1.5">
        <Label obrigatorio>Descrição do Negócio</Label>
        <Textarea
          placeholder="Descreve o teu negócio em 2-3 frases: o que fazes, quem são os teus clientes, o que te diferencia…"
          value={dados.descricao}
          onChange={(e) => onChange("descricao", e.target.value)}
          rows={3}
          erro={erros.descricao}
        />
      </div>

      {/* Dias de funcionamento */}
      <div className="space-y-2">
        <Label>Dias de Funcionamento</Label>
        <div className="flex flex-wrap gap-2">
          {DIAS_SEMANA.map((dia) => {
            const activo = dados.diasFuncionamento.includes(dia);
            return (
              <button
                key={dia}
                type="button"
                onClick={() => toggleDia(dia)}
                className={`rounded-full border px-3.5 py-1.5 text-xs font-medium transition-all ${
                  activo
                    ? "border-primary bg-primary text-white shadow-sm"
                    : "border-gray-200 bg-white text-gray-600 hover:border-primary/50 hover:text-primary"
                }`}
              >
                {dia.slice(0, 3)}
              </button>
            );
          })}
        </div>
      </div>

      {/* Horário */}
      <div className="space-y-1.5">
        <Label>Horário de Funcionamento</Label>
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <p className="mb-1 text-xs text-gray-500">Abertura</p>
            <select
              value={dados.horarioAbertura}
              onChange={(e) => onChange("horarioAbertura", e.target.value)}
              className={selectClass}
            >
              {HORAS.map((h) => (
                <option key={h} value={h}>{h}</option>
              ))}
            </select>
          </div>
          <span className="mt-5 text-gray-400">até</span>
          <div className="flex-1">
            <p className="mb-1 text-xs text-gray-500">Fecho</p>
            <select
              value={dados.horarioFecho}
              onChange={(e) => onChange("horarioFecho", e.target.value)}
              className={selectClass}
            >
              {HORAS.map((h) => (
                <option key={h} value={h}>{h}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
