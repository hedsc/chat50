"use client";

import { useState, useEffect, useRef } from "react";
import { Wifi, Loader2, CheckCircle2, AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

type Fase = "idle" | "criando" | "aguardar_scan" | "conectado" | "erro";

interface Estado {
  fase: Fase;
  qrcode: string | null;
  instanceName: string;
  token: string;
  erro: string;
}

const ESTADO_INICIAL: Estado = {
  fase: "idle",
  qrcode: null,
  instanceName: "",
  token: "",
  erro: "",
};

export function ModalLigarWhatsApp() {
  const [aberto, setAberto] = useState(false);
  const [estado, setEstado] = useState<Estado>(ESTADO_INICIAL);
  const intervaloRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const pararPolling = () => {
    if (intervaloRef.current) {
      clearInterval(intervaloRef.current);
      intervaloRef.current = null;
    }
  };

  useEffect(() => {
    if (!aberto) {
      pararPolling();
      setEstado(ESTADO_INICIAL);
    }
    return () => pararPolling();
  }, [aberto]);

  const iniciarLigacao = async () => {
    setEstado((e) => ({ ...e, fase: "criando", erro: "" }));

    const res = await fetch("/api/whatsapp/criar-instancia", { method: "POST" });
    const data = await res.json();

    if (!res.ok) {
      setEstado((e) => ({ ...e, fase: "erro", erro: data.erro ?? "Erro ao criar instância." }));
      return;
    }

    setEstado((e) => ({
      ...e,
      fase: "aguardar_scan",
      qrcode: data.qrcode ?? null,
      instanceName: data.instanceName,
      token: data.token,
    }));

    // Polling a cada 3 segundos
    intervaloRef.current = setInterval(async () => {
      const estadoRes = await fetch(
        `/api/whatsapp/estado?instanceName=${encodeURIComponent(data.instanceName)}&token=${encodeURIComponent(data.token)}`
      );
      if (!estadoRes.ok) return;

      const estadoData = await estadoRes.json();

      // Atualizar QR se disponível
      if (estadoData.qrcode) {
        setEstado((e) => ({ ...e, qrcode: estadoData.qrcode }));
      }

      const conectado = estadoData.estado === "open" || estadoData.estado === "conectado";
      if (conectado) {
        pararPolling();

        // Guardar na BD
        await fetch("/api/whatsapp/guardar", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ instanceName: data.instanceName, token: data.token }),
        });

        setEstado((e) => ({ ...e, fase: "conectado" }));
      }
    }, 3000);
  };

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        className="gap-2"
        onClick={() => setAberto(true)}
      >
        <Wifi className="h-3.5 w-3.5" />
        Ligar WhatsApp
      </Button>

      <Dialog open={aberto} onOpenChange={setAberto}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Ligar WhatsApp</DialogTitle>
            <DialogDescription>
              Conecta o teu número de WhatsApp para activar o agente de IA.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col items-center gap-6 py-4">
            {/* idle */}
            {estado.fase === "idle" && (
              <>
                <div className="rounded-full bg-gray-100 p-6">
                  <Wifi className="h-10 w-10 text-gray-400" />
                </div>
                <p className="text-center text-sm text-gray-500">
                  Clica em &quot;Iniciar Ligação&quot; para gerar o QR code. Abre o WhatsApp no
                  telemóvel e vai a <strong>Dispositivos Ligados → Ligar um Dispositivo</strong>.
                </p>
                <Button onClick={iniciarLigacao} className="w-full gap-2">
                  <Wifi className="h-4 w-4" />
                  Iniciar Ligação
                </Button>
              </>
            )}

            {/* criando */}
            {estado.fase === "criando" && (
              <>
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
                <p className="text-sm text-gray-500">A criar instância WhatsApp…</p>
              </>
            )}

            {/* aguardar scan */}
            {estado.fase === "aguardar_scan" && (
              <>
                {estado.qrcode ? (
                  <div className="rounded-xl border-2 border-gray-200 p-3">
                    <img
                      src={estado.qrcode}
                      alt="QR Code WhatsApp"
                      className="h-56 w-56 rounded-lg"
                    />
                  </div>
                ) : (
                  <div className="flex h-56 w-56 items-center justify-center rounded-xl border-2 border-dashed border-gray-200">
                    <Loader2 className="h-8 w-8 animate-spin text-gray-300" />
                  </div>
                )}
                <div className="flex items-center gap-2 text-sm text-amber-600">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  A aguardar leitura do QR code…
                </div>
                <p className="text-center text-xs text-gray-400">
                  Abre o WhatsApp → Menu → Dispositivos Ligados → Ligar um Dispositivo
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2"
                  onClick={iniciarLigacao}
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                  Novo QR Code
                </Button>
              </>
            )}

            {/* conectado */}
            {estado.fase === "conectado" && (
              <>
                <div className="rounded-full bg-green-100 p-6">
                  <CheckCircle2 className="h-10 w-10 text-green-500" />
                </div>
                <div className="text-center">
                  <p className="font-semibold text-green-700">WhatsApp conectado!</p>
                  <p className="mt-1 text-sm text-gray-500">
                    O teu agente de IA já está activo e a responder mensagens.
                  </p>
                </div>
                <Button onClick={() => setAberto(false)} className="w-full bg-green-600 hover:bg-green-700">
                  Fechar
                </Button>
              </>
            )}

            {/* erro */}
            {estado.fase === "erro" && (
              <>
                <div className="rounded-full bg-red-100 p-6">
                  <AlertCircle className="h-10 w-10 text-red-500" />
                </div>
                <div className="text-center">
                  <p className="font-semibold text-red-700">Erro na ligação</p>
                  <p className="mt-1 text-sm text-gray-500">{estado.erro}</p>
                </div>
                <Button variant="outline" onClick={iniciarLigacao} className="w-full gap-2">
                  <RefreshCw className="h-4 w-4" />
                  Tentar novamente
                </Button>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
