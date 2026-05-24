"use client";

import { useState, useEffect, useTransition } from "react";
import { ChevronLeft, ChevronRight, Save, CheckCircle2, Loader2, AlertCircle } from "lucide-react";
import { StepIndicador } from "@/components/dashboard/wizard/StepIndicador";
import { Step1Perfil } from "@/components/dashboard/wizard/Step1Perfil";
import { Step2Personalidade } from "@/components/dashboard/wizard/Step2Personalidade";
import { Step3Conhecimento } from "@/components/dashboard/wizard/Step3Conhecimento";
import { Step4Escalamento } from "@/components/dashboard/wizard/Step4Escalamento";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { type DadosFormulario, dadosIniciais } from "@/lib/types/agentConfig";
import { guardarConfigAgente, getAgentConfig } from "@/app/(dashboard)/config/actions";

const TITULOS_PASSOS = [
  { titulo: "Perfil do Negócio", descricao: "Conta-nos sobre a tua empresa" },
  { titulo: "Personalidade do Agente", descricao: "Define como o agente comunica" },
  { titulo: "Conhecimento e FAQs", descricao: "Dá ao agente a informação que precisa" },
  { titulo: "Escalamento e Contactos", descricao: "Define quando e como transferir para humano" },
];

type Erros = Partial<Record<string, string>>;

function validarPasso(passo: number, dados: DadosFormulario): Erros {
  const erros: Erros = {};

  if (passo === 1) {
    if (!dados.nomeNegocio.trim()) erros.nomeNegocio = "O nome do negócio é obrigatório.";
    if (!dados.sector) erros.sector = "Selecciona um sector de actividade.";
    if (!dados.descricao.trim()) erros.descricao = "A descrição do negócio é obrigatória.";
  }

  if (passo === 2) {
    if (!dados.nomeAgente.trim()) erros.nomeAgente = "O nome do agente é obrigatório.";
    if (!dados.mensagemBoasVindas.trim())
      erros.mensagemBoasVindas = "A mensagem de boas-vindas é obrigatória.";
  }

  if (passo === 4) {
    if (dados.emailDono && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(dados.emailDono)) {
      erros.emailDono = "Introduz um email válido.";
    }
  }

  return erros;
}

export function ConfigWizard() {
  const [passo, setPasso] = useState(1);
  const [dados, setDados] = useState<DadosFormulario>(dadosIniciais);
  const [erros, setErros] = useState<Erros>({});
  const [estadoGuardar, setEstadoGuardar] = useState<"idle" | "sucesso" | "erro">("idle");
  const [mensagemErro, setMensagemErro] = useState("");
  const [isPending, startTransition] = useTransition();
  const [carregando, setCarregando] = useState(true);
  const [existeConfig, setExisteConfig] = useState(false);

  useEffect(() => {
    getAgentConfig().then((config) => {
      if (config) {
        setDados(config);
        setExisteConfig(true);
      }
      setCarregando(false);
    });
  }, []);

  const onChange = (campo: keyof DadosFormulario, valor: DadosFormulario[keyof DadosFormulario]) => {
    setDados((prev) => ({ ...prev, [campo]: valor }));
    // Limpar erro do campo ao editar
    if (erros[campo]) setErros((prev) => ({ ...prev, [campo]: undefined }));
  };

  const avancar = () => {
    const novosErros = validarPasso(passo, dados);
    if (Object.keys(novosErros).length > 0) {
      setErros(novosErros);
      return;
    }
    setErros({});
    setPasso((p) => Math.min(p + 1, 4));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const recuar = () => {
    setErros({});
    setPasso((p) => Math.max(p - 1, 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const guardar = () => {
    const novosErros = validarPasso(passo, dados);
    if (Object.keys(novosErros).length > 0) {
      setErros(novosErros);
      return;
    }

    startTransition(async () => {
      setEstadoGuardar("idle");
      const resultado = await guardarConfigAgente(dados);
      if (resultado.sucesso) {
        setEstadoGuardar("sucesso");
      } else {
        setEstadoGuardar("erro");
        setMensagemErro(resultado.erro ?? "Erro desconhecido.");
      }
    });
  };

  const infoStep = TITULOS_PASSOS[passo - 1];

  if (carregando) {
    return (
      <div className="mx-auto flex max-w-2xl items-center justify-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      {/* Step indicator */}
      <StepIndicador passoActual={passo} />

      {/* Card principal */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="border-b border-gray-100 pb-4">
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">
              {passo}
            </span>
            <div>
              <CardTitle className="text-lg">{infoStep.titulo}</CardTitle>
              <CardDescription className="text-sm">{infoStep.descricao}</CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-6">
          {passo === 1 && (
            <Step1Perfil dados={dados} erros={erros} onChange={onChange} />
          )}
          {passo === 2 && (
            <Step2Personalidade dados={dados} erros={erros} onChange={onChange} />
          )}
          {passo === 3 && (
            <Step3Conhecimento dados={dados} onChange={onChange} />
          )}
          {passo === 4 && (
            <Step4Escalamento dados={dados} erros={erros} onChange={onChange} />
          )}
        </CardContent>
      </Card>

      {/* Feedback guardar */}
      {estadoGuardar === "sucesso" && (
        <div className="flex items-center gap-3 rounded-xl border border-green-200 bg-green-50 p-4">
          <CheckCircle2 className="h-5 w-5 shrink-0 text-green-500" />
          <div>
            <p className="text-sm font-semibold text-green-800">
              {existeConfig ? "Configuração actualizada com sucesso!" : "Configuração guardada com sucesso!"}
            </p>
            <p className="text-xs text-green-700">
              O system prompt do teu agente foi gerado e guardado na base de dados.
            </p>
          </div>
        </div>
      )}

      {estadoGuardar === "erro" && (
        <div className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-4">
          <AlertCircle className="h-5 w-5 shrink-0 text-red-500" />
          <div>
            <p className="text-sm font-semibold text-red-800">Erro ao guardar</p>
            <p className="text-xs text-red-700">{mensagemErro}</p>
          </div>
        </div>
      )}

      {/* Navegação */}
      <div className="flex items-center justify-between">
        <Button
          type="button"
          variant="outline"
          onClick={recuar}
          disabled={passo === 1 || isPending}
          className="gap-2"
        >
          <ChevronLeft className="h-4 w-4" />
          Anterior
        </Button>

        <p className="text-xs text-gray-400">
          Passo {passo} de 4
        </p>

        {passo < 4 ? (
          <Button type="button" onClick={avancar} disabled={isPending} className="gap-2">
            Próximo
            <ChevronRight className="h-4 w-4" />
          </Button>
        ) : (
          <Button
            type="button"
            onClick={guardar}
            disabled={isPending}
            className="gap-2 bg-green-600 hover:bg-green-700"
          >
            {isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                {existeConfig ? "A actualizar…" : "A guardar…"}
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                {existeConfig ? "Actualizar Configuração" : "Guardar Configuração"}
              </>
            )}
          </Button>
        )}
      </div>
    </div>
  );
}
