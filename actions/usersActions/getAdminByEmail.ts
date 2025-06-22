'use server'
import { db } from "@/lib/db";
export const getAdminByEmail = async (email: string) => {
    const admin = await db.user.findFirst({
        where: {
            email,
            role: "ADMIN",
        },
    });
    return admin;
};

export const getAllAdmins = async () => {
    return db.user.findMany({
        where: { role: 'ADMIN' },
        select: { id: true, name: true, email: true },
    });
};

export const revokeAdminAccess = async (id: string) => {
    try {
        const updated = await db.user.update({
            where: { id },
            data: { role: 'USER' },
            select: { id: true, name: true, email: true, role: true },
        });
        return { success: true, user: updated };
    } catch (error) {
        return { error: 'Failed to revoke admin access.' };
    }
};