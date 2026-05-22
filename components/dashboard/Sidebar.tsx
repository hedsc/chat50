"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Settings,
  MessageSquare,
  SlidersHorizontal,
  MessageCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";

const itensMenu = [
  {
    titulo: "Dashboard",
    href: "/dashboard",
    icone: LayoutDashboard,
  },
  {
    titulo: "Configuração",
    href: "/dashboard/config",
    icone: SlidersHorizontal,
  },
  {
    titulo: "Conversas",
    href: "/dashboard/conversas",
    icone: MessageSquare,
  },
  {
    titulo: "Definições",
    href: "/dashboard/definicoes",
    icone: Settings,
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-full w-64 flex-col border-r border-gray-200 bg-white">
      {/* Logo */}
      <div className="flex h-16 items-center gap-2.5 px-6">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
          <MessageCircle className="h-4 w-4 text-white" />
        </div>
        <span className="text-lg font-bold tracking-tight text-gray-900">Chat 5.0</span>
      </div>

      <Separator />

      {/* Navegação */}
      <nav className="flex flex-1 flex-col gap-1 p-3">
        {itensMenu.map((item) => {
          const Icone = item.icone;
          const activo = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
                activo
                  ? "bg-primary text-white shadow-sm"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              )}
            >
              <Icone className="h-4 w-4 shrink-0" />
              {item.titulo}
            </Link>
          );
        })}
      </nav>

      {/* Rodapé da sidebar */}
      <div className="p-4">
        <Separator className="mb-4" />
        <p className="text-center text-xs text-gray-400">Chat 5.0 © 2025</p>
      </div>
    </aside>
  );
}
