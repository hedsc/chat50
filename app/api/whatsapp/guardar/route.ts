import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ erro: "Não autenticado" }, { status: 401 });

  const { instanceName, token: instanceToken } = await req.json() as {
    instanceName: string;
    token: string;
  };

  if (!instanceName || !instanceToken) {
    return NextResponse.json({ erro: "instanceName e token obrigatórios" }, { status: 400 });
  }

  const utilizador = await prisma.utilizador.findUnique({ where: { clerkId: userId } });
  if (!utilizador) {
    return NextResponse.json({ erro: "Utilizador não encontrado" }, { status: 404 });
  }

  // Guarda a sessão WhatsApp
  await prisma.whatsAppSession.upsert({
    where: { utilizadorId: utilizador.id },
    update: { instanceName, instanceToken, status: "conectado" },
    create: { utilizadorId: utilizador.id, instanceName, instanceToken, status: "conectado" },
  });

  // Actualiza instanciaUazapi no AgentConfig se já existir
  await prisma.agentConfig.updateMany({
    where: { utilizadorId: utilizador.id },
    data: { instanciaUazapi: instanceToken },
  });

  console.log("[guardar] sessão guardada — user:", utilizador.id, "| instance:", instanceName, "| token:", instanceToken);

  return NextResponse.json({ sucesso: true });
}
