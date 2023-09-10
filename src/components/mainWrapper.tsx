import SideBar from "@/components/sidebar";
import { config } from "@fortawesome/fontawesome-svg-core";
import type { AppProps } from "next/app";
import { useEffect, useRef, useState } from "react";
import Header from "@/components/header";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { GoogleOAuthProvider } from "@react-oauth/google";
import Login from "./pages/login";
import { useRouter } from "next/router";
import LoadingBar from "./loadingBar";

function MainApp({ children: children }: { children: React.ReactNode }) {
    const mainWrapper = useRef<HTMLDivElement>(null);
    const router = useRouter();
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
    function onClose() {
        const wrapper = mainWrapper.current;
        if (!wrapper) return;
        wrapper.classList.add("mini-sidebar");
        wrapper.classList.remove("show-sidebar");
    }
    useEffect(() => {
        router.events.on("routeChangeComplete", onClose);
        return () => {
            router.events.off("routeChangeComplete", onClose);
        };
    }, []);
    return (
        <>
            <LoadingBar />
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
                <SideBar onClose={onClose} />
                <div className="body-wrapper tw-flex tw-flex-col tw-w-full">
                    <Header
                        OnOpen={() => {
                            const wrapper = mainWrapper.current;
                            if (!wrapper) return;
                            wrapper.classList.remove("mini-sidebar");
                            wrapper.classList.add("show-sidebar");
                            wrapper.setAttribute("data-sidebartype", "full");
                        }}
                    />
                    <div className="container-fluid tw-flex-1 tw-w-full tw-flex tw-flex-col tw-justify-stretch tw-items-stretch px-4">
                        {children}
                    </div>
                </div>
            </div>
        </>
    );
}
export default function MainWrapper({
    children: children,
}: {
    children: React.ReactNode;
}) {
    const [login, setLogin] = useState(false);
    // if (!login) return <Login onLogin={(state) => setLogin(state)} />;
    return <MainApp>{children}</MainApp>;
}
