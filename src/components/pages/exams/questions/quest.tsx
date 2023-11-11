import { DataBase, DataBase.WithIdType } from "@/data";
import draftToHtml from "draftjs-to-html";
import { QueryDocumentSnapshot } from "firebase/firestore";
import classNames from "classnames";
export interface Props {
    resultId: string;
    exam: QueryDocumentSnapshot<DataBase["Exams"]>;
}

export type QuestionProps = {
    quest?: DataBase.WithIdType<DataBase["Questions"]>;
    curAnswer?: string;
    onAnswer: (val: string) => any;
    endState: boolean;
    correctAnswer: string;
};
export default function Question({
    quest,
    curAnswer,
    correctAnswer,
    onAnswer,
    endState,
}: QuestionProps) {
    if (!quest)
        return <p className="tw-text-red-500">The question was deleted</p>;
    return (
        <>
            <div className="tw-relative">
                <div
                    className="quiz-area "
                    dangerouslySetInnerHTML={{
                        __html: draftToHtml(JSON.parse(quest!.quest)),
                    }}
                ></div>
                <span className="tw-absolute tw-top-0 tw-right-0 tw-text-gray-300">
                    {quest.createdAt.toDate().getTime()}
                </span>
            </div>

            <div
                className={classNames("options-area", {
                    endState: endState,
                })}
            >
                {quest.choices?.map((choice) => {
                    return (
                        <label
                            key={choice.id}
                            className={classNames(
                                "option tw-flex tw-items-center tw-gap-x-2",
                                endState
                                    ? {
                                          correct: correctAnswer == choice.id,
                                          notCorrect:
                                              curAnswer == choice.id &&
                                              correctAnswer != choice.id,
                                      }
                                    : undefined
                            )}
                        >
                            <input
                                name="options"
                                type="radio"
                                id={`option-${choice.id}`}
                                value={choice.id}
                                checked={curAnswer == choice.id}
                                onChange={(e) => {
                                    onAnswer(e.currentTarget.value);
                                }}
                                disabled={endState}
                            />
                            <div
                                dangerouslySetInnerHTML={{
                                    __html: draftToHtml(
                                        JSON.parse(choice.textContext)
                                    ),
                                }}
                                className="tw-flex-1 tw-self-stretch tw-m-0"
                            />
                        </label>
                    );
                })}
            </div>
        </>
    );
}
