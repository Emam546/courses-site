import { createCollection, getDocRef } from "@/firebase";
import { formateDate } from "@/utils";
import { createTableDoc } from "@/utils/jspdf";
import { getDocs, query, where, orderBy, getDoc } from "firebase/firestore";
import { printJsDoc } from "./utils";
import { PrintButton } from "./PrintButton";

export default function PrintExamResults({ examId }: { examId: string }) {
    return (
        <PrintButton
            fn={async () => {
                const res = await getDocs(
                    query(
                        createCollection("Results"),
                        where("examId", "==", examId),
                        orderBy("startAt", "desc")
                    )
                );
                const exam = await getDoc(getDocRef("Exams", examId));
                if (!exam.exists()) throw new Error("The Exam is not exist");
                const body = await Promise.all(
                    res.docs.map(async (doc) => {
                        const data = doc.data();
                        const user = await getDoc(
                            getDocRef("Students", data.userId)
                        );
                        const userData = user.data();
                        return [
                            userData?.displayname || "Deleted",
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
                            "Name",
                            "Score",
                            "Percent",
                            "Total Questions",
                            "Started At",
                        ],
                    ],
                    body
                );

                printJsDoc(doc, `${exam.data().name}-results.pdf`);
            }}
        />
    );
}
