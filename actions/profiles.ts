"use server";

import { db } from "@/lib/db";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";

// Get user profile with addresses
export const getUserProfile = async () => {
  try {
    const session = await auth()
    if (!session?.user?.email) {
      return { error: "Not authenticated" };
    }

    const user = await db.user.findUnique({
      where: { email: session.user.email },
      include: {
        addresses: {
          include: {
            location: true
          },
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    if (!user) {
      return { error: "User not found" };
    }

    return { user };
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return { error: "Failed to fetch profile" };
  }
};

// Add new address
export const addAddress = async (addressData: {
  addressLine: string;
  postalCode?: string;
  phone?: string;
  locationId: string;
  isDefault?: boolean;
}) => {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return { error: "Not authenticated" };
    }

    const user = await db.user.findUnique({
      where: { email: session.user.email },
      include: { addresses: true }
    });

    if (!user) {
      return { error: "User not found" };
    }

    // If this is the first address or marked as default, set it as default
    if (addressData.isDefault || user.addresses.length === 0) {
      // Remove default from all other addresses
      await db.addresses.updateMany({
        where: { userId: user.id },
        data: { isDefault: false }
      });
      addressData.isDefault = true;
    }

    const newAddress = await db.addresses.create({
      data: {
        ...addressData,
        userId: user.id
      }
    });

    revalidatePath('/profile');
    return { success: "Address added successfully", address: newAddress };
  } catch (error) {
    console.error("Error adding address:", error);
    return { error: "Failed to add address" };
  }
};

// Update address
export const updateAddress = async (addressId: string, addressData: {
  addressLine: string;
  postalCode?: string;
  phone?: string;
  locationId: string;
  isDefault?: boolean;
}) => {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return { error: "Not authenticated" };
    }

    const user = await db.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return { error: "User not found" };
    }

    // Verify the address belongs to the user
    const existingAddress = await db.addresses.findFirst({
      where: { id: addressId, userId: user.id }
    });

    if (!existingAddress) {
      return { error: "Address not found" };
    }

    // If setting as default, remove default from other addresses
    if (addressData.isDefault) {
      await db.addresses.updateMany({
        where: { userId: user.id, id: { not: addressId } },
        data: { isDefault: false }
      });
    }

    const updatedAddress = await db.addresses.update({
      where: { id: addressId },
      data: addressData
    });

    revalidatePath('/profile');
    return { success: "Address updated successfully", address: updatedAddress };
  } catch (error) {
    console.error("Error updating address:", error);
    return { error: "Failed to update address" };
  }
};

// Delete address
export const deleteAddress = async (addressId: string) => {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return { error: "Not authenticated" };
    }

    const user = await db.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return { error: "User not found" };
    }

    // Verify the address belongs to the user
    const existingAddress = await db.addresses.findFirst({
      where: { id: addressId, userId: user.id }
    });

    if (!existingAddress) {
      return { error: "Address not found" };
    }

    await db.addresses.delete({
      where: { id: addressId }
    });

    // If the deleted address was default, set the first remaining address as default
    if (existingAddress.isDefault) {
      const remainingAddresses = await db.addresses.findMany({
        where: { userId: user.id },
        orderBy: { id: 'desc' }
      });

      if (remainingAddresses.length > 0) {
        await db.addresses.update({
          where: { id: remainingAddresses[0].id },
          data: { isDefault: true }
        });
      }
    }

    revalidatePath('/profile');
    return { success: "Address deleted successfully" };
  } catch (error) {
    console.error("Error deleting address:", error);
    return { error: "Failed to delete address" };
  }
};

// Set address as default
export const setDefaultAddress = async (addressId: string) => {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return { error: "Not authenticated" };
    }

    const user = await db.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return { error: "User not found" };
    }

    // Verify the address belongs to the user
    const existingAddress = await db.addresses.findFirst({
      where: { id: addressId, userId: user.id }
    });

    if (!existingAddress) {
      return { error: "Address not found" };
    }

    // Remove default from all addresses
    await db.addresses.updateMany({
      where: { userId: user.id },
      data: { isDefault: false }
    });

    // Set the selected address as default
    await db.addresses.update({
      where: { id: addressId },
      data: { isDefault: true }
    });

    revalidatePath('/profile');
    return { success: "Default address updated successfully" };
  } catch (error) {
    console.error("Error setting default address:", error);
    return { error: "Failed to set default address" };
  }
};

// Change password (admin only)
export const changePassword = async (currentPassword: string, newPassword: string) => {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return { error: "Not authenticated" };
    }

    const user = await db.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return { error: "User not found" };
    }

    // Check if user is admin
    if (user.role !== 'ADMIN') {
      return { error: "Only admins can change passwords" };
    }

    // Verify current password
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isCurrentPasswordValid) {
      return { error: "Current password is incorrect" };
    }

    // Hash new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 12);

    // Update password
    await db.user.update({
      where: { id: user.id },
      data: { password: hashedNewPassword }
    });

    revalidatePath('/profile');
    return { success: "Password changed successfully" };
  } catch (error) {
    console.error("Error changing password:", error);
    return { error: "Failed to change password" };
  }
}; 