import React, { ReactNode, useEffect } from "react";
import Header from "./header";
import Loader from "./loader";
import Footer from "./footer";
import Login from "./pages/login";
import { StateType } from "@/store/auth";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import ErrorShower from "./error";
import { useAppDispatch, useAppSelector } from "@/store";
import { useRouter } from "next/router";
import { wrapRequest } from "@/utils/wrapRequest";
import { getStudent } from "@/firebase/func/data/student";
import { useLogIn } from "@/hooks/auth";

export function useLoadUserData(options?: UseQueryOptions<StateType["user"]>) {
    return useQuery<StateType["user"]>({
        queryKey: ["User"],
        queryFn: async () => {
            return (await wrapRequest(getStudent())).user;
        },
        ...options,
    });
}
export function ProvideUser({ children }: { children: ReactNode }) {
    const dispatch = useAppDispatch();
    const user = useAppSelector((state) => state.auth.user);
    const login = useLogIn();
    const router = useRouter();
    const {
        data: userData,
        isLoading: LoadingUser,
        error: errorUser,
    } = useLoadUserData({
        onSuccess(user) {
            if (user) login(user);
        },
    });
    useEffect(() => {
        if (user?.blocked) router.push("/states/blocked");
    }, [user]);
    if (errorUser) return <ErrorShower err={errorUser} />;
    if (LoadingUser) return <Loader />;
    if (!userData)
        return (
            <div className="tw-flex-1">
                <Login
                    onLogin={(user) => {
                        login(user);
                    }}
                />
            </div>
        );
    if (!user) return <Loader />;
    if (user.blocked) return <Loader />;

    return <>{children}</>;
}
export default function MainComponentsProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    useEffect(() => {
        require("bootstrap/dist/js/bootstrap.min");
    }, []);
    return (
        <ProvideUser>
            <Header />
            {children}
            <Footer />
        </ProvideUser>
    );
}
