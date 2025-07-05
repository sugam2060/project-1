'use server'

import { db } from '@/lib/db';
import { revalidateTag, unstable_cache } from 'next/cache';

export const fetchLocations = unstable_cache(async () => {
  const locations = await db.locations.findMany({ orderBy: { city: 'asc' } });
  return locations;
}, [], { revalidate: false, tags: ['locations'] });

export async function AddLocation(city: string) {
  try {
    const location = await db.locations.create({ data: { city } });
  // Revalidate cache
  // @ts-ignore
  revalidateTag('locations')
  return location;
  } catch (error) {
    return { error: 'Failed to add location.' };
  }
}

export async function DeleteLocation(id: string) {
  try {
    // Check if any addresses reference this location
    const addressCount = await db.addresses.count({ where: { locationId: id } });
    if (addressCount > 0) {
      return { error: 'Cannot delete location: it is still in use by one or more addresses.' };
    }
    await db.locations.delete({ where: { id } });
    // Revalidate cache
    // @ts-ignore
    revalidateTag('locations');
    return { success: true };
  } catch (error: any) {
    if (error.code === 'P2025') {
      return { error: 'Location not found or already deleted.' };
    }
    console.log(error);
    return { error: 'Failed to delete location.' };
  }
}

