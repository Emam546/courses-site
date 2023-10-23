import { auth } from "@/firebase";
import { useRouter } from "next/router";
import { useEffect } from "react";
import {
    useAuthState,
    useSendEmailVerification,
} from "react-firebase-hooks/auth";

export default function EmailVerification() {
    const [sendVerification, loading, error] = useSendEmailVerification(auth);
    const [user] = useAuthState(auth);
    const router = useRouter();
    useEffect(() => {
        if (!user) router.replace("/login");
        else if (user?.emailVerified) router.replace("/");
        else sendVerification();
    }, [user]);
    return (
        <section className="dark:tw-bg-gray-900 tw-bg-gray-50">
            <div className="tw-min-h-screen tw-flex tw-flex-col tw-items-center tw-justify-center tw-px-6 tw-py-8 tw-mx-auto md:tw-h-screen lg:tw-py-0">
                <div className="tw-w-full tw-bg-white tw-rounded-lg tw-shadow dark:tw-border md:tw-mt-0 sm:tw-max-w-md xl:tw-p-0 dark:tw-bg-gray-800 dark:tw-border-gray-700">
                    <div className="tw-p-6 tw-space-y-4 md:tw-space-y-6 sm:tw-p-8">
                        <p className="text-center">Email Verification</p>
                        <p>We have sent you an email to verify your account</p>
                        <button
                            type="submit"
                            disabled={loading}
                            onClick={() => sendVerification()}
                            className="btn btn-primary w-100 py-8 fs-4 mb-4 rounded-2"
                        >
                            Resend the email
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}
