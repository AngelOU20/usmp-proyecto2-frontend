-- AlterTable
ALTER TABLE "Document" ADD COLUMN     "extractedText" TEXT;

-- AlterTable
ALTER TABLE "Student" ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true;
