import { createRouter } from "./context";
import { z } from "zod";
import { prisma } from "../db/client";

export const exampleRouter = createRouter()
    .query("hello", {
        input: z
            .object({
                text: z.string().nullish(),
            })
            .nullish(),
        resolve({ input }) {
            return {
                greeting: `Hello ${input?.text ?? "world"}`,
            };
        },
    })
    .query("getAll", {
        async resolve({ ctx }) {
            return await ctx.prisma.example.findMany();
        },
    })
    .query("getProducts", {
        async resolve() {
            return await prisma.product.findMany();
        },
    })
    .mutation("add-product", {
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
