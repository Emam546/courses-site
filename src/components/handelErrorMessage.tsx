import { ErrorMessage, ErrorStates } from "@/utils/wrapRequest";
import Page404 from "./pages/404";
import { PaymentCourse } from "./payment";
import Link from "next/link";
import { useLayoutEffect } from "react";
import { useRouter } from "next/router";
export function HidedDoc() {
    return (
        <Page404 title="Page Unavailable">
            <h1 className="tw-text-3xl tw-font-semibold tw-text-gray-800">
                Page Unavailable
            </h1>
            <p className="tw-text-gray-600">
                We regret to inform you that the page you were trying to access
                is no longer available. The page has been hidden by our
                administrator for various reasons. We apologize for any
                inconvenience this may cause.
            </p>
            <p className="tw-text-gray-600">
                If you have any questions or need further assistance, please don
                {"'"}t hesitate to contact our support team at [Contact
                Information].
            </p>
        </Page404>
    );
}
export function PageNotExisted() {
    return (
        <Page404 state="404">
            <h1 className="tw-text-3xl tw-font-semibold tw-text-gray-800">
                The Page is Not Found
            </h1>
            <p className="tw-text-gray-600">
                Sorry, the page you are looking for could not be found. It may
                have been removed, renamed, or is temporarily unavailable.
            </p>
            <p className="tw-text-gray-600">
                You can return to the <Link href="/">home page</Link> or contact
                our support team for assistance.
            </p>
        </Page404>
    );
}
export function UnknownError() {
    return (
        <Page404 title="Error">
            <h1 className="text-3xl font-semibold text-gray-800">
                Error - Unknown Error
            </h1>
            <p className="text-gray-600">
                Sorry, an unknown error has occurred. Please try again later or
                contact our support team for assistance.
            </p>
            <p className="text-gray-600">
                You can return to the <Link href="/">home page</Link> or contact
                our support team for further help.
            </p>
        </Page404>
    );
}
export function RedirectLogin({ link }: { link: string }) {
    const router = useRouter();
    useLayoutEffect(() => {
        router.push(link);
    }, []);
    return null;
}
export function ErrorMessageCom({ error }: { error: ErrorMessage | null }) {
    if (!error) return null;
    switch (error.state) {
        case ErrorStates.UnAuthorized:
            return <RedirectLogin link="/login" />;
        case ErrorStates.TEACHER_BLOCK:
            return <RedirectLogin link="/states/blocked" />;
        case ErrorStates.HidedDoc:
            return <HidedDoc />;
        case ErrorStates.UnPaidCourse:
            return <PaymentCourse />;
        case ErrorStates.UnProvidedId:
        case ErrorStates.UnExistedDoc:
            return <PageNotExisted />;
        default:
            return <UnknownError />;
    }
}
