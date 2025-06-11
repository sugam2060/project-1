"use client";

import { useTransition } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import toast from "react-hot-toast";
import {
  productUpdateSchema,
  ProductFieldFetchsSchema,
} from "@/schemas/ProductUploadSchema";
import { fetchSingleProduct } from "@/actions/productActions/FetchBySlug";
import { updateProduct } from "@/actions/productActions/UpdateProduct";
import {
  addToTrending,
  removeFromTrending,
  fetchTrending,
} from "@/actions/productActions/TrendingProductManagement";
import ImageArray from "./ImageArray";
import ProductContentComponent from "./ProductContentEditableForm";
import UniversalLoader from "@/components/main/UniversalLoader"
import { Button } from "@/components/ui/button";
import { Star, StarOff } from "lucide-react";

type Product = z.infer<typeof ProductFieldFetchsSchema>;
type FormData = z.infer<typeof productUpdateSchema>;

const getDefaults = (p: Product | null): FormData => ({
  id: p?.id || "",
  name: p?.name || "",
  description: p?.description || "",
  price: p?.price?.toString() || "",
  category: p?.category || "",
  discount: p?.discount?.toString() || "",
  image: [],
  imageUrls: p?.images?.map((i) => ({ id: i.id, imageUrl: i.imageUrl })) || [],
  slug: p?.slug || "",
  stock: p?.stock?.toString() || "",
  brand: p?.brand || "",
});

const SinglePageGrid = ({ slug }: { slug: string }) => {
  const [isPending, startTransition] = useTransition();
  const [isTrendingPending, startTrendingTransition] = useTransition();

  const form = useForm<FormData>({
    resolver: zodResolver(productUpdateSchema),
    defaultValues: getDefaults(null),
  });

  const { reset, getValues } = form;
  const queryClient = useQueryClient();

  const {
  isLoading: loadingProduct,
  } = useQuery({
    queryKey: ["fetch-editable-singlepage", slug],
    queryFn: async () => {
      const product = await fetchSingleProduct(slug);
      reset(getDefaults(product as Product));
      return product;
    },
  });

  const {
    data: trending,
    isLoading: loadingTrending,
  } = useQuery({
    queryKey: ["trending", slug],
    queryFn: async () => {
      const result = await fetchTrending(getValues().id);
      return result;
    },
    enabled: !!getValues().id, // Prevent premature fetching
  });

  const handleUpdate = form.handleSubmit((data) => {
    startTransition(async () => {
      await updateProduct(data);
      queryClient.invalidateQueries({
        queryKey: ["fetch-editable-singlepage", slug],
      });
      toast.success("Product updated successfully");
    });
  });

  const handleToggleTrending = () => {
    const id = getValues().id;
    startTrendingTransition(async () => {
      const res = trending
        ? await removeFromTrending(id)
        : await addToTrending(id);

      if (res.error) toast.error(res.error);
      else {
        toast.success(res.success as string);
        queryClient.invalidateQueries({ queryKey: ["trending", slug] });
      }
    });
  };

  // Show loader until both product and trending info are fetched
  if (loadingProduct || loadingTrending) {
    return <UniversalLoader text="Loading product details..." fullScreen />;
  }

  return (
    <FormProvider {...form}>
      {/* Floating action buttons */}
      <div className="fixed z-50 flex gap-3 right-4 bottom-4 md:top-24 md:right-8">
        <Button
          disabled={isPending}
          onClick={handleUpdate}
          className="bg-blue-500/90 text-black hover:bg-green-600 hover:text-white"
        >
          {isPending ? "Updating..." : "Update"}
        </Button>

        <Button
          disabled={isTrendingPending}
          onClick={handleToggleTrending}
          className="flex items-center gap-2 bg-yellow-400/90 hover:bg-yellow-600 text-black"
        >
          {isTrendingPending ? (
            trending ? "Removing from Trending..." : "Adding to Trending..."
          ) : trending ? (
            <>
              <StarOff className="h-4 w-4" />
              Remove from Trending
            </>
          ) : (
            <>
              <Star className="h-4 w-4" />
              Add to Trending
            </>
          )}
        </Button>
      </div>

      {/* Main content */}
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="flex flex-col gap-8 md:grid md:grid-cols-2">
          <ImageArray />
          <ProductContentComponent />
        </div>
      </div>
    </FormProvider>
  );
};

export default SinglePageGrid;
