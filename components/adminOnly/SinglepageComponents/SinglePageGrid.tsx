'use client';

import { useEffect} from 'react';
import ImageArray from './ImageArray';
import { fetchSingleProduct } from '@/actions/productActions/FetchBySlug';
import { ProductFieldFetchsSchema, productUpdateSchema } from '@/schemas/ProductUploadSchema';
import { z } from 'zod';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

type Product = z.infer<typeof ProductFieldFetchsSchema>;

type FormData = z.infer<typeof productUpdateSchema>;

const getDefaultFormValues = (product: Product | null): FormData => ({
  name: product?.name || '',
  description: product?.description || '',
  price: product?.price?.toString() || '',
  category: product?.category || '',
  discount: product?.discount?.toString() || '',
  image: [], // local files start empty
  imageUrls: product?.images?.map((img) => ({
    id: img.id,
    imageUrl: img.imageUrl,
  })) || [],
  slug: product?.slug || '',
  stock: product?.stock?.toString() || '',
  brand: product?.brand || '',
});

const SinglePageGrid = ({ slug }: { slug: string }) => {

  const form = useForm<FormData>({
    resolver: zodResolver(productUpdateSchema),
    defaultValues: getDefaultFormValues(null),
  });

  const { reset } = form;

  useEffect(() => {
    async function fetchProduct() {
      const fetchedProduct = await fetchSingleProduct(slug);
      reset(getDefaultFormValues(fetchedProduct as Product));
    }
    fetchProduct();
  }, [slug, reset]);

  return (
    <FormProvider {...form}>
      <div>
        {/* Pass the product images to ImageArray */}
        <ImageArray />
      </div>
    </FormProvider>
  );
};

export default SinglePageGrid;
