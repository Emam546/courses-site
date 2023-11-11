import React, { ReactNode, useEffect } from "react";
import Header from "./header";
import Loader from "./loader";
import { auth, getDocRef } from "@/firebase";
import Footer from "./footer";
import { useAuthState } from "react-firebase-hooks/auth";
import Login from "./pages/login";
import { getDoc } from "firebase/firestore";
import { AuthActions, StateType } from "@/store/auth";
import { User } from "firebase/auth";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import ErrorShower from "./error";
import { useAppDispatch, useAppSelector } from "@/store";
const loadUserData = async (id: string) => {
    const doc = await getDoc(getDocRef("Students", id));
    if (!doc.exists()) return null;
    const data = doc.data();
    return {
        id: doc.id,
        blocked: data.blocked,
        displayname: data.displayname,
        email: data.email,
        levelId: data.levelId,
        phone: data.phone,
        teacherId: data.teacherId,
        emailVerified: data.emailVerified,
    };
};
export function useLoadUserData(
    user?: User | null,
    options?: UseQueryOptions<StateType["user"] | null>
) {
    return useQuery<StateType["user"] | null>({
        queryKey: ["Users", user?.uid],
        queryFn: async () => {
            if (!user) return null;
            return await loadUserData(user.uid);
        },
        enabled: user != undefined && user != null,
        ...options,
    });
}
export function ProvideUser({ children }: { children: ReactNode }) {
    const [user, loading, error] = useAuthState(auth);
    const dispatch = useAppDispatch();
    const {
        data: userData,
        isLoading: LoadingUser,
        error: errorUser,
    } = useLoadUserData(user, {
        onSuccess(data) {
            if (data === undefined || data === null) return;
            dispatch(AuthActions.setUser(data));
        },
    });
    if (error || errorUser) return <ErrorShower err={error || errorUser} />;
    if (loading || (LoadingUser && user)) return <Loader />;
    if (!user || !userData)
        return (
            <div className="tw-flex-1">
                <Login />
            </div>
        );
    // if (!user.emailVerified)
    //     return (
    //         <div className="tw-flex-1">
    //             <EmailVerification />
    //         </div>
    //     );
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
