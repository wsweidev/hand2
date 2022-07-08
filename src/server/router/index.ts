// src/server/router/index.ts
import { createRouter } from "@src/server/router/context";
import superjson from "superjson";
import { listingsRouter } from "@src/server/router/listingsRouter";
// import { withAuthRouter } from "./withAuthRouter";

export const appRouter = createRouter()
    .transformer(superjson)
    // .merge("next-auth.", withAuthRouter)
    .merge("listings.", listingsRouter);

// export type definition of API
export type AppRouter = typeof appRouter;
