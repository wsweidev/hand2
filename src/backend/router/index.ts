import * as trpc from "@trpc/server";
import { z } from "zod";
import { prisma } from "../utils/prisma";

export const appRouter = trpc
    .router()
    .query("get-pokemon-by-id", {
        input: z.object({
            id: z.number(),
        }),
        async resolve({ input }) {
            return {
                greeting: `hello ${input?.id ?? "world"}`,
            };
        },
    })
    .mutation("add-comment", {
        input: z.object({
            comment: z.string(),
        }),
        async resolve({ input }) {
            const commentToDb = await prisma.comment.create({
                data: { content: input.comment },
            });
            return { success: true };
        },
    });

// export type definition of API
export type AppRouter = typeof appRouter;
