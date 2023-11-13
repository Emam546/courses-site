import { useChangeTitle } from "@/hooks";
import { useAppSelector } from "@/store";
import Page404 from "./pages/404";

export function PaymentCourse() {
    const user = useAppSelector((state) => state.auth.user);

    return (
        <>
            <Page404 title="UnPaid Course">
                <h1 className="tw-text-3xl tw-font-semibold">Course Payment reminder</h1>
                <p>Dear {user?.displayname},</p>
                <p>
                    We would like to remind you that your payment for the course
                    is still pending.
                </p>
                <p>
                    If you have any questions or need assistance, please contact
                    our billing department.
                </p>
                <p>Thank you for your prompt attention to this matter.</p>
            </Page404>
        </>
    );
}
