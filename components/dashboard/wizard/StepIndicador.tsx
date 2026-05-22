import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

const passos = [
  { numero: 1, titulo: "Perfil", subtitulo: "do Negócio" },
  { numero: 2, titulo: "Personalidade", subtitulo: "do Agente" },
  { numero: 3, titulo: "Conhecimento", subtitulo: "e FAQs" },
  { numero: 4, titulo: "Escalamento", subtitulo: "e Contactos" },
];

interface StepIndicadorProps {
  passoActual: number;
}

export function StepIndicador({ passoActual }: StepIndicadorProps) {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between">
        {passos.map((passo, idx) => {
          const concluido = passoActual > passo.numero;
          const activo = passoActual === passo.numero;

          return (
            <div key={passo.numero} className="flex flex-1 items-center">
              {/* Círculo do passo */}
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    "flex h-9 w-9 items-center justify-center rounded-full border-2 text-sm font-semibold transition-all",
                    concluido
                      ? "border-primary bg-primary text-white"
                      : activo
                      ? "border-primary bg-white text-primary shadow-sm shadow-primary/20"
                      : "border-gray-200 bg-white text-gray-400"
                  )}
                >
                  {concluido ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    passo.numero
                  )}
                </div>
                <div className="mt-1.5 text-center">
                  <p
                    className={cn(
                      "text-xs font-medium leading-none",
                      activo ? "text-primary" : concluido ? "text-gray-700" : "text-gray-400"
                    )}
                  >
                    {passo.titulo}
                  </p>
                  <p className="text-[10px] text-gray-400">{passo.subtitulo}</p>
                </div>
              </div>

              {/* Linha conectora */}
              {idx < passos.length - 1 && (
                <div
                  className={cn(
                    "mx-2 mb-7 h-0.5 flex-1 transition-all",
                    passoActual > passo.numero ? "bg-primary" : "bg-gray-200"
                  )}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
