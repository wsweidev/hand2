// src/server/router/context.ts
import * as trpc from "@trpc/server";
import * as trpcNext from "@trpc/server/adapters/next";
import { getServerSession } from "next-auth";
import { prisma } from "../db/client";
import { nextAuthOptions } from "../../pages/api/auth/[...nextauth]";

export const createContext = async (
    opts?: trpcNext.CreateNextContextOptions
) => {
    const req = opts?.req;
    const res = opts?.res;
    /**
     * Uses faster "getServerSession" in next-auth v4 that avoids a fetch request to /api/auth.
     * This function also updates the session cookie whereas getSession does not
     * Note: If no req -> SSG is being used -> no session exists (null)
     * @link https://github.com/nextauthjs/next-auth/issues/1535
     */
    const session = opts && (await getServerSession(opts, nextAuthOptions));

    return {
        req,
        res,
        session,
        prisma,
    };
};

type Context = trpc.inferAsyncReturnType<typeof createContext>;

export const createRouter = () => trpc.router<Context>();
