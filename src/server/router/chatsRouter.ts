import { createRouter } from "@src/server/router/context";
import { z } from "zod";
import { prisma } from "@src/server/db/client";
import { TRPCError } from "@trpc/server";

const groupBy = <T, K extends keyof any>(arr: T[], key: (i: T) => K) =>
    arr.reduce((groups, item) => {
        (groups[key(item)] ||= []).push(item);
        return groups;
    }, {} as Record<K, T[]>);

export const chatsRouter = createRouter()
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
    .query("getUserChats", {
        async resolve({ input, ctx }) {
            const userId = ctx.session?.user!.id!;
            const chats = await prisma.chatMessage.findMany({
                include: {
                    sender: true,
                    receiver: true,
                    mentionedListing: true,
                },
                where: { OR: { senderId: userId, receiverId: userId } },
                orderBy: { createdAt: "asc" },
            });
            const groupedChats = groupBy(chats, (chat) =>
                chat.receiver.name! === userId
                    ? chat.receiver.name!
                    : chat.sender.name!
            );
            return groupedChats;
        },
    })
    .mutation("sendMessage", {
        input: z.object({
            mentionedListing: z.optional(z.string()),
            receiverId: z.string(),
            message: z.string(),
        }),
        async resolve({ input, ctx }) {
            const userId = ctx.session?.user!.id!;
            const chatToDb = await prisma.chatMessage.create({
                data: {
                    receiverId: input.receiverId,
                    senderId: userId,
                    message: input.message,
                    mentionedListingId: input.mentionedListing,
                },
            });
            return { success: true };
        },
    });
