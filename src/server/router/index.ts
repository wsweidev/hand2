// src/server/router/index.ts
import { createRouter } from "./context";
import superjson from "superjson";

import { productRouter } from "./productRouter";
import { withAuthRouter } from "./withAuthRouter";

export const appRouter = createRouter()
    .transformer(superjson)
    .merge("product.", productRouter)
    .merge("next-auth.", withAuthRouter);

// export type definition of API
export type AppRouter = typeof appRouter;
