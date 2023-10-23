import { auth } from "@/firebase";
import { useAuthState } from "react-firebase-hooks/auth";

export function PaymentCourse() {
    const [user] = useAuthState(auth);
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
                        <p>Dear {user?.displayName},</p>
                        <p>
                            We would like to remind you that your payment for
                            the course is still pending.
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
            </section>
        </>
    );
}
