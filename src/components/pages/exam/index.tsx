import { DataBase } from "@/data";
import { createCollection } from "@/firebase";
import { useAppSelector } from "@/store";
import { shuffle } from "@/utils";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
    QueryDocumentSnapshot,
    addDoc,
    getDocs,
    orderBy,
    query,
    serverTimestamp,
    where,
} from "firebase/firestore";
import Link from "next/link";
import { useRouter } from "next/router";
export function Loader({ per }: { per: number }) {
    return (
        <div
            className="loader tw-m-0"
            data-perc={per}
        >
            <svg
                viewBox="0 0 100 100"
                style={{ display: "block", width: "100%" }}
            >
                <path
                    d="M 50,50 m 0,-45 a 45,45 0 1 1 0,90 a 45,45 0 1 1 0,-90"
                    stroke="#f8f4f4"
                    strokeWidth={10}
                    fillOpacity={0}
                />
                <path
                    d="M 50,50 m 0,-45 a 45,45 0 1 1 0,90 a 45,45 0 1 1 0,-90"
                    stroke="rgb(255,182,6)"
                    strokeWidth={2}
                    fillOpacity={0}
                    style={{
                        strokeDasharray: "282.783, 282.783",
                        strokeDashoffset: (per * 100).toString(),
                    }}
                />
            </svg>
            <div
                className="progressbar-text"
                style={{
                    position: "absolute",
                    left: "50%",
                    top: "50%",
                    padding: 0,
                    margin: 0,
                    transform: "translate(-50%, -50%)",
                    color: "rgb(255, 182, 6)",
                    fontFamily: "Roboto, sans-serif",
                    fontSize: 48,
                    fontWeight: 400,
                }}
            >
                {Math.floor(per * 100)}%
            </div>
        </div>
    );
}
function useGetResults(examId: string) {
    const user = useAppSelector((state) => state.auth.user!);
    return useQuery({
        queryKey: ["Results", "exam", examId],
        queryFn: async () => {
            return await getDocs(
                query(
                    createCollection("Results"),
                    where("userId", "==", user.id),
                    where("examId", "==", examId),
                    orderBy("startAt", "desc")
                )
            );
        },
    });
}

function createExam(
    doc: QueryDocumentSnapshot<DataBase["Exams"]>
): DataBase["Results"]["questions"] {
    const data = doc.data();
    if (data.random) {
        const questions: DataBase["Results"]["questions"] = [];
        for (let i = 0; i < data.num && data.questionIds.length > 0; i++) {
            const floor = Math.floor(Math.random() * data.questionIds.length);
            const elem = data.questionIds[floor];
            if (elem == undefined) break;
            data.questionIds.splice(floor, 1);
            questions.push({
                correctState: false,
                questionId: elem,
                state: "unvisited",
            });
        }
        return questions;
    }
    if (data.shuffle) data.questionIds = shuffle(data.questionIds);

    return data.questionIds.map((id) => ({
        correctState: false,
        questionId: id,
        state: "unvisited",
    }));
}
export function ResultsViewer({
    doc: exam,
}: {
    doc: QueryDocumentSnapshot<DataBase["Exams"]>;
}) {
    const { data: results } = useGetResults(exam.id);
    const router = useRouter();
    const curExam = results?.docs.find((result) => {
        const res = result.data();
        if (res.endAt) return false;
        return Date.now() - res.startAt.toDate().getTime() < exam.data().time;
    });
    const startState =
        curExam == undefined && (results?.empty || exam.data().repeatable);
    const user = useAppSelector((state) => state.auth.user!);
    const mutation = useMutation({
        mutationFn: async (newTodo) => {
            return await addDoc(createCollection("Results"), {
                examId: exam.id,
                startAt: serverTimestamp(),
                questions: createExam(exam),
                userId: user.id,
            });
        },
        onSuccess(data) {
            router.push(`/exams/take?id=${data.id}`);
        },
    });
    return (
        <div>
            <div className="tw-mb-4">
                {results?.docs.map((doc) => {
                    const questions = doc.data().questions;
                    const state =
                        !doc.data().endAt &&
                        Date.now() - doc.data().startAt.toDate().getTime() <
                            exam.data().time;
                    if (state) return null;
                    return (
                        <div key={doc.id}>
                            <Loader
                                per={
                                    questions.filter(
                                        (quest) => quest.correctState
                                    ).length / questions.length
                                }
                            />
                            <p className="tw-m-0 tw-font-semibold tw-text-gray-400 tw-leading-4">
                                Total Questions:{questions.length}
                            </p>
                            <p className="tw-m-0 tw-font-semibold tw-text-gray-400 tw-leading-4">
                                Wrong Questions:
                                {
                                    questions.filter(
                                        (quest) =>
                                            !quest.correctState && quest.answer
                                    ).length
                                }
                            </p>
                            <p className="tw-m-0 tw-font-semibold tw-text-gray-400 tw-leading-4">
                                UnAnswered Questions:
                                {
                                    questions.filter((quest) => !quest.answer)
                                        .length
                                }
                            </p>
                        </div>
                    );
                })}
            </div>
            <div>
                {startState && results && (
                    <button
                        type="button"
                        onClick={() => mutation.mutate()}
                        disabled={mutation.isLoading}
                        className="button button_color_1 text-center trans_200 tw-border-none focus:tw-outline-none tw-cursor-pointer"
                    >
                        <span>
                            {results.empty && "Start Exam"}
                            {!results.empty &&
                                exam.data().repeatable &&
                                "Retake Exam"}
                        </span>
                    </button>
                )}
                {!startState && results && !exam.data().repeatable && (
                    <p className="tw-text-2xl tw-mt-10 tw-font-bold tw-text-black">
                        You can{"'"}t retake the exam
                    </p>
                )}
                {curExam && (
                    <div className="button button_color_1 text-center trans_200">
                        <Link href={`/exams/take?id=${curExam.id}`}>
                            Continue Exam
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
