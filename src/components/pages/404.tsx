import Head from "next/head";
import React from "react";
import classNames from "classnames";
import { title } from "process";
export interface Props {
    message?: React.ReactNode;
    children?: React.ReactNode;
    state?: string;
    title?: string;
}
export default function Page404({ message, children, state }: Props) {
    return (
        <>
            <Head>
                <title>{title || state}</title>
            </Head>
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
