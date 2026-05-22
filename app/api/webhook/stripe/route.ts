import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(req: NextRequest) {
  const corpo = await req.text();
  const assinatura = req.headers.get("stripe-signature") as string;

  let evento: Stripe.Event;

  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: "2026-04-22.dahlia",
    });

    evento = stripe.webhooks.constructEvent(
      corpo,
      assinatura,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch {
    return NextResponse.json(
      { erro: "Assinatura do webhook inválida" },
      { status: 400 }
    );
  }

  // TODO: processar os eventos do Stripe
  switch (evento.type) {
    case "checkout.session.completed":
      // TODO: activar subscrição do utilizador
      break;
    case "customer.subscription.deleted":
      // TODO: desactivar subscrição do utilizador
      break;
    default:
      break;
  }

  return NextResponse.json({ recebido: true });
}
