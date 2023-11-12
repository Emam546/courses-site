import EmailVerification from "@/components/pages/emailVerfication";
import { NextPageWithLayout } from "./_app";
import Head from "next/head";

const Page: NextPageWithLayout = () => {
    return (
        <div className="tw-flex-1">
            <Head>
                <title>Email Verification</title>
            </Head>
            <EmailVerification />
        </div>
    );
};
Page.getLayout = (page) => {
    return <>{page}</>;
};
export default Page;
