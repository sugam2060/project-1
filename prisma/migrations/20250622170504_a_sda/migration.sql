/*
  Warnings:

  - You are about to drop the column `title` on the `RecentInteriorProjectImage` table. All the data in the column will be lost.
  - The `imageUrl` column on the `RecentInteriorProjectImage` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "RecentInteriorProjectImage" DROP COLUMN "title",
DROP COLUMN "imageUrl",
ADD COLUMN     "imageUrl" TEXT[];
