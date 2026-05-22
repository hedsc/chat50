/*
  Warnings:

  - A unique constraint covering the columns `[instanciaUazapi]` on the table `agent_configs` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "agent_configs" ADD COLUMN     "instanciaUazapi" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "agent_configs_instanciaUazapi_key" ON "agent_configs"("instanciaUazapi");
