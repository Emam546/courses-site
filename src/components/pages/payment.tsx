import { DataBase } from "@/data";
import { useGetPayment } from "@/hooks/firebase";
import { useAppSelector } from "@/store";
import { QueryDocumentSnapshot, QuerySnapshot } from "firebase/firestore";
import LoadingArea from "./loading";
import Page404 from "./404";
export interface Props {
    course: QueryDocumentSnapshot<DataBase["Courses"]>;
    children: React.ReactNode;
}
export function PaymentProtector({ course, children }: Props) {
    const queryPayment = useGetPayment(course.id);
    const user = useAppSelector((state) => state.auth.user);
    if (!user)
        return (
            <Page404
                state="403"
                message="You are not authenticated"
            />
        );
    if (queryPayment.isLoading) return <LoadingArea />;
    if (queryPayment.isError) return null;
    if (!queryPayment.data)
        return (
            <>
                <div className="tw-min-h-screen tw-flex tw-items-center tw-justify-center">
                    <div className="tw-text-center">
                        <h1>Course Payment Reminder</h1>
                        <p>Dear {user?.data().name},</p>
                        <p>
                            We would like to remind you that your payment for
                            the {course.data().name} is still pending.
                        </p>
                        <p>
                            If you have any questions or need assistance, please
                            contact our billing department.
                        </p>
                        <p>
                            Thank you for your prompt attention to this matter.
                        </p>
                    </div>
                </div>
            </>
        );
    return <>{children}</>;
}
