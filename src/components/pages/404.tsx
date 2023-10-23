import Head from "next/head";
import React, { useEffect } from "react";
export interface Props {
    message?: React.ReactNode;
    children?: React.ReactNode;
    state?: string;
}
export default function Page404({ message, children, state = "404" }: Props) {
    useEffect(() => {
        document.title = state;
    }, [state]);
    return (
        <>
            <Head>
                <title>Page not Found</title>
            </Head>
            <section
                className="hero-section set-bg"
                data-setbg="img/bg.jpg"
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
