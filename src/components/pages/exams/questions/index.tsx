import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import DeleteDialog from "@/components/common/deleteDailog";
import { Navigation } from "./navigation";
import { CountDown } from "./countDown";
import { useMutation } from "@tanstack/react-query";
import queryClient from "@/queryClient";
import Loader from "@/components/loader";
import Question from "./quest";
import { GoToButton } from "@/components/common/addButton";
import { ExamType } from "@/firebase/func/data/exam";
import { ResultType, endExam, sendAnswers } from "@/firebase/func/data/results";
import { ErrorMessageCom } from "@/components/handelErrorMessage";
import { useGetQuestion, useGetResult, setQuestionsResults } from "./hooks";
import { useForceUpdate } from "@/hooks";

function EndTest({ onEnd }: { onEnd: () => any }) {
    const [state, setState] = useState(false);
    return (
        <>
            <button
                type="button"
                className="submit-button"
                onClick={async () => {
                    setState(true);
                }}
            >
                End Test
            </button>
            <DeleteDialog
                onAccept={async () => {
                    await onEnd();
                    queryClient.removeQueries({
                        queryKey: ["Results"],
                    });
                    setState(false);
                }}
                onClose={function () {
                    setState(false);
                }}
                open={state}
                data={{
                    title: "End The Test",
                    desc: "Do You Want To End The Exam now?",
                    accept: "End",
                    deny: "No",
                }}
            />
        </>
    );
}

interface MainProps {
    result: ResultType;
    endState: boolean;
    exam: DataBase.DataBase.WithIdType<DataBase["Exams"]>;
    onAnswer: (id: string, answer: string) => any;
    onState: (
        id: string,
        state: DataBase["Results"]["questions"][0]["state"]
    ) => any;
    onEnd: () => any;
}

function Main({ result, endState, exam, onState, onAnswer, onEnd }: MainProps) {
    const router = useRouter();
    const curId = router.query.quest;
    const [curQuest, setCurQuest] = useState(
        curId ? result.questions.findIndex((val) => val.questionId == curId) : 0
    );
    const { data: quest } = useGetQuestion(
        result.questions[curQuest].questionId
    );
    const [curAnswer, setCurAnswer] = useState<string>();

    const submitAnswer = useMutation({
        mutationFn: async () => {
            await onAnswer(questions[curQuest].questionId, curAnswer!);
        },
    });
    const navigating = useMutation({
        mutationFn: async (i: number) => {
            if (endState) return;
            await onState(questions[curQuest].questionId, "visited");
        },
        onSuccess(data, i) {
            setCurQuest(i);
        },
    });
    const [dest, setDest] = useState<number>();

    useEffect(() => {
        setCurAnswer(result.questions[curQuest].answer);
    }, [quest]);
    useEffect(() => {
        router.push(
            `/exams/take?id=${result.id}&quest=${result.questions[curQuest].questionId}`
        );
    }, [curQuest]);
    useEffect(() => {
        if (curId)
            setCurQuest(
                result.questions.findIndex((val) => val.questionId == curId)
            );
    }, [router.query.quest]);
    const questions = result.questions;

    const startAt: Date = new Date(result.startAt);
    const submitState =
        (!curAnswer || result.questions[curQuest].answer != curAnswer) &&
        !endState;
    return (
        <>
            <div className="quiz-app tw-flex tw-flex-col tw-items-stretch tw-min-h-screen">
                <div className="tw-flex-1">
                    <div className="quiz-info">
                        <div className="category">{exam.name}</div>
                        <div className="count">
                            Questions Count: {result.questions.length}
                        </div>
                    </div>
                    {quest && (
                        <Question
                            endState={endState}
                            curAnswer={curAnswer}
                            onAnswer={(val) => setCurAnswer(val)}
                            quest={quest.question}
                            correctAnswer={
                                result.questions[curQuest].correctAnswer
                            }
                        />
                    )}
                </div>
                <div>
                    <button
                        type="button"
                        className="submit-button"
                        onClick={() => {
                            if (submitState) {
                                if (!curAnswer)
                                    return alert("choose an answer first");
                                return submitAnswer.mutate();
                            }
                            if (questions.length != curQuest + 1)
                                return navigating.mutate(curQuest + 1);
                            navigating.mutate(0);
                        }}
                        disabled={
                            submitAnswer.isLoading || navigating.isLoading
                        }
                    >
                        {submitState
                            ? "Submit Answer"
                            : questions.length == curQuest + 1
                            ? "Get To First Question"
                            : "Next Question"}
                    </button>
                    <div className="tw-flex">
                        <div className="tw-flex-1">
                            <Navigation
                                questions={result.questions}
                                selected={curQuest}
                                onSelect={function (i: number) {
                                    if (submitState) return setDest(i);
                                    navigating.mutate(i);
                                }}
                                endState={endState}
                            />
                        </div>
                        {!endState && (
                            <CountDown
                                onFinish={onEnd}
                                remainingTime={
                                    exam.time - (Date.now() - startAt.getTime())
                                }
                            />
                        )}
                    </div>
                    {!endState && <EndTest onEnd={onEnd} />}
                </div>
                {endState && (
                    <div className="tw-my-5">
                        <GoToButton
                            label={"Go To The Exam"}
                            href={`/exams?id=${exam.id}`}
                        />
                    </div>
                )}
            </div>
            <DeleteDialog
                onAccept={async () => {
                    await navigating.mutateAsync(dest!);
                    setDest(undefined);
                }}
                onClose={function () {
                    setDest(undefined);
                }}
                open={typeof dest != "undefined"}
                data={{
                    title: "Question",
                    desc: "You have unsaved changes. Do you want to continue?",
                    accept: "Next Question",
                    deny: "Stay",
                }}
            />
        </>
    );
}

