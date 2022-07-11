import { createRouter } from "@src/server/router/context";
import { z } from "zod";
import { prisma } from "@src/server/db/client";
import { TRPCError } from "@trpc/server";

export const profilesRouter = createRouter()
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
        if (!ctx.session) {
            throw new TRPCError({ code: "UNAUTHORIZED" });
        }
        return next();
    })
    .query("getProfileById", {
        input: z.object({
            id: z.string(),
        }),
        async resolve({ input, ctx }) {
            const profile = await prisma.user.findFirst({
                include: { ratings: true },
                where: { id: { equals: input.id } },
            });
            return {
                ...profile,
                isOwn: profile?.id === ctx.session?.user?.id,
            };
        },
    })
    .mutation("topup", {
        input: z.object({
            amount: z.number(),
        }),
        async resolve({ input, ctx }) {
            const userId = ctx.session?.user!.id!;
            const topupToDb = await prisma.user.update({
                where: { id: userId },
                data: {
                    wallet: { increment: input.amount },
                },
            });
            return { success: true };
        },
    })
    .mutation("addRating", {
        input: z.object({
            receiverId: z.string(),
            stars: z.number(),
        }),
        async resolve({ input, ctx }) {
            const userId = ctx.session?.user!.id!;
            const ratingToDb = await prisma.rating.create({
                data: {
                    stars: input.stars,
                    raterId: userId,
                    userId: input.receiverId,
                },
            });
            return { success: true };
        },
    });
