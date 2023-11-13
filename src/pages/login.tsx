import Login from "@/components/pages/login";
import { useLogIn } from "@/hooks/auth";
import Head from "next/head";
import { useRouter } from "next/router";
import { ReactElement } from "react";

function Page() {
    const login = useLogIn();
    const router = useRouter();
    return (
        <>
            <Head>
                <title>Login</title>
            </Head>
            <Login
                onLogin={async (user) => {
                    login(user);
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
