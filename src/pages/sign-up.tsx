import SingUp from "@/components/pages/singup";
import { auth } from "@/firebase";
import { setRememberMeState } from "@/utils/firebase";
import { signInWithCustomToken } from "firebase/auth";
import Head from "next/head";
import { useRouter } from "next/router";
import { ReactElement } from "react";

function Page() {
    const router = useRouter();
    return (
        <>
            <Head>
                <title>Sing up</title>
            </Head>
            <SingUp
                onUser={async (token, rememberMe) => {
                    await setRememberMeState(auth, rememberMe);
                    await signInWithCustomToken(auth, token);
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
