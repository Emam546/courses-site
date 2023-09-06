import { getDocRef } from "@/firebase";
import { useAppDispatch } from "@/store";
import { AuthActions } from "@/store/auth";
import { getDoc } from "firebase/firestore";
import React, { ReactNode, useLayoutEffect, useState } from "react";
import Header from "./common/header";
import Protector from "./protector";
export function ProvideUser({ children }: { children: ReactNode }) {
    const dispatch = useAppDispatch();
    const [loading, setLoading] = useState(false);
    useLayoutEffect(() => {
        const id = localStorage.getItem("userId");
        if (!id) return;
        setLoading(true);
        (async function () {
            const res = await getDoc(getDocRef("Users", id));
            setLoading(false);
            if (!res.exists()) return localStorage.removeItem("user");
            dispatch(AuthActions.setUser(res));
        })();
    }, []);
    if (loading) return null;
    return <>{children}</>;
}
export default function MainComponentsProvider({
    children,
}: {
    children: ReactNode;
}) {
    return (
        <ProvideUser>
            <Protector>
                <div className="super_container">
                    <Header />
                    {children}
                </div>
            </Protector>
        </ProvideUser>
    );
}
