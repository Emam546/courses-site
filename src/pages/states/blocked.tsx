import { useAppSelector } from "@/store";
import Page404 from "@/components/pages/404";

function Page() {
    const user = useAppSelector((state) => state.auth.user);
    return (
        <>
            <Page404 title="Account Blocked">
                <h1>Account Blocked</h1>
                <p>Dear {user?.displayname || "User"}</p>
                <p>
                    We regret to inform you that your account has been blocked
                    due to a violation of our community guidelines or terms of
                    service.
                </p>
                <p>
                    If you believe this decision is in error or would like to
                    appeal the block, We will review your case promptly.
                </p>
                <p>Thank you for your understanding.</p>
                <p>Best regards</p>
            </Page404>
        </>
    );
}

export default Page;
