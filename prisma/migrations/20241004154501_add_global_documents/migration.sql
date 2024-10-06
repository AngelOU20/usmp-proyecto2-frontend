/*
  Warnings:

  - A unique constraint covering the columns `[name,groupId,subjectId,semesterId]` on the table `Document` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Document_name_groupId_key";

-- AlterTable
ALTER TABLE "Document" ADD COLUMN     "isGlobal" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "semesterId" INTEGER,
ADD COLUMN     "subjectId" INTEGER,
ALTER COLUMN "groupId" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Document_name_groupId_subjectId_semesterId_key" ON "Document"("name", "groupId", "subjectId", "semesterId");

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "Subject"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_semesterId_fkey" FOREIGN KEY ("semesterId") REFERENCES "Semester"("id") ON DELETE SET NULL ON UPDATE CASCADE;
