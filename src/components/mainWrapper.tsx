import SideBar from "@/components/sidebar";
import { useEffect, useRef } from "react";
import Header from "@/components/header";
import Login from "./pages/login";
import { useRouter } from "next/router";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, getDocRef } from "@/firebase";
import EmailVerification from "./pages/emialVerfication";
import { useQuery } from "@tanstack/react-query";
import { FirestoreError, getDoc } from "firebase/firestore";
import { useAppDispatch, useAppSelector } from "@/store";
import { AuthActions } from "@/store/auth";
import ErrorShower from "./common/error";
import { QueryDocumentSnapshot } from "firebase/firestore";

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
                    <div className="container-fluid  tw-flex-1 tw-w-full tw-flex tw-flex-col tw-justify-stretch tw-items-stretch px-4">
                        {children}
                    </div>
                </div>
            </div>
        </>
    );
}
export function useLoadUser(userId?: string) {
    return useQuery<
        QueryDocumentSnapshot<DataBase["Teacher"]> | null,
        FirestoreError
    >({
        queryKey: ["Teacher", userId],
        queryFn: async () => {
            const doc = await getDoc(getDocRef("Teacher", userId!));
            if (!doc.exists()) return null;
            return doc;
        },
        enabled: typeof userId == "string",
    });
}
export function UserProvider({
    children: children,
}: {
    children: React.ReactNode;
}) {
    const [user, loading, error] = useAuthState(auth);
    const userDoc = useAppSelector((state) => state.auth.user);
    const dispatch = useAppDispatch();
    const queryUser = useLoadUser(user?.uid);
    useEffect(() => {
        const doc = queryUser.data;
        if (!doc) return;
        const data = doc.data();
        dispatch(
            AuthActions.setUser({
                ...data,
                id: doc.id,
                blocked: data.blocked
                    ? {
                          at: data.blocked?.at.toDate().toString(),
                          teacherId: data.blocked?.teacherId,
                      }
                    : null,
                createdAt: data.createdAt.toDate().toString(),
            })
        );
    }, [queryUser.data]);
    useEffect(() => {
        if (!user) dispatch(AuthActions.setUser(undefined));
    }, [user]);
    if (loading || error)
        return (
            <ErrorShower
                loading={loading}
                error={error as FirestoreError}
            />
        );
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

    if (queryUser.isLoading || queryUser.error || userDoc == undefined)
        return (
            <ErrorShower
                loading={queryUser.isLoading}
                error={queryUser.error}
            />
        );
    if (!queryUser.data)
        return (
            <ErrorShower
                error={{
                    code: "unavailable",
                    message: "The user is not exist",
                    name: "userDoc is not exist",
                }}
            />
        );
    if (!userDoc) return null;
    return <>{children}</>;
}
export default function MainWrapper({
    children: children,
}: {
    children: React.ReactNode;
}) {
    return (
        <UserProvider>
            <MainApp>{children}</MainApp>
        </UserProvider>
    );
}