export interface Props {
    resultId: string;
    exam: ExamType;
    initialData?: ResultType;
}

export default function QuestionsViewer({
    resultId,
    exam,
    initialData,
}: Props) {
    const router = useRouter();
    const { data, error, isLoading } = useGetResult(resultId, {
        initialData: initialData ? { result: initialData } : undefined,
        onSuccess(data) {
            if (!router.query.quest)
                router.replace(
                    `/exams/take?id=${resultId}&quest=${data.result.questions[0].questionId}`
                );
        },
    });
    const forceUpdate = useForceUpdate();
    const mutateAnswer = useMutation({
        mutationKey: ["Results", resultId],
        mutationFn: async (questions: ResultType["questions"]) => {
            return sendAnswers(resultId, {
                questions: questions,
            });
        },
        onMutate(variables) {
            setQuestionsResults(resultId, variables);
            if (data) data.result.questions = variables;
            forceUpdate();
            return { previous: data!.result.questions };
        },
        onError(err, variables, context) {
            if (context?.previous)
                setQuestionsResults(resultId, context.previous);
            if (data) data.result.questions = variables;

            forceUpdate();
        },
    });
    if (isLoading) return <Loader />;
    if (error) return <ErrorMessageCom error={error} />;
    const result = data.result;
    function getEndState() {
        if (result.endAt) return true;
        const startAt = new Date(result.startAt);
        if (Date.now() - startAt.getTime() > result.time) return true;

        return false;
    }
    const endState = getEndState();
    return (
        <Main
            endState={endState}
            exam={{ ...exam, id: exam.id }}
            result={{ ...result, id: resultId }}
            onAnswer={async (id, answer) => {
                const newArr = [...result.questions];
                const curQuest = newArr.findIndex(
                    (val) => val.questionId == id
                );
                newArr[curQuest] = {
                    ...newArr[curQuest],
                    answer: answer,
                };
                await mutateAnswer.mutateAsync(newArr);
            }}
            onState={async (id, state) => {
                const newArr = [...result.questions];
                const curQuest = newArr.findIndex(
                    (val) => val.questionId == id
                );
                newArr[curQuest] = {
                    ...newArr[curQuest],
                    state,
                };
                await mutateAnswer.mutateAsync(newArr);
            }}
            onEnd={async () => {
                await endExam(resultId);
                await queryClient.refetchQueries(["Results", resultId]);
                await queryClient.refetchQueries(["Results", "exam", exam.id]);
                await router.push(`/exams?id=${exam.id}`);
            }}
        />
    );
}
