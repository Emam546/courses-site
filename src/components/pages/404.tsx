import Head from "next/head";
import Link from "next/link";
import React, { useEffect } from "react";
export interface Props {
    message?: React.ReactNode;
    children?: React.ReactNode;
    state?: string;
}
export default function Page404({ message, children, state }: Props) {
    return (
        <>
            <Head>
                <title>{state}</title>
            </Head>
            <section
                className="hero-section set-bg"
                style={{
                    backgroundImage: `url(/img/bg.jpg)`,
                }}
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
