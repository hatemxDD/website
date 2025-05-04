/*
  Warnings:

  - You are about to drop the column `name` on the `Article` table. All the data in the column will be lost.
  - Added the required column `publishDate` to the `Article` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `Article` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Article" DROP COLUMN "name",
ADD COLUMN     "publishDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "title" TEXT NOT NULL;
