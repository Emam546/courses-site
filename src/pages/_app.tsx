import "@/styles/globals.css";
import "@/styles/pages/exam.scss";
import queryClient from "@/queryClient";
import store from "@/store";
import { QueryClientProvider } from "@tanstack/react-query";
import { NextPage } from "next";
import type { AppProps } from "next/app";
import { ReactElement, ReactNode } from "react";
import { Provider } from "react-redux";
import MainComponentsProvider from "@/components/wrapper";
export type NextPageWithLayout<P = Record<string, unknown>, IP = P> = NextPage<
    P,
    IP
> & {
    getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
    Component: NextPageWithLayout;
};
function LocalProviders({ children }: { children: ReactNode }) {
    return (
        <QueryClientProvider client={queryClient}>
            <Provider store={store}>{children}</Provider>
        </QueryClientProvider>
    );
}

export default function App({ Component, pageProps }: AppPropsWithLayout) {
    return (
        <LocalProviders>
            {Component.getLayout ? (
                Component.getLayout(<Component {...pageProps} />)
            ) : (
                <MainComponentsProvider>
                    <Component {...pageProps} />
                </MainComponentsProvider>
            )}
        </LocalProviders>
    );
}
