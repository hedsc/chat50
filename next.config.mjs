/** @type {import('next').NextConfig} */
const nextConfig = {
  // Reutiliza conexões TCP entre requests — evita handshake a cada chamada do Clerk ao api.clerk.com
  httpAgentOptions: {
    keepAlive: true,
  },

  // Não faz bundle do Prisma Client — tem binários nativos que o webpack não processa correctamente,
  // causando compilação lenta e retries silenciosos no arranque
  experimental: {
    serverComponentsExternalPackages: ["@prisma/client"],
    // Tree-shake automático para pacotes com barrel exports grandes.
    // Sem isto o webpack carrega todos os ~1400 ícones do lucide-react e todos os primitivos Radix
    // na primeira compilação, bloqueando o arranque.
    optimizePackageImports: [
      "lucide-react",
      "@radix-ui/react-avatar",
      "@radix-ui/react-dropdown-menu",
      "@radix-ui/react-separator",
      "@radix-ui/react-slot",
    ],
  },
};

export default nextConfig;
