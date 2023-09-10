import { useAppSelector } from "@/store";
import React from "react";
import { useDispatch } from "react-redux";
import { AuthActions } from "@/store/auth";
import LogIn from "./pages/login";

export default function Protector({ children }: { children: React.ReactNode }) {
    const user = useAppSelector((state) => state.auth.user);
    const dispatch = useDispatch();
    if (user == undefined)
        return (
            <LogIn
                onUser={(user) => {
                    dispatch(AuthActions.setUser(user));
                }}
            />
        );
    return <>{children}</>;
}
