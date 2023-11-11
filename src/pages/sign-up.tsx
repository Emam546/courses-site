import SingUp from "@/components/pages/singup";
import { auth } from "@/firebase";
import { AuthActions } from "@/store/auth";
import { setRememberMeState } from "@/utils/firebase";
import { signInWithCustomToken } from "firebase/auth";
import Head from "next/head";
import { useRouter } from "next/router";
import { ReactElement } from "react";
import { useDispatch } from "react-redux";

function Page() {
    const router = useRouter();
    const dispatch = useDispatch();
    return (
        <>
            <Head>
                <title>Sing up</title>
            </Head>
            <SingUp
                onUser={async (user) => {
                    dispatch(AuthActions.setUser(user));
                    router.push("/");
                }}
            />
        </>
    );
}
Page.getLayout = function getLayout(page: ReactElement) {
    return <>{page}</>;
};
export default Page;
