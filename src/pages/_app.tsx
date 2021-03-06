// src/pages/_app.tsx
import { withTRPC } from "@trpc/next";
import type { AppRouter } from "@src/server/router";
import type { AppType } from "next/dist/shared/lib/utils";
import superjson from "superjson";
import { SessionProvider } from "next-auth/react";
import { ChakraProvider } from "@chakra-ui/react";
import Layout from "@src/components/Layout/Layout";
import Head from "next/head";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

const MyApp: AppType = ({
    Component,
    pageProps: { session, ...pageProps },
}) => {
    return (
        <SessionProvider session={session}>
            <ChakraProvider>
                <Head>
                    <title>Hand2</title>
                    <meta name="description" content="Sell 2nd Hand items" />
                    <link rel="icon" href="/favicon.ico" />
                </Head>
                <Layout>
                    <Component {...pageProps} />
                </Layout>
            </ChakraProvider>
        </SessionProvider>
    );
};

const getBaseUrl = () => {
    if (typeof window !== "undefined") {
        return "";
    }
    if (process.browser) return ""; // Browser should use current path
    if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`; // SSR should use vercel url

    return `http://localhost:${process.env.PORT ?? 3000}`; // dev SSR should use localhost
};

export default withTRPC<AppRouter>({
    config({ ctx }) {
        /**
         * If you want to use SSR, you need to use the server's full URL
         * @link https://trpc.io/docs/ssr
         */
        const url = `${getBaseUrl()}/api/trpc`;

        return {
            url,
            transformer: superjson,
            /**
             * @link https://react-query.tanstack.com/reference/QueryClient
             */
            // queryClientConfig: { defaultOptions: { queries: { staleTime: 60 } } },
        };
    },
    /**
     * @link https://trpc.io/docs/ssr
     */
    ssr: false,
})(MyApp);
