-- AlterTable
ALTER TABLE "News" ADD COLUMN     "category" TEXT NOT NULL DEFAULT 'general',
ADD COLUMN     "publishDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'draft',
ADD COLUMN     "tags" TEXT[];
