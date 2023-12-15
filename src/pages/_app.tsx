import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-svg-core/styles.css";
import "@/styles/style.css";
import "@/styles/pages/exam.scss";
import "@/styles/globals.scss";
import "@/styles/owl.carousel.css";
import "react-circular-progressbar/dist/styles.css";
import "react-phone-number-input/style.css";

import "@vidstack/react/player/styles/default/theme.css";
import "@vidstack/react/player/styles/default/layouts/video.css";

import { config } from "@fortawesome/fontawesome-svg-core";
config.autoAddCss = false;
import queryClient from "@/queryClient";
import store from "@/store";
import { QueryClientProvider } from "@tanstack/react-query";
import { NextPage } from "next";
import type { AppProps } from "next/app";
import { ReactElement, ReactNode, useEffect } from "react";
import { Provider } from "react-redux";
import MainComponentsProvider, { ProviderUser } from "@/components/wrapper";
import LoadingBar from "@/components/loadingBar";
import ConnectedBar from "@/components/common/internetConnections";
export type NextPageWithLayout<P = Record<string, unknown>, IP = P> = NextPage<
    P,
    IP
> & {
    getLayout?: (page: ReactElement) => ReactNode;
    providerUser?: true;
};

type AppPropsWithLayout = AppProps & {
    Component: NextPageWithLayout;
};
function LocalProviders({ children }: { children: ReactNode }) {
            useEffect(() => {
            require("bootstrap/dist/js/bootstrap.min");
        }, []);
    return (
        <QueryClientProvider client={queryClient}>
            <Provider store={store}>{children}</Provider>
        </QueryClientProvider>
    );
}
function ApplyProviderUser({
    providerUser,
    children,
}: {
    children: ReactNode;
    providerUser: NextPageWithLayout["providerUser"];
}) {
    if (providerUser) return <ProviderUser>{children}</ProviderUser>;
    return children;
}
export default function App({ Component, pageProps }: AppPropsWithLayout) {

    return (
        <LocalProviders>
            <LoadingBar />
            <ConnectedBar />
            <ApplyProviderUser providerUser={Component.providerUser}>
                {Component.getLayout ? (
                    Component.getLayout(<Component {...pageProps} />)
                ) : (
                    <MainComponentsProvider>
                        <Component {...pageProps} />
                    </MainComponentsProvider>
                )}
            </ApplyProviderUser>
        </LocalProviders>
    );
}
