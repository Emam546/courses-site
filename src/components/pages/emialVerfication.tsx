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
        <div
            className="page-wrapper"
            id="main-wrapper"
            data-layout="vertical"
            data-navbarbg="skin6"
            data-sidebartype="full"
            data-sidebar-position="fixed"
            data-header-position="fixed"
        >
            <div className="position-relative overflow-hidden radial-gradient min-vh-100 d-flex align-items-center justify-content-center">
                <div className="d-flex align-items-center justify-content-center w-100">
                    <div className="row justify-content-center w-100">
                        <div className="col-md-8 col-lg-6 col-xxl-3">
                            <div className="card mb-0">
                                <div className="card-body">
                                    <div className="text-nowrap logo-img text-center d-block py-3 w-100">
                                        <img
                                            src="/images/logos/dark-logo.svg"
                                            width={180}
                                            alt="logo"
                                        />
                                    </div>
                                    <p className="text-center">
                                        Email Verification
                                    </p>
                                    <p>
                                        We have sent you an email to verify your
                                        account
                                    </p>
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
                    </div>
                </div>
            </div>
        </div>
    );
}
