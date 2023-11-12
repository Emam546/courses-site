import SingUp from "@/components/pages/singup";
import Head from "next/head";
import { useRouter } from "next/router";
import { ReactElement } from "react";
import { useDispatch } from "react-redux";

function Page() {
    const router = useRouter();
    return (
        <>
            <Head>
                <title>Sing up</title>
            </Head>
            <SingUp
                onUser={async () => {
                    router.push("/verify");
                }}
            />
        </>
    );
}
Page.getLayout = function getLayout(page: ReactElement) {
    return <>{page}</>;
};
export default Page;
