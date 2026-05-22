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

export async function POST(req: NextRequest): Promise<NextResponse> {
  // ── Autenticação ────────────────────────────────────────────────────────────
  const authHeader = req.headers.get("authorization");
  const tokenEsperado = process.env.UAZAPI_TOKEN;

  if (!authHeader || authHeader !== tokenEsperado) {
    return NextResponse.json({ erro: "Não autorizado" }, { status: 401 });
  }

  // ── Parse do corpo ──────────────────────────────────────────────────────────
  let body: { instanceId?: string; from?: string; body?: string; timestamp?: number };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ erro: "Corpo inválido" }, { status: 400 });
  }

  const { instanceId, from, body: mensagem, timestamp } = body;

  if (!instanceId || !from || !mensagem) {
    return NextResponse.json(
      { erro: "Campos obrigatórios em falta: instanceId, from, body" },
      { status: 400 }
    );
  }

  console.log("[webhook/whatsapp] Mensagem recebida:");
  console.log("  instanceId:", instanceId);
  console.log("  from      :", from);
  console.log("  body      :", mensagem);
  console.log("  timestamp :", timestamp ? new Date(timestamp * 1000).toISOString() : "—");

  // ── Buscar AgentConfig da instância ────────────────────────────────────────
  const config = await prisma.agentConfig.findFirst({
    where: { instanciaUazapi: instanceId },
  });
  if (!config) {
    console.warn("[webhook/whatsapp] Instância sem configuração:", instanceId);
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
