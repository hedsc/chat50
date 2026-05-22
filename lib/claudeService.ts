import Anthropic from "@anthropic-ai/sdk";

const MODEL = "claude-3-haiku-20240307";
const MAX_TOKENS = 300; // respostas curtas para chatbot WhatsApp (2-3 frases)

export interface MensagemHistorico {
  role: "user" | "assistant";
  content: string;
}

let clienteAnthropic: Anthropic | null = null;

function getCliente(): Anthropic {
  if (!process.env.ANTHROPIC_API_KEY) {
    throw new Error("ANTHROPIC_API_KEY não configurada no .env.local");
  }
  if (!clienteAnthropic) {
    clienteAnthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  }
  return clienteAnthropic;
}

/**
 * Gera uma resposta do agente de IA para uma mensagem de WhatsApp.
 *
 * @param systemPrompt   - Prompt de sistema gerado pelo wizard (regras + conhecimento)
 * @param conversationHistory - Histórico da conversa [{role, content}]
 * @param newMessage     - Nova mensagem do utilizador
 * @returns Texto da resposta do Claude
 */
export async function generateAgentResponse(
  systemPrompt: string,
  conversationHistory: MensagemHistorico[],
  newMessage: string
): Promise<string> {
  console.log("[claudeService] A chamar Claude API…");
  console.log("  Modelo    :", MODEL);
  console.log("  Histórico :", conversationHistory.length, "mensagem(ns)");
  console.log("  Mensagem  :", newMessage);

  const mensagens: Anthropic.MessageParam[] = [
    ...conversationHistory.map((m) => ({
      role: m.role,
      content: m.content,
    })),
    { role: "user" as const, content: newMessage },
  ];

  let resposta: Anthropic.Message;
  try {
    const cliente = getCliente();
    resposta = await cliente.messages.create({
      model: MODEL,
      max_tokens: MAX_TOKENS,
      system: systemPrompt,
      messages: mensagens,
    });
  } catch (erro) {
    if (erro instanceof Anthropic.APIError) {
      console.error(
        `[claudeService] Erro da API Anthropic — status: ${erro.status} | mensagem: ${erro.message}`
      );
      throw new Error(`Erro da Claude API (${erro.status}): ${erro.message}`);
    }
    console.error("[claudeService] Erro inesperado ao chamar a Claude API:", erro);
    throw erro;
  }

  const blocoTexto = resposta.content.find((b) => b.type === "text");
  if (!blocoTexto || blocoTexto.type !== "text") {
    throw new Error("[claudeService] Resposta do Claude não contém bloco de texto");
  }

  const textoResposta = blocoTexto.text.trim();

  console.log("[claudeService] Resposta recebida:", textoResposta);
  console.log(
    `[claudeService] Tokens usados — input: ${resposta.usage.input_tokens} | output: ${resposta.usage.output_tokens}`
  );

  return textoResposta;
}
