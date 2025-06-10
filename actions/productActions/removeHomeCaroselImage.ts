// app/actions/carousel.ts
'use server';

import { unstable_noStore as noStore, revalidatePath, revalidateTag } from 'next/cache';
import { v2 as cloudinary } from 'cloudinary';
import { db } from '@/lib/db';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

/**
 * Delete a home-page carousel image.
 * @param imageUrl — the full Cloudinary URL that lives in the DB.
 * @returns { ok: true } on success, otherwise throws.
 */
export const deleteHomeCarouselImage = async (imageUrl: string) => {
  'use server';
  noStore();                                 // keep this action purely server-side

  // --- 1. derive Cloudinary public_id -------------------------------------------------
  // Example URL: https://res.cloudinary.com/<cloud>/image/upload/v1718009271/carosel/foo_bar.jpg
  // We want:      'carosel/foo_bar'
  let publicId: string;
  try {
    const { pathname } = new URL(imageUrl);
    // pathname = "/<stuff>/upload/v.../carosel/foo_bar.jpg"
    const afterUpload = pathname.split('/upload/')[1];
    if (!afterUpload) throw new Error('Not a Cloudinary URL');
    publicId = afterUpload.replace(/\.(jpe?g|png|webp|gif|avif)$/i, ''); // strip extension
  } catch (err) {
    throw new Error(`deleteHomeCarouselImage: invalid imageUrl → ${err}`);
  }

  // --- 2. delete from Cloudinary ------------------------------------------------------
  try {
    const cloudRes = await cloudinary.uploader.destroy(publicId, {
      invalidate: true,   // also purge the CDN
      resource_type: 'image',
    });

    if (cloudRes.result !== 'ok' && cloudRes.result !== 'not found') {
      throw new Error(`Cloudinary deletion failed: ${JSON.stringify(cloudRes)}`);
    }
  } catch (error) {
    //ignore the error
  }

  // --- 3. update DB inside a transaction ---------------------------------------------
  try {
    await db.$transaction(async (tx) => {
      const carousel = await tx.carosel.findFirstOrThrow();

      const updatedImages = carousel.images.filter((url) => url !== imageUrl);

      await tx.carosel.update({
        where: { id: carousel.id },
        data: { images: updatedImages },
      });
    });
    revalidatePath('/');
    revalidateTag('carosel-cache')
  } catch (error) {
    //ignore the error
  }

  // --- 4. invalidate any page-level caches that show the carousel --------------------

};

