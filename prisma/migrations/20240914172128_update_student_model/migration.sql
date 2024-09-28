/*
  Warnings:

  - You are about to drop the column `grupo` on the `Student` table. All the data in the column will be lost.
  - You are about to drop the column `nroMatricula` on the `Student` table. All the data in the column will be lost.
  - You are about to drop the column `titulo` on the `Student` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Student" DROP COLUMN "grupo",
DROP COLUMN "nroMatricula",
DROP COLUMN "titulo",
ADD COLUMN     "group" TEXT,
ADD COLUMN     "registrationNumber" TEXT,
ADD COLUMN     "titleProject" TEXT;
