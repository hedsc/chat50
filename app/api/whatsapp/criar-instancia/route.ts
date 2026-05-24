import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ erro: "Não autenticado" }, { status: 401 });

  const shortId = userId.replace(/\D/g, "").slice(-8) || userId.slice(-8);
  const instanceName = `chat50-${shortId}`.toLowerCase();

  const uazapiUrl = process.env.UAZAPI_URL;
  const adminToken = process.env.UAZAPI_TOKEN;

  if (!uazapiUrl || !adminToken) {
    return NextResponse.json({ erro: "UAZAPI_URL ou UAZAPI_TOKEN não configurados" }, { status: 500 });
  }

  // 1. Criar instância
  const createRes = await fetch(`${uazapiUrl}/instance/create`, {
    method: "POST",
    headers: { token: adminToken, "Content-Type": "application/json" },
    body: JSON.stringify({ instanceName }),
  });

  if (!createRes.ok) {
    const body = await createRes.text();
    console.error("[criar-instancia] erro ao criar:", createRes.status, body);
    return NextResponse.json({ erro: `Erro uazapi ${createRes.status}: ${body}` }, { status: 500 });
  }

  const instancia = await createRes.json();
  console.log("[criar-instancia] instancia criada:", JSON.stringify(instancia));

  // uazapi pode retornar Token (maiúscula) ou token
  const instanceToken: string = instancia.Token ?? instancia.token ?? instancia.instanceToken ?? "";

  if (!instanceToken) {
    return NextResponse.json({ erro: "Token da instância não recebido", detalhe: instancia }, { status: 500 });
  }

  // 2. Obter QR code
  const qrRes = await fetch(`${uazapiUrl}/instance/qrcode/${instanceName}`, {
    headers: { token: instanceToken },
  });

  let qrcode: string | null = null;
  if (qrRes.ok) {
    const qrData = await qrRes.json();
    console.log("[criar-instancia] qr response keys:", Object.keys(qrData));
    qrcode = qrData.base64 ?? qrData.qrcode ?? qrData.code ?? qrData.pairingCode ?? null;
  } else {
    console.warn("[criar-instancia] qr endpoint retornou:", qrRes.status);
  }

  return NextResponse.json({ instanceName, token: instanceToken, qrcode });
}
