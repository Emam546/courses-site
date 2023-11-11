import { CircularProgressbar } from "react-circular-progressbar";
import { useMutation, useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/router";
import { ExamType } from "@/firebase/func/data/exam";
import {
    ResultsExamsType,
    createResult,
    getResultsExam,
} from "@/firebase/func/data/results";
import { ErrorMessage, wrapRequest } from "@/utils/wrapRequest";
import queryClient from "@/queryClient";
import ErrorShower from "@/components/error";
export function LoaderComponent({ per, text }: { per: number; text: string }) {
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
            return await wrapRequest(getResultsExam(examId));
        },
        onError(err: ErrorMessage) {},
    });
}
type ResultType = {
    results: ResultsExamsType[];
};
export function ResultsViewer({ doc: exam }: { doc: ExamType }) {
    const { data, error, isLoading } = useGetResults(exam.id);

    const router = useRouter();
    const createExamMutation = useMutation({
        mutationFn: async () => {
            return await wrapRequest(createResult(exam.id));
        },
        onSuccess(data) {
            router.push(`/exams/take?id=${data.result.id}`).then(() => {
                const results = queryClient.getQueryData<ResultType>([
                    "Results",
                    "exam",
                    exam.id,
                ]) || { results: [] };
                queryClient.setQueryData<ResultType>(
                    ["Results", "exam", exam.id],
                    {
                        results: [...results.results, data.result],
                    }
                );
            });
        },
    });
    if (isLoading) return null;
    if (error) return <ErrorShower err={error} />;
    const results = data.results.filter((doc) => doc.endAt);
    const curExam = data.results.find((res) => {
        if (res.endAt) return false;
        return true;
    });
    const startState =
        curExam == undefined && (results.length == 0 || exam.repeatable);

    return (
        <div>
            {results.length > 0 && (
                <div className="tw-mb-4 tw-flex tw-flex-wrap tw-gap-5">
                    {results.map((doc) => {
                        const questions = doc.questions;
                        return (
                            <div key={doc.id}>
                                <Link
                                    href={`/exams/take?id=${doc.id}`}
                                    className="hover:tw-opacity-70"
                                >
                                    <LoaderComponent
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
            )}

            <div className="tw-space-y-4">
                {startState && results && (
                    <button
                        type="button"
                        onClick={() => createExamMutation.mutate()}
                        disabled={createExamMutation.isLoading}
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
                    <p className="tw-text-lg tw-font-medium tw-text-black">
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
