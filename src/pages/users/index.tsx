import { BigCard } from "@/components/card";
import UsersInfoGenerator from "@/components/pages/users/info";
import Head from "next/head";
import React from "react";

export default function Page() {
    return (
        <div className="tw-flex-1 tw-flex tw-flex-col tw-items-stretch">
            <Head>
                <title>Users</title>
            </Head>
            <BigCard>
                <UsersInfoGenerator />
            </BigCard>
        </div>
    );
}
