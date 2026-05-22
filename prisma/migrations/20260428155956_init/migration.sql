-- CreateEnum
CREATE TYPE "Plano" AS ENUM ('GRATUITO', 'BASICO', 'PRO');

-- CreateEnum
CREATE TYPE "Remetente" AS ENUM ('UTILIZADOR', 'ASSISTENTE');

-- CreateTable
CREATE TABLE "utilizadores" (
    "id" TEXT NOT NULL,
    "clerkId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "nome" TEXT,
    "plano" "Plano" NOT NULL DEFAULT 'GRATUITO',
    "stripeClienteId" TEXT,
    "subscricaoId" TEXT,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizadoEm" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "utilizadores_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "conversas" (
    "id" TEXT NOT NULL,
    "utilizadorId" TEXT NOT NULL,
    "telefone" TEXT NOT NULL,
    "criadaEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizadaEm" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "conversas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mensagens" (
    "id" TEXT NOT NULL,
    "conversaId" TEXT NOT NULL,
    "conteudo" TEXT NOT NULL,
    "remetente" "Remetente" NOT NULL,
    "enviadaEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "mensagens_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "utilizadores_clerkId_key" ON "utilizadores"("clerkId");

-- CreateIndex
CREATE UNIQUE INDEX "utilizadores_email_key" ON "utilizadores"("email");

-- CreateIndex
CREATE UNIQUE INDEX "utilizadores_stripeClienteId_key" ON "utilizadores"("stripeClienteId");

-- CreateIndex
CREATE UNIQUE INDEX "utilizadores_subscricaoId_key" ON "utilizadores"("subscricaoId");

-- AddForeignKey
ALTER TABLE "conversas" ADD CONSTRAINT "conversas_utilizadorId_fkey" FOREIGN KEY ("utilizadorId") REFERENCES "utilizadores"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mensagens" ADD CONSTRAINT "mensagens_conversaId_fkey" FOREIGN KEY ("conversaId") REFERENCES "conversas"("id") ON DELETE CASCADE ON UPDATE CASCADE;
