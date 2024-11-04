/*
  Warnings:

  - A unique constraint covering the columns `[userId,semesterId,subjectId]` on the table `Student` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Student_userId_key";

-- CreateIndex
CREATE UNIQUE INDEX "Student_userId_semesterId_subjectId_key" ON "Student"("userId", "semesterId", "subjectId");
