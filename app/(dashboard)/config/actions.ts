"use server";

import { auth, currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { gerarSystemPrompt } from "@/lib/systemPrompt";
import type { DadosFormulario } from "@/lib/types/agentConfig";

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
