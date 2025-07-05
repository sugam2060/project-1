/*
  Warnings:

  - You are about to drop the `RecentInteriorProjectImage` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "RecentInteriorProjectImage";

-- CreateTable
CREATE TABLE "InteriorCategory" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "InteriorCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InteriorProjectImage" (
    "id" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "InteriorProjectImage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "InteriorCategory_name_key" ON "InteriorCategory"("name");

-- CreateIndex
CREATE INDEX "InteriorProjectImage_categoryId_idx" ON "InteriorProjectImage"("categoryId");

-- AddForeignKey
ALTER TABLE "InteriorProjectImage" ADD CONSTRAINT "InteriorProjectImage_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "InteriorCategory"("id") ON DELETE CASCADE ON UPDATE CASCADE;
