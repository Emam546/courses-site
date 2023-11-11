import Login from "@/components/pages/login";
import { useAppDispatch } from "@/store";
import { AuthActions } from "@/store/auth";
import Head from "next/head";
import { useRouter } from "next/router";
import { ReactElement } from "react";

function Page() {
    const router = useRouter();
    const dispatch = useAppDispatch();
    return (
        <>
            <Login
                onLogin={async (user) => {
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
