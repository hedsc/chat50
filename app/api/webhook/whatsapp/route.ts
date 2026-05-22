import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateAgentResponse } from "@/lib/claudeService";

export const dynamic = "force-dynamic";

async function enviarMensagemWhatsApp(para: string, texto: string): Promise<void> {
  const numero = para.replace(/@s\.whatsapp\.net$/, "");
  const res = await fetch(`${process.env.UAZAPI_URL}/send/text`, {
    method: "POST",
    headers: {
      token: process.env.UAZAPI_TOKEN!,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ number: numero, text: texto }),
  });
  if (!res.ok) {
    throw new Error(`uazapi ${res.status}: ${await res.text()}`);
  }
}

interface UazapiPayload {
  instance?: string;
  event?: string;
  data?: {
    from?: string;
    fromMe?: boolean;
    body?: string;
    type?: string;
    timestamp?: number;
  };
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  // ── Parse do corpo ──────────────────────────────────────────────────────────
  let payload: UazapiPayload;
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ erro: "Corpo inválido" }, { status: 400 });
  }

  const { instance, event, data } = payload;

  // Ignorar eventos que não sejam mensagens de texto recebidas
  if (event !== "message") return NextResponse.json({ ok: true });
  if (!data || data.fromMe) return NextResponse.json({ ok: true });
  if (data.type !== "text") return NextResponse.json({ ok: true });

  const { from, body: mensagem, timestamp } = data;

  if (!instance || !from || !mensagem) {
    return NextResponse.json(
      { erro: "Campos obrigatórios em falta: instance, data.from, data.body" },
      { status: 400 }
    );
  }

  console.log("[webhook/whatsapp] Mensagem recebida:");
  console.log("  instance  :", instance);
  console.log("  from      :", from);
  console.log("  body      :", mensagem);
  console.log("  timestamp :", timestamp ? new Date(timestamp * 1000).toISOString() : "—");

  // ── Buscar AgentConfig da instância ────────────────────────────────────────
  const config = await prisma.agentConfig.findFirst({
    where: { instanciaUazapi: instance },
  });
  if (!config) {
    console.warn("[webhook/whatsapp] Instância sem configuração:", instance);
    return NextResponse.json({ ok: true });
  }

  // ── Gerar resposta via Claude ───────────────────────────────────────────────
  let textoResposta: string;
  try {
    textoResposta = await generateAgentResponse(config.systemPrompt, [], mensagem);
  } catch (erro) {
    console.error("[webhook/whatsapp] Erro ao gerar resposta:", erro);
    return NextResponse.json({ ok: true });
  }

  // ── Enviar resposta via uazapi ──────────────────────────────────────────────
  try {
    await enviarMensagemWhatsApp(from, textoResposta);
    console.log("[webhook/whatsapp] Resposta enviada para:", from);
  } catch (erro) {
    console.error("[webhook/whatsapp] Erro ao enviar mensagem:", erro);
  }

  return NextResponse.json({ ok: true }, { status: 200 });
}
