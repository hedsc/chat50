"use server";

import { auth, currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { gerarSystemPrompt } from "@/lib/systemPrompt";
import type { DadosFormulario, FAQ } from "@/lib/types/agentConfig";

export async function guardarConfigAgente(
  dados: DadosFormulario
): Promise<{ sucesso: boolean; erro?: string }> {
  try {
    const { userId } = await auth();
    if (!userId) return { sucesso: false, erro: "Sessão expirada. Faz login novamente." };

    const clerkUser = await currentUser();
    const email =
      clerkUser?.emailAddresses?.[0]?.emailAddress ?? `${userId}@sem-email.local`;
    const nome = clerkUser?.firstName
      ? `${clerkUser.firstName} ${clerkUser.lastName ?? ""}`.trim()
      : null;

    // Garante que o Utilizador existe na BD
    const utilizador = await prisma.utilizador.upsert({
      where: { clerkId: userId },
      update: { email, nome },
      create: { clerkId: userId, email, nome },
    });

    const systemPrompt = gerarSystemPrompt(dados);

    // Filtra FAQs vazias antes de guardar
    const faqsLimpas = dados.faqs.filter(
      (f) => f.pergunta.trim() || f.resposta.trim()
    );

    await prisma.agentConfig.upsert({
      where: { utilizadorId: utilizador.id },
      update: {
        nomeNegocio: dados.nomeNegocio,
        sector: dados.sector,
        descricao: dados.descricao,
        diasFuncionamento: dados.diasFuncionamento,
        horarioAbertura: dados.horarioAbertura,
        horarioFecho: dados.horarioFecho,
        nomeAgente: dados.nomeAgente,
        tom: dados.tom,
        mensagemBoasVindas: dados.mensagemBoasVindas,
        faqs: faqsLimpas as unknown as Prisma.InputJsonValue,
        catalogo: dados.catalogo || null,
        keywordsEscalamento: dados.keywordsEscalamento,
        emailDono: dados.emailDono || null,
        telefoneDono: dados.telefoneDono || null,
        systemPrompt,
      },
      create: {
        utilizadorId: utilizador.id,
        nomeNegocio: dados.nomeNegocio,
        sector: dados.sector,
        descricao: dados.descricao,
        diasFuncionamento: dados.diasFuncionamento,
        horarioAbertura: dados.horarioAbertura,
        horarioFecho: dados.horarioFecho,
        nomeAgente: dados.nomeAgente,
        tom: dados.tom,
        mensagemBoasVindas: dados.mensagemBoasVindas,
        faqs: faqsLimpas as unknown as Prisma.InputJsonValue,
        catalogo: dados.catalogo || null,
        keywordsEscalamento: dados.keywordsEscalamento,
        emailDono: dados.emailDono || null,
        telefoneDono: dados.telefoneDono || null,
        systemPrompt,
      },
    });

    revalidatePath("/dashboard/config");
    return { sucesso: true };
  } catch (erro) {
    console.error("[guardarConfigAgente]", erro);
    return {
      sucesso: false,
      erro: "Erro ao guardar a configuração. Verifica a ligação e tenta novamente.",
    };
  }
}

export type GetAgentConfigResult = {
  clerkId: string | null;
  utilizadorEncontrado: boolean;
  configEncontrada: boolean;
  dados: DadosFormulario | null;
  erro?: string;
};

export async function getAgentConfig(): Promise<GetAgentConfigResult> {
  let clerkId: string | null = null;
  try {
    const authResult = await auth();
    clerkId = authResult.userId ?? null;

    if (!clerkId) {
      return { clerkId: null, utilizadorEncontrado: false, configEncontrada: false, dados: null };
    }

    const utilizador = await prisma.utilizador.findUnique({
      where: { clerkId },
      include: { agentConfig: true },
    });

    if (!utilizador) {
      return { clerkId, utilizadorEncontrado: false, configEncontrada: false, dados: null };
    }

    const config = utilizador.agentConfig;

    if (!config) {
      return { clerkId, utilizadorEncontrado: true, configEncontrada: false, dados: null };
    }

    const faqsDb = Array.isArray(config.faqs) ? (config.faqs as FAQ[]) : [];
    const faqs: FAQ[] = [
      ...faqsDb.map((f) => ({ pergunta: f.pergunta ?? "", resposta: f.resposta ?? "" })),
      ...Array.from({ length: Math.max(0, 10 - faqsDb.length) }, () => ({ pergunta: "", resposta: "" })),
    ];

    return {
      clerkId,
      utilizadorEncontrado: true,
      configEncontrada: true,
      dados: {
        nomeNegocio: config.nomeNegocio,
        sector: config.sector,
        descricao: config.descricao,
        diasFuncionamento: config.diasFuncionamento,
        horarioAbertura: config.horarioAbertura,
        horarioFecho: config.horarioFecho,
        nomeAgente: config.nomeAgente,
        tom: (config.tom as DadosFormulario["tom"]) ?? "neutro",
        mensagemBoasVindas: config.mensagemBoasVindas,
        faqs,
        catalogo: config.catalogo ?? "",
        keywordsEscalamento: config.keywordsEscalamento,
        emailDono: config.emailDono ?? "",
        telefoneDono: config.telefoneDono ?? "",
      },
    };
  } catch (erro) {
    console.error("[getAgentConfig] erro:", erro);
    return {
      clerkId,
      utilizadorEncontrado: false,
      configEncontrada: false,
      dados: null,
      erro: erro instanceof Error ? erro.message : String(erro),
    };
  }
}
