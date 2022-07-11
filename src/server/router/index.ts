// src/server/router/index.ts
import { createRouter } from "@src/server/router/context";
import superjson from "superjson";
import { listingsRouter } from "@src/server/router/listingsRouter";
import { profilesRouter } from "./profilesRouter";
import { chatsRouter } from "./chatsRouter";

export const appRouter = createRouter()
    .transformer(superjson)
    .merge("profiles.", profilesRouter)
    .merge("listings.", listingsRouter)
    .merge("chats.", chatsRouter);

// export type definition of API
export type AppRouter = typeof appRouter;
