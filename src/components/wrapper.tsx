import React, { ReactNode, useEffect } from "react";
import Header from "./header";
import Loader from "./loader";
import Footer from "./footer";
import Login from "./pages/login";
import { StateType } from "@/store/auth";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import ErrorShower from "./error";
import { useAppSelector } from "@/store";
import { useRouter } from "next/router";
import { ErrorMessage, ErrorStates, wrapRequest } from "@/utils/wrapRequest";
import { getStudent } from "@/firebase/func/data/student";
import { useLogIn } from "@/hooks/auth";

export function useLoadUserData(
    options?: UseQueryOptions<StateType["user"], ErrorMessage>
) {
    return useQuery<StateType["user"], ErrorMessage>({
        queryKey: ["User"],
        queryFn: async () => {
            return (await wrapRequest(getStudent())).user;
        },
        ...(options as any),
    });
}
export function ProviderUser({ children }: { children: ReactNode }) {
    const user = useAppSelector((state) => state.auth.user);
    const login = useLogIn();
    const router = useRouter();
    useEffect(() => {
        if (user?.blocked) router.push("/states/blocked");
    }, [user]);
    if (!user)
        return (
            <div className="tw-flex-1">
                <Login
                    onLogin={(user) => {
                        login(user);
                    }}
                />
            </div>
        );
    if (user.blocked) return <Loader />;
    return <>{children}</>;
}
export function HeaderFooter({ children }: { children: React.ReactNode }) {
    return (
        <>
            <Header />
            {children}
            <Footer />
        </>
    );
}
export function UserLoader({ children }: { children: React.ReactNode }) {

    const login = useLogIn();
    const { isLoading: LoadingUser, error: errorUser } = useLoadUserData({
        onSuccess(user) {
            if (user) login(user);
        },
    });
    if (errorUser && errorUser.state != ErrorStates.UnAuthorized)
        return <ErrorShower err={errorUser} />;
    if (LoadingUser) return <Loader />;
    return children;
}
export default function MainComponentsProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <HeaderFooter>
            <UserLoader>{children}</UserLoader>
        </HeaderFooter>
    );
}
