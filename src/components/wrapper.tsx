import React, { ReactNode, useEffect, useLayoutEffect, useState } from "react";
import Header from "./header";
import Loader from "./loader";
import { getDocRef } from "@/firebase";
import { useAppDispatch } from "@/store";
import { AuthActions } from "@/store/auth";
import { getDoc } from "firebase/firestore";
import Protector from "./protector";
import Script from "next/script";
import Footer from "./footer";
export function ProvideUser({ children }: { children: ReactNode }) {
    const dispatch = useAppDispatch();
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const id = localStorage.getItem("userId");
        if (!id) return setLoading(false);
        setLoading(true);
        (async function () {
            const res = await getDoc(getDocRef("Users", id));
            if (!res.exists()) return localStorage.removeItem("user");
            dispatch(AuthActions.setUser(res));
        })().finally(() => {
            setLoading(false);
        });
    }, []);
    if (loading) return <Loader />;
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
            <Protector>
                <Header />
                {children}
                <Footer />
            </Protector>
        </ProvideUser>
    );
}
