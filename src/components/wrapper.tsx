import React, { ReactNode, useEffect } from "react";
import Header from "./header";
import Loader from "./loader";
import { auth } from "@/firebase";
import Protector from "./protector";
import Footer from "./footer";
import { useAuthState } from "react-firebase-hooks/auth";
import Login from "./pages/login";
import EmailVerification from "./pages/emialVerfication";
export function ProvideUser({ children }: { children: ReactNode }) {
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
