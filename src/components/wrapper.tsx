import { getDocRef } from "@/firebase";
import { useAppDispatch } from "@/store";
import { AuthActions } from "@/store/auth";
import { getDoc } from "firebase/firestore";
import React, { ReactNode, useLayoutEffect, useState } from "react";
import Header from "./common/header";
import Protector from "./protector";
export function ProvideUser({ children }: { children: ReactNode }) {
    const dispatch = useAppDispatch();
    const [loading, setLoading] = useState(true);
    useLayoutEffect(() => {
        const id = localStorage.getItem("userId");
        if (!id) return setLoading(false);
        (async function () {
            const res = await getDoc(getDocRef("Users", id));
            if (!res.exists()) return localStorage.removeItem("user");
            dispatch(AuthActions.setUser(res));
        })().finally(() => {
            setLoading(false);
        });
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
