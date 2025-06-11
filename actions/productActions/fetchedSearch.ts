'use server'
import { Prisma } from "@prisma/client";
import { db } from "@/lib/db";
import { unstable_cache } from "next/cache";

export const fetchSearch = unstable_cache(
    async (rawQuery: string) => {
        const cleaned = rawQuery.trim();
        if (!cleaned) return [];

        const keywords = cleaned.split(/\s+/);

        // 👇 Tell TS exactly what each item is
        const orConditions: Prisma.ProductWhereInput[] =
            keywords.flatMap<Prisma.ProductWhereInput>((k) => [
                {
                    name: { contains: k, mode: "insensitive" },   // 👈 literal stays "insensitive"
                },
                {
                    description: { contains: k, mode: "insensitive" },
                },
                {
                    category: { contains: k, mode: "insensitive" },
                },
            ]);

        return db.product.findMany({
            where: { OR: orConditions },
            include: {
                images: { select: { id: true, imageUrl: true } },
            },
            orderBy: { name: "asc" },
        });
    },
    ['searchQuery'], // Cache key
    {
        tags: ['searchQuery'],
        revalidate: 60 * 5 // Revalidate every 5 minutes
    }
)
