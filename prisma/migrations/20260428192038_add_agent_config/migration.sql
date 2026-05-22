-- CreateTable
CREATE TABLE "agent_configs" (
    "id" TEXT NOT NULL,
    "utilizadorId" TEXT NOT NULL,
    "nomeNegocio" TEXT NOT NULL,
    "sector" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "diasFuncionamento" TEXT[],
    "horarioAbertura" TEXT NOT NULL,
    "horarioFecho" TEXT NOT NULL,
    "nomeAgente" TEXT NOT NULL,
    "tom" TEXT NOT NULL,
    "mensagemBoasVindas" TEXT NOT NULL,
    "faqs" JSONB NOT NULL,
    "catalogo" TEXT,
    "keywordsEscalamento" TEXT[],
    "emailDono" TEXT,
    "telefoneDono" TEXT,
    "systemPrompt" TEXT NOT NULL,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizadoEm" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "agent_configs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "agent_configs_utilizadorId_key" ON "agent_configs"("utilizadorId");

-- AddForeignKey
ALTER TABLE "agent_configs" ADD CONSTRAINT "agent_configs_utilizadorId_fkey" FOREIGN KEY ("utilizadorId") REFERENCES "utilizadores"("id") ON DELETE CASCADE ON UPDATE CASCADE;
