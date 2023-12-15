import { createCollection, getDocRef } from "@/firebase";
import { formateDate } from "@/utils";
import { createTableDoc } from "@/utils/jspdf";
import { getDocs, query, where, orderBy, getDoc } from "firebase/firestore";
import { PrintButton } from "./PrintButton";
import { printJsDoc } from "./utils";
import { getDocCache } from "@/hooks/fireStore";

export default function PrintUserPayments({ userId }: { userId: string }) {
    return (
        <PrintButton
            fn={async () => {
                const res = await getDocs(
                    query(
                        createCollection("Payments"),
                        where("userId", "==", userId),
                        orderBy("activatedAt", "desc")
                    )
                );
                const user = await getDoc(getDocRef("Students", userId));
                if (!user.exists()) throw new Error("The user is not exist");
                const body = await Promise.all(
                    res.docs.map(async (doc) => {
                        const data = doc.data();
                        console.log(data);
                        const courseDoc = await getDocCache(
                            "Courses",
                            data.courseId
                        );
                        const teacherDoc = await getDocCache(
                            "Teacher",
                            data.teacherId
                        );

                        return [
                            courseDoc.data()?.name || "Deleted",
                            formateDate(data.activatedAt.toDate()),
                            data.type,
                            teacherDoc.data()?.displayName || "Deleted",
                            `${
                                data.price.num
                            } ${data.price.currency.toLocaleUpperCase()}`,
                        ];
                    })
                );
                const doc = createTableDoc(
                    [
                        [
                            "Course",
                            "Activated At",
                            "Type",
                            "Teacher",
                            "Paid Price",
                        ],
                    ],
                    body
                );
                printJsDoc(doc, `${user.data().displayname}-payments.pdf`);
            }}
        />
    );
}
