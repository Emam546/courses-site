import { DataBase } from "@/data";
import { useGetDoc } from "@/hooks/firebase";
import { shuffle } from "@/utils";
import draftToHtml from "draftjs-to-html";
import {
    QueryDocumentSnapshot,
    serverTimestamp,
    updateDoc,
} from "firebase/firestore";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import DeleteDialog from "@/components/common/deleteDailog";
import { useDocument } from "react-firebase-hooks/firestore";
import { getDocRef } from "@/firebase";
import { Navigation } from "./navigation";
import { CountDown } from "./countDown";
import { useMutation } from "@tanstack/react-query";
import queryClient from "@/queryClient";
export interface Props {
    resultId: string;
    exam: QueryDocumentSnapshot<DataBase["Exams"]>;
}
function EndTest({
    result,
}: {
    result: QueryDocumentSnapshot<DataBase["Results"]>;
}) {
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
                    await updateDoc(result.ref, {
                        endAt: serverTimestamp(),
                    });
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
export default function QuestionsViewer({ resultId, exam }: Props) {
    const [result] = useDocument(getDocRef("Results", resultId));
    const router = useRouter();
    const [curQuest, setCurQuest] = useState(0);
    const { data: quest } = useGetDoc(
        "Questions",
        result?.data()?.questions[curQuest].questionId
    );
    const [curAnswer, setCurAnswer] = useState<string>();
    const endState = useMemo<boolean>(() => {
        if (!result || !result.exists()) return false;
        const startAt: Date = result.data().startAt.toDate();

        if (Date.now() - startAt.getTime() > exam.data().time) return true;
        if (typeof result.data().endAt != "undefined") return true;
        return false;
    }, [result]);
    const submitAnswer = useMutation({
        mutationFn: async () => {
            const newArr = [...questions];
            newArr[curQuest] = {
                ...questions[curQuest],
                answer: curAnswer,
                correctState: quest?.data()?.answer == curAnswer,
            };
            await updateDoc(result!.ref, {
                questions: newArr,
            });
        },
    });
    const navigating = useMutation({
        mutationFn: async (i: number) => {
            const newArr = [...questions];
            newArr[curQuest] = { ...questions[curQuest], state: "visited" };
            await updateDoc(result!.ref, {
                questions: newArr,
            });
        },
        onSuccess(data, i, context) {
            setCurQuest(i);
        },
    });
    const [dest, setDest] = useState<number>();
    const choices = useMemo(() => {
        const choices = quest?.data()?.choices;
        if (quest?.data()?.shuffle && choices) return shuffle(choices);
        return choices;
    }, [quest]);
    useEffect(() => {
        setCurAnswer(result?.data()?.questions[curQuest].answer);
    }, [quest]);
    useEffect(() => {
        if (endState) router.push(`/exams?id=${result?.data()?.examId}`);
    }, [endState]);
    if (endState) return <div>Redirecting ...</div>;
    if (!result || !result.exists()) return null;
    const questions = result.data().questions;

    const startAt: Date = result.data().startAt.toDate();
    const submitState =
        !curAnswer || result.data().questions[curQuest].answer != curAnswer;
    return (
        <>
            <div className="quiz-app tw-flex tw-flex-col tw-items-stretch tw-min-h-screen">
                <div className="tw-flex-1">
                    <div className="quiz-info">
                        <div className="category">{exam.data().name}</div>
                        <div className="count">
                            Questions Count: {result.data().questions.length}
                        </div>
                    </div>
                    {quest && (
                        <>
                            <div
                                className="quiz-area"
                                dangerouslySetInnerHTML={{
                                    __html: draftToHtml(
                                        JSON.parse(quest.data()!.quest)
                                    ),
                                }}
                            />

                            <div className="options-area">
                                {choices?.map((choice) => {
                                    return (
                                        <div
                                            key={choice.id}
                                            className="option tw-flex tw-items-center"
                                        >
                                            <input
                                                name="options"
                                                type="radio"
                                                id={`option-${choice.id}`}
                                                data-option=""
                                                value={choice.id}
                                                checked={curAnswer == choice.id}
                                                onChange={(e) => {
                                                    setCurAnswer(
                                                        e.currentTarget.value
                                                    );
                                                }}
                                            />
                                            <label
                                                dangerouslySetInnerHTML={{
                                                    __html: draftToHtml(
                                                        JSON.parse(
                                                            choice.textContext
                                                        )
                                                    ),
                                                }}
                                                className="tw-flex-1 tw-self-stretch"
                                                htmlFor={`option-${choice.id}`}
                                            />
                                        </div>
                                    );
                                })}
                            </div>
                        </>
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
                                result={result}
                                selected={curQuest}
                                onSelect={function (i: number) {
                                    if (submitState) return setDest(i);
                                    navigating.mutate(i);
                                }}
                            />
                        </div>
                        <CountDown
                            onFinish={async () => {
                                await updateDoc(result.ref, {
                                    endAt: serverTimestamp(),
                                });
                            }}
                            remainingTime={
                                exam.data().time -
                                (Date.now() - startAt.getTime())
                            }
                        />
                    </div>
                    <EndTest result={result} />
                </div>
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
