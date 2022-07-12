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
            mainImageUrl: z.string(),
        }),
        async resolve({ input, ctx }) {
            const userId = ctx.session?.user!.id!;
            const listingToDb = await prisma.listing.create({
                data: {
                    userId: userId,
                    expires: input.expires,
                    name: input.name,
                    description: input.description,
                    price: input.price,
                    type: input.type,
                    mainImageUrl: input.mainImageUrl,
                },
            });
            return { success: true };
        },
    })
    .query("getListingById", {
        input: z.object({
            id: z.string(),
        }),
        async resolve({ input, ctx }) {
            const listing = await prisma.listing.findFirst({
                include: { user: true },
                where: { id: { equals: input.id } },
            });
            return {
                ...listing,
                isOwn: listing?.userId === ctx.session?.user?.id,
            };
        },
    })
    .mutation("addBid", {
        input: z.object({
            listingId: z.string(),
            amount: z.number(),
        }),
        async resolve({ input, ctx }) {
            const userId = ctx.session?.user!.id!;
            const bidToDb = await prisma.bid.create({
                data: {
                    userId: userId,
                    listingId: input.listingId,
                    amount: input.amount,
                },
            });

            const bidToListing = await prisma.listing.update({
                where: { id: bidToDb.listingId },
                data: {
                    highestBidderId: userId,
                    price: input.amount,
                },
            });

            return { success: true };
        },
    })
    .mutation("finaliseBid", {
        input: z.object({
            listingId: z.string(),
        }),
        async resolve({ input, ctx }) {
            const userId = ctx.session?.user!.id!;
            const listing = await prisma.listing.findFirst({
                where: { id: input.listingId },
                include: { highestBidder: true },
            });

            const updatedListing = await prisma.listing.update({
                where: { id: input.listingId },
                data: {
                    soldToId: listing?.highestBidderId,
                    status: "sold",
                },
            });

            const userWalletDeduct = await prisma.user.update({
                where: { id: updatedListing?.highestBidderId! },
                data: {
                    wallet: { decrement: updatedListing.price },
                },
            });

            const userWalletIncrease = await prisma.user.update({
                where: { id: updatedListing.userId },
                data: {
                    wallet: { increment: updatedListing.price },
                },
            });

            return { success: true };
        },
    })
    .mutation("purchase", {
        input: z.object({
            listingId: z.string(),
        }),
        async resolve({ input, ctx }) {
            const userId = ctx.session?.user!.id!;

            const updatedListing = await prisma.listing.update({
                where: { id: input.listingId },
                data: {
                    soldToId: userId,
                    status: "sold",
                },
            });

            const userWalletDeduct = await prisma.user.update({
                where: { id: userId },
                data: {
                    wallet: { decrement: updatedListing.price },
                },
            });

            const userWalletIncrease = await prisma.user.update({
                where: { id: updatedListing.userId },
                data: {
                    wallet: { increment: updatedListing.price },
                },
            });

            return { success: true };
        },
    });
