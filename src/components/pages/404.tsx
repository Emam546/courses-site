import Head from "next/head";
import React from "react";
import classNames from "classnames";
import { title } from "process";
import { useChangeTitle } from "@/hooks";
export interface Props {
    message?: React.ReactNode;
    children?: React.ReactNode;
    state?: string;
    title?: string;
}
export default function Page404({ message, children, state }: Props) {
    useChangeTitle(title || state || "");
    return (
        <>

            <section
                className={classNames(
                    "hero-section set-bg tw-bg-[url('/img/bg.jpg')] tw-h-screen"
                )}
            >
                <div className="container">
                    <div className="hero-text text-white">
                        {state && <h2>{state}</h2>}
                        {message && <p>{message}</p>}
                        {children}
                    </div>
                </div>
            </section>
        </>
    );
}
