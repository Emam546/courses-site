import Head from "next/head";
import React, { useEffect } from "react";
export interface Props {
    message: string;
}
export default function Page404({
    message,
    state = "404",
}: {
    state?: string;
    message: string;
}) {
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
                        <h2>{state}</h2>
                        <p>{message}</p>
                    </div>
                </div>
            </section>
        </>
    );
}
