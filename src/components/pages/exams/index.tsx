import { DataBase } from "@/data";
import { createCollection } from "@/firebase";
import { useAppSelector } from "@/store";
import { shuffle } from "@/utils";
import { CircularProgressbar } from "react-circular-progressbar";
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
import { useRef } from "react";
export function Loader({ per, text }: { per: number; text: string }) {
    const percent = Math.floor(per * 100);
    return (
        <div className="circle-progress tw-h-40 tw-w-40 tw-relative tw-m-0 ">
            <CircularProgressbar
                value={percent}
                text={`${percent}%`}
            />
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
                correctAnswer: "",
            });
        }
        return questions;
    }
    if (data.shuffle) data.questionIds = shuffle(data.questionIds);

    return data.questionIds.map((id) => ({
        correctState: false,
        questionId: id,
        state: "unvisited",
        correctAnswer: "",
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
        const s: number = res.startAt.toDate().getTime() || Date.now();
        return Date.now() - s < exam.data().time;
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
            <div className="tw-mb-4 tw-flex tw-flex-wrap tw-gap-5">
                {results?.docs.map((doc) => {
                    const questions = doc.data().questions;
                    const state =
                        !doc.data().endAt &&
                        Date.now() - doc.data().startAt.toDate().getTime() <
                            exam.data().time;
                    if (state) return null;
                    return (
                        <div key={doc.id}>
                            <Link href={`/exams/take?id=${doc.id}`} className="hover:tw-opacity-70">
                                <Loader
                                    per={
                                        questions.filter(
                                            (quest) => quest.correctState
                                        ).length / questions.length
                                    }
                                    text="Good"
                                />
                                <div className="tw-mt-3">
                                    <p className="tw-m-0 tw-leading-7 tw-text-lg">
                                        Total Questions:{questions.length}
                                    </p>
                                    <p className="tw-m-0 tw-leading-7 tw-text-lg">
                                        Wrong Questions:
                                        {
                                            questions.filter(
                                                (quest) =>
                                                    !quest.correctState &&
                                                    quest.answer
                                            ).length
                                        }
                                    </p>
                                    <p className="tw-m-0 tw-leading-7 tw-text-lg">
                                        UnAnswered Questions:
                                        {
                                            questions.filter(
                                                (quest) => !quest.answer
                                            ).length
                                        }
                                    </p>
                                </div>
                            </Link>
                        </div>
                    );
                })}
            </div>
            <div className="mt-5 tw-space-y-4">
                {startState && results && (
                    <button
                        type="button"
                        onClick={() => mutation.mutate()}
                        disabled={mutation.isLoading}
                        className="site-btn"
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
                    <Link
                        href={`/exams/take?id=${curExam.id}`}
                        className="site-btn"
                    >
                        Continue Exam
                    </Link>
                )}
            </div>
        </div>
    );
}
