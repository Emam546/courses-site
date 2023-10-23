import Login from "@/components/pages/login";
import Head from "next/head";
import { ReactElement } from "react";

function Page() {
    return (
        <>
            <Head>
                <title>Sing up</title>
            </Head>
            <Login onLogin={() => {}} />
        </>
    );
}
Page.getLayout = function getLayout(page: ReactElement) {
    return <>{page}</>;
};
export default Page;
