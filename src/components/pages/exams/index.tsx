import { CircularProgressbar } from "react-circular-progressbar";
import { useMutation, useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/router";
import { ExamType } from "@/firebase/func/data/exam";
import { createResult, getResultsExam } from "@/firebase/func/data/results";
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
    return useQuery({
        enabled: typeof examId == "string",
        queryKey: ["Results", "exam", examId],
        queryFn: async () => {
            return await getResultsExam(examId);
        },
    });
}

export function ResultsViewer({ doc: exam }: { doc: ExamType }) {
    const { data } = useGetResults(exam.id);

    const router = useRouter();
    const mutation = useMutation({
        mutationFn: async (newTodo) => {
            return await createResult();
        },
        onSuccess(data) {
            if (data.data.success)
                router.push(`/exams/take?id=${data.data.data.result.id}`);
        },
    });
    if (!data?.data.success) return null;
    const results = data.data.data.results;
    const curExam = results.find((res) => {
        if (res.endAt) return false;
        const s: number = new Date(res.startAt).getTime() || Date.now();
        return Date.now() - s < exam.time;
    });
    const startState =
        curExam == undefined && (results.length == 0 || exam.repeatable);

    return (
        <div>
            <div className="tw-mb-4 tw-flex tw-flex-wrap tw-gap-5">
                {results.map((doc) => {
                    const questions = doc.questions;
                    const state =
                        !doc.endAt &&
                        Date.now() - new Date(doc.startAt).getTime() <
                            exam.time;
                    if (state) return null;
                    return (
                        <div key={doc.id}>
                            <Link
                                href={`/exams/take?id=${doc.id}`}
                                className="hover:tw-opacity-70"
                            >
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
                            {results.length == 0 && "Start Exam"}
                            {results.length != 0 &&
                                exam.repeatable &&
                                "Retake Exam"}
                        </span>
                    </button>
                )}
                {!startState && results && !exam.repeatable && (
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
