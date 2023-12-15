import { createCollection, getDocRef } from "@/firebase";
import { formateDate } from "@/utils";
import { createTableDoc } from "@/utils/jspdf";
import { getDocs, query, where, orderBy, getDoc } from "firebase/firestore";
import { PrintButton } from "./PrintButton";
import { printJsDoc } from "./utils";

export default function PrintUserResults({ userId }: { userId: string }) {
    return (
        <PrintButton
            fn={async () => {
                const res = await getDocs(
                    query(
                        createCollection("Results"),
                        where("userId", "==", userId),
                        orderBy("startAt", "desc")
                    )
                );
                const user = await getDoc(getDocRef("Students", userId));
                if (!user.exists()) throw new Error("The user is not exist");
                const body = await Promise.all(
                    res.docs.map(async (doc) => {
                        const data = doc.data();
                        const examDoc = await getDoc(
                            getDocRef("Exams", data.examId)
                        );
                        const exam = examDoc.data();
                        const course = await getDoc(
                            getDocRef("Courses", data.examId)
                        );
                        const courseData = course.data();
                        return [
                            exam?.name || "Deleted",
                            courseData?.name || "Deleted",
                            data.questions.filter((q) => q.correctState).length,
                            Math.floor(
                                (data.questions.filter((q) => q.correctState)
                                    .length /
                                    data.questions.length) *
                                    100
                            ),
                            data.questions.length,
                            formateDate(data.startAt.toDate()),
                        ];
                    })
                );
                const doc = createTableDoc(
                    [
                        [
                            "Exam",
                            "Course",
                            "Score",
                            "Percent",
                            "Total Questions",
                            "Started At",
                        ],
                    ],
                    body
                );
                printJsDoc(doc, `${user.data().displayname}-results.pdf`);
            }}
        />
    );
}
