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
  // pathname = "/image/upload/v1749557991/carosel/pexels-pixabay-276583.jpg-bf45f3d1-b696-4378-bf0f-2a59c3a97a37.jpg"
  
  // Find the version pattern and extract everything after it
  const versionMatch = pathname.match(/\/v\d+\/(.+)$/);
  if (!versionMatch) {
    throw new Error('No version found in Cloudinary URL');
  }
  
  // Get the full path after version, then remove the file extension
  const fullPath = versionMatch[1]; // "carosel/pexels-pixabay-276583.jpg-bf45f3d1-b696-4378-bf0f-2a59c3a97a37.jpg"
  publicId = fullPath.replace(/\.[^.]+$/, ''); // Remove the last file extension  
} catch (err) {
    throw new Error(`deleteHomeCarouselImage: invalid imageUrl → ${err}`);
  }

  // --- 2. delete from Cloudinary ------------------------------------------------------
 try {
  const cloudRes = await cloudinary.uploader.destroy(publicId, {
    invalidate: true,
    resource_type: 'image',
  });

  if(cloudRes.result !== 'ok') return

  if (cloudRes.result !== 'ok' && cloudRes.result !== 'not found') {
    throw new Error(`Cloudinary deletion failed: ${JSON.stringify(cloudRes)}`);
  }
} catch (error) {
  console.error('Error deleting from Cloudinary:', error);
  throw error;
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

