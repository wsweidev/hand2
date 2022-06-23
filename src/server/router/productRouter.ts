import { createRouter } from "./context";
import { z } from "zod";
import { prisma } from "../db/client";

export const productRouter = createRouter()
    .query("getAll", {
        async resolve() {
            return await prisma.product.findMany();
        },
    })
    .mutation("add", {
        input: z.object({
            id: z.string(),
            name: z.string(),
            currency: z.string(),
            price: z.number(),
            salePrice: z.optional(z.number()),
            flag: z.optional(z.string()),
            imageUrl: z.string(),
            rating: z.number(),
            ratingCount: z.number(),
            description: z.string(),
        }),
        async resolve({ input }) {
            const productToDb = await prisma.product.create({
                data: { ...input },
            });
            return { success: true };
        },
    });
