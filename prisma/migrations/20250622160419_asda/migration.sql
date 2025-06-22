-- DropForeignKey
ALTER TABLE "TrendingProduct" DROP CONSTRAINT "TrendingProduct_productId_fkey";

-- AddForeignKey
ALTER TABLE "TrendingProduct" ADD CONSTRAINT "TrendingProduct_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
