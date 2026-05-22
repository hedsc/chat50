"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { type DadosFormulario, type FAQ } from "@/lib/types/agentConfig";

interface Step3Props {
  dados: DadosFormulario;
  onChange: (campo: keyof DadosFormulario, valor: any) => void;
}

export function Step3Conhecimento({ dados, onChange }: Step3Props) {
  const [expandidos, setExpandidos] = useState<number[]>([0]);

  const atualizarFaq = (idx: number, campo: keyof FAQ, valor: string) => {
    const novasFaqs = dados.faqs.map((f, i) =>
      i === idx ? { ...f, [campo]: valor } : f
    );
    onChange("faqs", novasFaqs);
  };

  const toggleExpandir = (idx: number) => {
    setExpandidos((prev) =>
      prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]
    );
  };

  const faqsPreenchidas = dados.faqs.filter((f) => f.pergunta.trim()).length;

  return (
    <div className="space-y-5">
      {/* FAQs */}
      <div>
        <div className="mb-3 flex items-center justify-between">
          <div>
            <Label>Perguntas Frequentes (FAQs)</Label>
            <p className="mt-0.5 text-xs text-gray-400">
              {faqsPreenchidas}/10 perguntas preenchidas · Clica para expandir cada uma
            </p>
          </div>
        </div>

        <div className="space-y-2">
          {dados.faqs.map((faq, idx) => {
            const expandido = expandidos.includes(idx);
            const temConteudo = faq.pergunta.trim() || faq.resposta.trim();

            return (
              <div
                key={idx}
                className={`rounded-lg border transition-all ${
                  temConteudo ? "border-primary/30 bg-primary/5" : "border-gray-200 bg-white"
                }`}
              >
                {/* Cabeçalho da FAQ */}
                <button
                  type="button"
                  onClick={() => toggleExpandir(idx)}
                  className="flex w-full items-center justify-between px-4 py-3 text-left"
                >
                  <span className="text-sm font-medium text-gray-700">
                    {faq.pergunta.trim() ? (
                      <span className="text-gray-900">{faq.pergunta.slice(0, 60)}{faq.pergunta.length > 60 ? "…" : ""}</span>
                    ) : (
                      <span className="text-gray-400">FAQ {idx + 1} — clica para adicionar</span>
                    )}
                  </span>
                  {expandido ? (
                    <ChevronUp className="h-4 w-4 shrink-0 text-gray-400" />
                  ) : (
                    <ChevronDown className="h-4 w-4 shrink-0 text-gray-400" />
                  )}
                </button>

                {/* Conteúdo expandido */}
                {expandido && (
                  <div className="space-y-3 border-t border-gray-100 px-4 pb-4 pt-3">
                    <div className="space-y-1">
                      <p className="text-xs font-medium text-gray-500">Pergunta</p>
                      <Input
                        placeholder="O que o cliente pergunta?"
                        value={faq.pergunta}
                        onChange={(e) => atualizarFaq(idx, "pergunta", e.target.value)}
                      />
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs font-medium text-gray-500">Resposta</p>
                      <Textarea
                        placeholder="Qual é a resposta correcta?"
                        value={faq.resposta}
                        onChange={(e) => atualizarFaq(idx, "resposta", e.target.value)}
                        rows={2}
                      />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Catálogo / Preçário */}
      <div className="space-y-1.5">
        <Label>Preçário / Catálogo de Produtos e Serviços</Label>
        <Textarea
          placeholder={`Cola aqui o teu preçário ou catálogo em texto simples. Exemplo:\n\nMENU PRINCIPAL\n• Prato do dia — 8,50€\n• Sopa — 2,00€\n• Sobremesa — 3,00€\n\nO agente usará este conteúdo para responder a perguntas sobre preços.`}
          value={dados.catalogo}
          onChange={(e) => onChange("catalogo", e.target.value)}
          rows={8}
          className="font-mono text-xs"
        />
        <p className="text-xs text-gray-400">
          Quanto mais detalhado, menos o agente precisará de transferir para humano.
        </p>
      </div>
    </div>
  );
}
