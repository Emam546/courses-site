import Login from "@/components/pages/login";
import React from "react";
import { NextPageWithLayout } from "./_app";
import Head from "next/head";
import { useRouter } from "next/router";

const Page: NextPageWithLayout = () => {
    const router = useRouter();
    return (
        <div className="tw-flex-1">
            <Head>
                <title>Login</title>
            </Head>
            <Login
                onLogin={() => {
                    router.push("/");
                }}
            />
        </div>
    );
};
Page.getLayout = (page) => {
    return <>{page}</>;
};
export default Page;
