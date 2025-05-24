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