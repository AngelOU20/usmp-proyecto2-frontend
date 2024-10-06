/*
  Warnings:

  - You are about to drop the column `semester` on the `Student` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[name,subjectId,semesterId]` on the table `Group` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `semesterId` to the `Group` table without a default value. This is not possible if the table is not empty.
  - Added the required column `semesterId` to the `Student` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Group_name_subjectId_key";

-- AlterTable
ALTER TABLE "Group" ADD COLUMN     "semesterId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Student" DROP COLUMN "semester",
ADD COLUMN     "semesterId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "Semester" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Semester_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Semester_name_key" ON "Semester"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Group_name_subjectId_semesterId_key" ON "Group"("name", "subjectId", "semesterId");

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_semesterId_fkey" FOREIGN KEY ("semesterId") REFERENCES "Semester"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Group" ADD CONSTRAINT "Group_semesterId_fkey" FOREIGN KEY ("semesterId") REFERENCES "Semester"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
