import Login from "@/components/pages/login";
import { useAppDispatch } from "@/store";
import { AuthActions } from "@/store/auth";
import { useRouter } from "next/router";
import { ReactElement } from "react";

function Page() {
    const dispatch = useAppDispatch();
    const router = useRouter();
    return (
        <Login
            onUser={(user) => {
                dispatch(AuthActions.setUser(user));
                router.push("/");
            }}
        />
    );
}
Page.getLayout = function getLayout(page: ReactElement) {
    return <>{page}</>;
};
export default Page;
