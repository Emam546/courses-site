import Head from "next/head";
import React from "react";
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
    return (
        <>
            <Head>
                <title>Page not Found</title>
            </Head>
            <div className="tw-min-h-screen tw-flex tw-items-center tw-justify-center">
                <div className="tw-text-center">
                    <h1>{state}</h1>
                    <p>{message}</p>
                </div>
            </div>
        </>
    );
}
