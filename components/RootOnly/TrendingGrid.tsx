import { fetchTrendingProducts } from "@/actions/productActions/fetchTrendingProducts";
import TrendingGridClient from "./TrendingGridClient";

interface TrendingGridProps {
  limit: number;
}

const TrendingGrid = async ({ limit }: TrendingGridProps) => {
  const initialData = await fetchTrendingProducts({
    limit,
    cursor: null,
    sortBy: "name",
    sortOrder: "asc",
  });

  if (!initialData?.items?.length) {
    return null;
  }

  return (
    <TrendingGridClient
      initialProducts={initialData.items}
      initialNextCursor={initialData.nextCursor}
      limit={limit}
    />
  );
};

export default TrendingGrid;
