import { resendEmail, verifyEmail } from "@/firebase/func/data/verify";
import { useLogIn } from "@/hooks/auth";
import { ErrorMessage, wrapRequest } from "@/utils/wrapRequest";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { useLayoutEffect, useState } from "react";
function useSendEmailVerification() {
    return useMutation({
        mutationKey: ["Verify"],
        mutationFn: async () => {
            return await wrapRequest(resendEmail());
        },
        onError(error: ErrorMessage) {},
    });
}
export default function EmailVerification() {
    const sendEmail = useSendEmailVerification();
    const [error, setError] = useState<string>();
    const router = useRouter();
    const login = useLogIn();
    useLayoutEffect(() => {
        if (typeof router.query.token != "string") return;
        wrapRequest(verifyEmail(router.query.token))
            .then((data) => {
                login(data.user);
                router.push("/");
            })
            .catch((err) => {
                setError(err.message);
            });
    }, [router.query.token]);
    return (
        <section className="tw-bg-gray-50">
            <div className="tw-min-h-screen tw-flex tw-flex-col tw-items-center tw-justify-center tw-px-6 tw-py-8 tw-mx-auto md:tw-h-screen lg:tw-py-0">
                <div className="tw-w-full tw-bg-white tw-rounded-lg tw-shadow md:tw-mt-0 sm:tw-max-w-md xl:tw-p-0">
                    <div className="tw-p-6 tw-space-y-4 md:tw-space-y-6 sm:tw-p-8">
                        <h1 className="text-center tw-font-semibold tw-text-lg">
                            Email Verification
                        </h1>
                        <p className="tw-text-center">
                            We have sent you an email to verify your account
                        </p>
                        {sendEmail.error != undefined && (
                            <p className="tw-text-red-500 tw-text-center">
                                {sendEmail.error.message}
                            </p>
                        )}
                        {error != undefined && (
                            <p className="tw-text-red-500 tw-text-center">
                                {error}
                            </p>
                        )}
                        {sendEmail.isSuccess && (
                            <p className="tw-text-green-600 tw-text-center">
                                The email was sent successfully
                            </p>
                        )}

                        <button
                            type="submit"
                            disabled={sendEmail.isLoading}
                            onClick={() => sendEmail.mutate()}
                            className="btn tw-whitespace-break-spaces btn-primary w-100 py-8 fs-4 mb-4 rounded-2 tw-bg-blue-600 hover:tw-bg-blue-500 disabled:tw-bg-blue-500"
                        >
                            Resend the email
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}
