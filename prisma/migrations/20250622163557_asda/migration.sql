-- CreateTable
CREATE TABLE "RecentInteriorProjectImage" (
    "id" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "title" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RecentInteriorProjectImage_pkey" PRIMARY KEY ("id")
);
