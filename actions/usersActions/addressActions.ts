'use server'

import { db } from '@/lib/db';
import { addressSchema } from '@/schemas/addressSchema';
import { auth } from '@/auth';
import { z } from 'zod';

export async function fetchAddresses() {
  const session = await auth();
  if (!session?.user?.id) return [];
  return db.addresses.findMany({
    where: { userId: session.user.id},
    include: { location: true },
    orderBy: { id: 'desc' },
  });
}

export async function addAddress(input: z.infer<typeof addressSchema>) {
  const session = await auth();
  if (!session?.user?.id) return { error: 'Not authenticated' };

  // Debug session info
  console.log('Session user:', session.user);

  // Verify user exists
  const userExists = await db.user.findUnique({
    where: { id: session.user.id }
  });

  if (!userExists) {
    return { error: 'User not found in database' };
  }

  const parsed = addressSchema.safeParse(input);
  if (!parsed.success) return { error: parsed.error.flatten().fieldErrors };

  try {
    // Verify location exists
    const location = await db.locations.findUnique({
      where: { id: parsed.data.locationId }
    });

    if (!location) {
      return { error: "Invalid locationId: location does not exist." };
    }

    const address = await db.addresses.create({
      data: {
        userId: session.user.id,
        ...parsed.data
      },
      include: { location: true },
    });
    return { success: true, address };
  } catch (error) {
    console.log('Error details:', error);
    return { error: 'Failed to add address' };
  }
}

export async function deleteAddress(id: string) {
  const session = await auth();
  if (!session?.user?.id) return { error: 'Not authenticated' };
  try {
    await db.addresses.delete({
      where: { id },
    });
    return { success: true };
  } catch (error) {
    return { error: 'Failed to delete address' };
  }
} 