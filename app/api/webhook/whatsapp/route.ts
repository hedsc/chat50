import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateAgentResponse } from "@/lib/claudeService";

export const dynamic = "force-dynamic";

async function enviarMensagemWhatsApp(para: string, texto: string, instanceToken: string): Promise<void> {
  const res = await fetch(`${process.env.UAZAPI_URL}/send/text`, {
    method: "POST",
    headers: {
      token: instanceToken,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ number: para, text: texto }),
  });
  if (!res.ok) {
    throw new Error(`uazapi ${res.status}: ${await res.text()}`);
  }
}

interface UazapiPayload {
  EventType?: string;
  instanceName?: string;
  token?: string;
  message?: {
    content?: string;
    fromMe?: boolean;
    type?: string;
    messageType?: string;
    chatid?: string;
  };
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  let payload: UazapiPayload;
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ erro: "Corpo inválido" }, { status: 400 });
  }

  console.log("[webhook] payload completo:", JSON.stringify(payload, null, 2));

  const { EventType, instanceName, token: instanceToken, message } = payload;

  if (EventType !== "messages") {
    console.log("[webhook] ignorado — EventType:", EventType);
    return NextResponse.json({ ok: true });
  }

  if (!message || message.fromMe) {
    console.log("[webhook] ignorado — fromMe:", message?.fromMe, "| message existe:", !!message);
    return NextResponse.json({ ok: true });
  }

  if (message.type !== "text" && message.messageType !== "Conversation") {
    console.log("[webhook] ignorado — type:", message.type, "| messageType:", message.messageType);
    return NextResponse.json({ ok: true });
  }

  const { content: mensagem, chatid } = message;

  if (!instanceName || !instanceToken || !chatid || !mensagem) {
    console.log("[webhook] campos em falta — instanceName:", instanceName, "| token:", !!instanceToken, "| chatid:", chatid, "| content:", mensagem);
    return NextResponse.json(
      { erro: "Campos obrigatórios em falta: instanceName, token, message.chatid, message.content" },
      { status: 400 }
    );
  }

  console.log("[webhook] mensagem válida — instance:", instanceName, "| de:", chatid, "| texto:", mensagem);

  // ── Buscar AgentConfig da instância ────────────────────────────────────────
  const config = await prisma.agentConfig.findFirst({
    where: { instanciaUazapi: instanceToken },
  });
  if (!config) {
    console.warn("[webhook] instância sem configuração — token:", instanceToken, "| instanceName:", instanceName);
    return NextResponse.json({ ok: true });
  }

  // ── Gerar resposta via Claude ───────────────────────────────────────────────
  let textoResposta: string;
  try {
    textoResposta = await generateAgentResponse(config.systemPrompt, [], mensagem);
  } catch (erro) {
    console.error("[webhook] erro ao gerar resposta:", erro);
    return NextResponse.json({ ok: true });
  }

  // ── Enviar resposta via uazapi ──────────────────────────────────────────────
  try {
    await enviarMensagemWhatsApp(chatid, textoResposta, instanceToken);
    console.log("[webhook] resposta enviada para:", chatid);
  } catch (erro) {
    console.error("[webhook] erro ao enviar mensagem:", erro);
  }

  return NextResponse.json({ ok: true }, { status: 200 });
}
