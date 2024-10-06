/*
  Warnings:

  - You are about to drop the `MentorGroup` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "MentorGroup" DROP CONSTRAINT "MentorGroup_groupId_fkey";

-- DropForeignKey
ALTER TABLE "MentorGroup" DROP CONSTRAINT "MentorGroup_mentorId_fkey";

-- AlterTable
ALTER TABLE "Group" ADD COLUMN     "mentorId" INTEGER,
ALTER COLUMN "updatedAt" SET DEFAULT CURRENT_TIMESTAMP;

-- DropTable
DROP TABLE "MentorGroup";

-- AddForeignKey
ALTER TABLE "Group" ADD CONSTRAINT "Group_mentorId_fkey" FOREIGN KEY ("mentorId") REFERENCES "Mentor"("id") ON DELETE SET NULL ON UPDATE CASCADE;
