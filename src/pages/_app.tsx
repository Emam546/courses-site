import "@/styles/login.scss";
import "@/styles/styles.scss";
import "@/styles/exam.scss";
import "@/styles/global.scss";
import "@fortawesome/fontawesome-svg-core/styles.css";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import "simplebar-react/dist/simplebar.min.css";
import { config } from "@fortawesome/fontawesome-svg-core";
import type { AppProps } from "next/app";
import React, { ReactElement, ReactNode, useEffect } from "react";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
// import { GoogleOAuthProvider } from "@react-oauth/google";
import MainWrapper from "@/components/mainWrapper";
import { QueryClientProvider } from "@tanstack/react-query";
import queryClient from "@/queryClient";
import { NextPage } from "next";
import ConnectedBar from "@/components/internetConnection";

config.autoAddCss = false;

export type NextPageWithLayout<P = Record<string, unknown>, IP = P> = NextPage<
    P,
    IP
> & {
    getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
    Component: NextPageWithLayout;
};
export function Provider({ children }: { children: ReactNode }) {
    return (
        <QueryClientProvider client={queryClient}>
            {/* <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_CLIENT_ID!}> */}
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                {children}
            </LocalizationProvider>
            {/* </GoogleOAuthProvider> */}
        </QueryClientProvider>
    );
}
export default function App({ Component, pageProps }: AppPropsWithLayout) {
    useEffect(() => {
        window.ResizeObserver = ResizeObserver;
        require("bootstrap/dist/js/bootstrap.bundle.min.js");
    }, []);

    return (
        <Provider>
            {Component.getLayout ? (
                Component.getLayout(<Component {...pageProps} />)
            ) : (
                <>
                    <ConnectedBar />
                    <MainWrapper>{<Component {...pageProps} />}</MainWrapper>
                </>
            )}
        </Provider>
    );
}
