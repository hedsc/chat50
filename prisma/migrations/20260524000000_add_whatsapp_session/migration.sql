-- CreateTable
CREATE TABLE "whatsapp_sessions" (
    "id" TEXT NOT NULL,
    "utilizadorId" TEXT NOT NULL,
    "instanceName" TEXT NOT NULL,
    "instanceToken" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pendente',
    "phone" TEXT,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizadoEm" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "whatsapp_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "whatsapp_sessions_utilizadorId_key" ON "whatsapp_sessions"("utilizadorId");

-- AddForeignKey
ALTER TABLE "whatsapp_sessions" ADD CONSTRAINT "whatsapp_sessions_utilizadorId_fkey" FOREIGN KEY ("utilizadorId") REFERENCES "utilizadores"("id") ON DELETE CASCADE ON UPDATE CASCADE;
