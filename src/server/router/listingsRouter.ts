import { createRouter } from "@src/server/router/context";
import { z } from "zod";
import { prisma } from "@src/server/db/client";
import { TRPCError } from "@trpc/server";

export const listingsRouter = createRouter()
    .query("getAll", {
        async resolve() {
            return await prisma.listing.findMany({ include: { user: true } });
        },
    })
    .query("getSession", {
        async resolve({ ctx }) {
            // The session object is added to the routers context
            // in the context file server side
            return ctx.session;
        },
    })
    .middleware(async ({ ctx, next }) => {
        // Any query or mutation after this middleware will raise
        // an error unless there is a current session
        if (!ctx.session || !ctx.session.user || !ctx.session.user.id) {
            throw new TRPCError({ code: "UNAUTHORIZED" });
        }
        return next();
    })
    .mutation("add", {
        input: z.object({
            name: z.string(),
            expires: z.date(),
            description: z.string(),
            price: z.number(),
            type: z.enum(["bid", "sell"]),
            status: z.enum(["sold", "listed", "canceled"]),
            mainImageUrl: z.optional(z.string()),
        }),
        async resolve({ input, ctx }) {
            const userId = ctx.session?.user!.id!;
            const productToDb = await prisma.listing.create({
                data: {
                    userId: userId,
                    expires: new Date(),
                    name: input.name,
                    description: input.description,
                    price: input.price,
                    type: input.type,
                    status: input.status,
                    mainImageUrl: input.mainImageUrl,
                },
            });
            return { success: true };
        },
    });
