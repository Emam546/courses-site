import "@/styles/login.scss";
import "@/styles/styles.scss";
import "@/styles/exam.scss";
import "@/styles/global.scss";
import "@fortawesome/fontawesome-svg-core/styles.css";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import "simplebar-react/dist/simplebar.min.css";
import { config } from "@fortawesome/fontawesome-svg-core";
import type { AppProps } from "next/app";
import { useEffect } from "react";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
// import { GoogleOAuthProvider } from "@react-oauth/google";
import MainWrapper from "@/components/mainWrapper";
import { QueryClientProvider } from "@tanstack/react-query";
import queryClient from "@/queryClient";

config.autoAddCss = false;
export default function App({ Component, pageProps }: AppProps) {
    useEffect(() => {
        window.ResizeObserver = ResizeObserver;
        require("bootstrap/dist/js/bootstrap.bundle.min.js");
    }, []);

    return (
        <QueryClientProvider client={queryClient}>
            {/* <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_CLIENT_ID!}> */}
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <MainWrapper>{<Component {...pageProps} />}</MainWrapper>
            </LocalizationProvider>
            {/* </GoogleOAuthProvider> */}
        </QueryClientProvider>
    );
}
