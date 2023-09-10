import { DataBase } from "@/data";
import { useGetPayment } from "@/hooks/firebase";
import { useAppSelector } from "@/store";
import { QueryDocumentSnapshot, QuerySnapshot } from "firebase/firestore";
import Loader from "./loader";
import ErrorShower from "./error";
import Page404 from "./pages/404";
import { useEffect } from "react";

export interface Props {
    course: QueryDocumentSnapshot<DataBase["Courses"]>;
    children: React.ReactNode;
}
export function PaymentProtector({ course, children }: Props) {
    const queryPayment = useGetPayment(course.id);
    const user = useAppSelector((state) => state.auth.user);
    useEffect(() => {
        if (
            !queryPayment.isLoading &&
            !queryPayment.isError &&
            !queryPayment.data
        )
            document.title = "Payment Reminder";
    }, [queryPayment.data]);
    if (!user)
        return (
            <Page404
                state="403"
                message="You are not authenticated"
            />
        );
    if (queryPayment.isLoading) return <Loader />;
    if (queryPayment.isError) return <ErrorShower err={queryPayment.error} />;
    if (!queryPayment.data)
        return (
            <>
                <section
                    className="hero-section set-bg"
                    style={{
                        backgroundImage: "url(img/bg.jpg)",
                    }}
                >
                    <div className="container">
                        <div className="hero-text text-white">
                            <h2>Course Payment Reminder</h2>
                            <p>Dear {user?.data().name},</p>
                            <p>
                                We would like to remind you that your payment
                                for the {course.data().name} is still pending.
                            </p>
                            <p>
                                If you have any questions or need assistance,
                                please contact our billing department.
                            </p>
                            <p>
                                Thank you for your prompt attention to this
                                matter.
                            </p>
                        </div>
                    </div>
                </section>
            </>
        );
    return <>{children}</>;
}
