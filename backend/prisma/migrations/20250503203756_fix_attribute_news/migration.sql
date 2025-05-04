/*
  Warnings:

  - You are about to drop the column `tags` on the `News` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "News" DROP COLUMN "tags",
ALTER COLUMN "publishDate" DROP DEFAULT;
