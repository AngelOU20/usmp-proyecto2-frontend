/*
  Warnings:

  - A unique constraint covering the columns `[name,groupId]` on the table `Document` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `groupId` to the `Document` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Document" ADD COLUMN     "groupId" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Document_name_groupId_key" ON "Document"("name", "groupId");

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE CASCADE ON UPDATE CASCADE;
