import SingUp from "@/components/pages/signup";
import React from "react";
import { NextPageWithLayout } from "./_app";
import Head from "next/head";

const Page: NextPageWithLayout = () => {
    return (
        <div className="tw-flex-1">
            <Head>
                <title>Sign Up</title>
            </Head>
            <SingUp />
        </div>
    );
};
Page.getLayout = (page) => {
    return <>{page}</>;
};
export default Page;
