import { useGetDoc } from "@/hooks/fireStore";
import {
    QueryDocumentSnapshot,
    serverTimestamp,
    updateDoc,
} from "firebase/firestore";
import { useRouter } from "next/router";
import { useEffect, useLayoutEffect, useState } from "react";
import DeleteDialog from "@/components/common/AlertDialog";
import { useDocument } from "react-firebase-hooks/firestore";
import { getDocRef } from "@/firebase";
import { Navigation } from "./navigation";
import { CountDown } from "./countDown";
import { useMutation } from "@tanstack/react-query";
import queryClient from "@/queryClient";

import Question from "./quest";
import { GoToButton } from "@/components/common/inputs/addButton";
import ErrorShower from "@/components/common/error";

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
    result: DataBase.WithIdType<DataBase["Results"]>;
    endState: boolean;
    exam: DataBase.WithIdType<DataBase["Exams"]>;
    onAnswer: (id: string, answer: string, correctAnswer: string) => any;
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
    const { data: quest } = useGetDoc(
        "Questions",
        result.questions[curQuest].questionId
    );
    const [curAnswer, setCurAnswer] = useState<string>();
    const submitAnswer = useMutation({
        mutationFn: async () => {
            await onAnswer(
                questions[curQuest].questionId,
                curAnswer!,
                quest?.data()?.answer!
            );
        },
    });
    const navigating = useMutation({
        mutationFn: async (i: number) => {
            await onState(questions[curQuest].questionId, "visited");
        },
        onSuccess(data, i, context) {
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

    const startAt: Date = result.startAt.toDate();
    const submitState =
        !curAnswer || result.questions[curQuest].answer != curAnswer;
    return (
        <>
            <div className="quiz-app tw-flex tw-flex-col tw-items-stretch tw-min-h-screen tw-min-w-full">
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
                            quest={
                                quest.exists()
                                    ? { ...quest.data(), id: quest.id }
                                    : undefined
                            }
                            correctAnswer={
                                result.questions[curQuest].correctAnswer || ""
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
                        <GoToButton
                            label={"Go To The User"}
                            href={`/users/info?id=${result.userId}`}
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
    exam: QueryDocumentSnapshot<DataBase["Exams"]>;
}
export default function QuestionsViewer({ resultId, exam }: Props) {
    const router = useRouter();
    const [result, isLoading, error] = useDocument(
        getDocRef("Results", resultId)
    );
    useLayoutEffect(() => {
        if (!router.query.quest && result) {
            router.replace(
                `/exams/take?id=${result.id}&quest=${
                    result.data()?.questions[0].questionId
                }`
            );
        }
    }, [result?.id]);
    if (isLoading)
        return (
            <ErrorShower
                loading
                error={error}
            />
        );
    if (!result?.exists()) return <div>The Exam is not exist</div>;

    const handleNavigateWithoutHistory = () => {
        router.replace("/new-page"); // Use the replace method with the new URL
    };
    return (
        <Main
            endState
            exam={{ ...exam.data(), id: exam.id }}
            result={{ ...result.data(), id: resultId }}
            onAnswer={async (id, answer, correctAnswer) => {}}
            onState={async (id, state) => {}}
            onEnd={async () => {}}
        />
    );
}
