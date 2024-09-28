/*
  Warnings:

  - Added the required column `grupo` to the `Student` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nroMatricula` to the `Student` table without a default value. This is not possible if the table is not empty.
  - Added the required column `titulo` to the `Student` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Mentor" DROP CONSTRAINT "Mentor_userId_fkey";

-- DropForeignKey
ALTER TABLE "Student" DROP CONSTRAINT "Student_mentorId_fkey";

-- DropForeignKey
ALTER TABLE "Student" DROP CONSTRAINT "Student_userId_fkey";

-- AlterTable
ALTER TABLE "Student" ADD COLUMN     "grupo" TEXT NOT NULL,
ADD COLUMN     "nroMatricula" TEXT NOT NULL,
ADD COLUMN     "titulo" TEXT NOT NULL,
ALTER COLUMN "mentorId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Mentor" ADD CONSTRAINT "Mentor_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_mentorId_fkey" FOREIGN KEY ("mentorId") REFERENCES "Mentor"("id") ON DELETE SET NULL ON UPDATE CASCADE;
