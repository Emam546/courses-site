import { getDocRef } from "@/firebase";
import { formateDate, hasOwnProperty } from "@/utils";
import { createTableDoc } from "@/utils/jspdf";
import { getDoc } from "firebase/firestore";
import { printJsDoc } from "./utils";
import { PrintButton } from "./PrintButton";

export default function PrintCourseStudents({
    courseId,
}: {
    courseId: string;
}) {
    return (
        <PrintButton
            fn={async () => {
                const course = await getDoc(getDocRef("Courses", courseId));
                if (!course.exists())
                    throw new Error("The Course is not exist");
                const coursePayments = await getDoc(
                    getDocRef("EnrolledUsersRecord", courseId)
                );
                if (!coursePayments.exists())
                    throw new Error("The CoursePayments Doc is not exist");
                const body = await Promise.all(
                    coursePayments.data().payments.map(async ({ userId }) => {
                        const user = await getDoc(
                            getDocRef("Students", userId)
                        );
                        if (!user.exists()) return null;
                        const userData = user.data();
                        if (hasOwnProperty(userData, "userName"))
                            return [
                                userData.displayname,
                                userData.userName,
                                userData.phone || "",
                                formateDate(userData.createdAt.toDate()),
                            ];

                        return [
                            userData.displayname,
                            userData.email,
                            userData.phone || "",
                            formateDate(userData.createdAt.toDate()),
                        ];
                    })
                );
                const doc = createTableDoc(
                    [["Name", "Email or UserName", "Phone", "Created At"]],
                    body.filter((val): val is string[] => val != null)
                );
                printJsDoc(doc, `${course.data().name}-students.pdf`);
            }}
        />
    );
}
