import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const instanceName = searchParams.get("instanceName");
  const token = searchParams.get("token");

  if (!instanceName || !token) {
    return NextResponse.json({ erro: "instanceName e token obrigatórios" }, { status: 400 });
  }

  const uazapiUrl = process.env.UAZAPI_URL;
  if (!uazapiUrl) {
    return NextResponse.json({ erro: "UAZAPI_URL não configurado" }, { status: 500 });
  }

  const res = await fetch(`${uazapiUrl}/instance/connectionState/${instanceName}`, {
    headers: { token },
  });

  if (!res.ok) {
    console.warn("[estado] uazapi retornou:", res.status);
    return NextResponse.json({ estado: "desconhecido" });
  }

  const data = await res.json();
  console.log("[estado] connectionState:", JSON.stringify(data));

  // uazapi pode retornar state, status, connectionState, instance.state, etc.
  const estado: string =
    data.state ??
    data.status ??
    data.connectionState ??
    data.instance?.state ??
    data.instance?.connectionStatus ??
    "desconhecido";

  // Tentar obter QR atualizado se ainda não conectado
  let qrcode: string | null = null;
  if (estado !== "open" && estado !== "conectado") {
    const qrRes = await fetch(`${uazapiUrl}/instance/qrcode/${instanceName}`, {
      headers: { token },
    });
    if (qrRes.ok) {
      const qrData = await qrRes.json();
      qrcode = qrData.base64 ?? qrData.qrcode ?? qrData.code ?? null;
    }
  }

  return NextResponse.json({ estado, qrcode });
}
