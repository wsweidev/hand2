// src/server/router/index.ts
import { createRouter } from "./context";
import superjson from "superjson";

import { productRouter } from "./productRouter";
// import { withAuthRouter } from "./withAuthRouter";

export const appRouter = createRouter()
    .transformer(superjson)
    // .merge("next-auth.", withAuthRouter)
    .merge("product.", productRouter);

// export type definition of API
export type AppRouter = typeof appRouter;
