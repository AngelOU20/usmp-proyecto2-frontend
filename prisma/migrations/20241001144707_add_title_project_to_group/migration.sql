/*
  Warnings:

  - You are about to drop the column `titleProject` on the `Student` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Group" ADD COLUMN     "titleProject" TEXT;

-- AlterTable
ALTER TABLE "Student" DROP COLUMN "titleProject";
