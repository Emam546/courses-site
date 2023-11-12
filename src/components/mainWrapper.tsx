import SideBar from "@/components/sidebar";
import { useEffect, useRef } from "react";
import Header from "@/components/header";
import Login from "./pages/login";
import { useRouter } from "next/router";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/firebase";
import EmailVerification from "./pages/emialVerfication";

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
    const [user, loading, error] = useAuthState(auth);
    if (loading) return null;
    if (!user)
        return (
            <div className="tw-flex-1">
                <Login />
            </div>
        );
    if (!user.emailVerified)
        return (
            <div className="tw-flex-1">
                <EmailVerification />
            </div>
        );
    return <MainApp>{children}</MainApp>;
}
