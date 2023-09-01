import "@/styles/styles.scss";
import "@fortawesome/fontawesome-svg-core/styles.css";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import "simplebar-react/dist/simplebar.min.css";
import SideBar from "@/components/sidebar";
import { config } from "@fortawesome/fontawesome-svg-core";
import type { AppProps } from "next/app";
import { useEffect, useRef } from "react";
import Header from "@/components/header";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { GoogleOAuthProvider } from "@react-oauth/google";

config.autoAddCss = false;
export default function App({ Component, pageProps }: AppProps) {
    useEffect(() => {
        window.ResizeObserver = ResizeObserver;
        require("bootstrap/dist/js/bootstrap.bundle.min.js");
    }, []);
    const mainWrapper = useRef<HTMLDivElement>(null);
    useEffect(() => {
        function setSideBar() {
            const wrapper = mainWrapper.current;
            if (!wrapper) return;
            const width =
                window.innerWidth > 0 ? window.innerWidth : window.screen.width;

            if (width < 1199) {
                wrapper.setAttribute("data-sidebartype", "mini-sidebar");
                wrapper.classList.add("mini-sidebar");
            } else {
                wrapper.setAttribute("data-sidebartype", "full");
                wrapper.classList.remove("mini-sidebar");
            }
        }
        setSideBar();
        window.addEventListener("resize", setSideBar);
    }, [mainWrapper]);
    return (
        <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_CLIENT_ID!}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <div
                    className="page-wrapper tw-flex tw-flex-1 tw-items-stretch tw-justify-stretch"
                    id="main-wrapper"
                    data-layout="vertical"
                    data-navbarbg="skin6"
                    data-sidebartype="full"
                    data-sidebar-position="fixed"
                    data-header-position="fixed"
                    ref={mainWrapper}
                >
                    <SideBar
                        onClose={function () {
                            const wrapper = mainWrapper.current;
                            if (!wrapper) return;
                            wrapper.classList.add("mini-sidebar");
                            wrapper.classList.remove("show-sidebar");
                            wrapper.setAttribute(
                                "data-sidebartype",
                                "mini-sidebar"
                            );
                        }}
                    />
                    <div className="body-wrapper tw-flex tw-flex-col tw-w-full">
                        <Header
                            OnOpen={() => {
                                const wrapper = mainWrapper.current;
                                if (!wrapper) return;
                                wrapper.classList.remove("mini-sidebar");
                                wrapper.classList.add("show-sidebar");
                                wrapper.setAttribute(
                                    "data-sidebartype",
                                    "full"
                                );
                            }}
                        />
                        <div className="container-fluid tw-flex-1 tw-w-full tw-flex tw-flex-col tw-justify-stretch tw-items-stretch px-4">
                            <Component {...pageProps} />
                        </div>
                    </div>
                </div>
            </LocalizationProvider>
        </GoogleOAuthProvider>
    );
}
