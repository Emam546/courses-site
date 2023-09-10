import PrimaryButton from "@/components/button";
import { MainCard } from "@/components/card";
import CheckedInput from "@/components/common/inputs/checked";
import MainInput, { ErrorInputShower } from "@/components/common/inputs/main";
import TextArea from "@/components/common/inputs/textArea";
import { Grid2 } from "@/components/grid";
import { DataBase } from "@/data";
import { useForm } from "react-hook-form";
import QuestionAdder, { QuestionType } from "./addQuestions";
import { useEffect, useState } from "react";
import QuestionInfoViewer from "../../questions/info/questionInfoViewer";
import { getDoc } from "firebase/firestore";
import { getDocRef } from "@/firebase";
export type DataType = Omit<
    DataBase["Exams"],
    "lessonId" | "order" | "createdAt"
> &
    (
        | {
              random: true;
              num: number;
          }
        | {
              random: false;
              shuffle: false;
          }
    );
export interface Props {
    defaultData?: DataType;
    onData: (data: DataType) => Promise<any> | any;
    buttonName: string;
    lessonId: string;
}
export default function ExamInfoForm({
    defaultData,
    onData,
    buttonName,
    lessonId,
}: Props) {
    const { register, handleSubmit, formState, watch, setValue, getValues } =
        useForm<DataType>({
            defaultValues: defaultData && {
                ...defaultData,
                time: defaultData.time / (1000 * 60),
            },
        });
    const [questionData, setQuestionData] = useState<QuestionType[]>([]);
    const randomVal = watch("random");
    useEffect(() => {
        const cvalue = getValues("questionIds");
        if (!cvalue) return;
        Promise.all(
            cvalue.map(async (v) => {
                const res = await getDoc(getDocRef("Questions", v));
                if (!res.exists()) throw new Error("undefined Question Id");
                return res;
            })
        ).then((res) => {
            setQuestionData(res.map((v) => ({ ...v.data(), id: v.id })));
        });
    }, []);
    useEffect(() => {
        setValue(
            "questionIds",
            questionData.map((v) => v.id)
        );
    }, [questionData]);
    register("questionIds", {
        required: true,
        min: 1,
        validate(val, data) {
            if (data.random) {
                if (val.length < data.num)
                    return `The number of the questions must be larger than or equal ${data.num}`;
            }
            return true;
        },
    });
    return (
        <MainCard>
            <form
                onSubmit={handleSubmit(async (data) => {
                    data.time = data.time * 1000 * 60;
                    await onData(data);
                })}
            >
                <Grid2>
                    <MainInput
                        id={"name-input"}
                        title={"Exam Name"}
                        required
                        {...register("name", { required: true, minLength: 8 })}
                        err={formState.errors.name}
                    />
                    <MainInput
                        title={"Question Number"}
                        {...register("num", { valueAsNumber: true, min: 1 })}
                        id={"num-input"}
                        defaultValue={20}
                        type="number"
                        disabled={!randomVal}
                        err={(formState.errors as any)?.num}
                    />
                    <MainInput
                        title={"Exam Time"}
                        {...register("time", {
                            valueAsNumber: true,
                            required: true,
                            min: 1,
                        })}
                        id={"num-input"}
                        type="number"
                        placeholder="Time in minute"
                    />
                </Grid2>
                <Grid2 className="tw-my-3 tw-gap-y-0">
                    <div>
                        <CheckedInput
                            title={"Hide Exam"}
                            {...register("hide")}
                            id={"Hide-input"}
                        />
                        <CheckedInput
                            title={"Repeatable"}
                            {...register("repeatable")}
                            id={"repeatable-input"}
                        />
                    </div>
                    <div>
                        <CheckedInput
                            title={"Random Choosing"}
                            {...register("random")}
                            id={"random-input"}
                        />
                        <CheckedInput
                            title={"Shuffle Question"}
                            {...register("shuffle")}
                            id={"shuffle-input"}
                            disabled={randomVal}
                        />
                    </div>
                </Grid2>
                <div className="tw-my-3">
                    <TextArea
                        title="Description"
                        id="desc-input"
                        {...register("desc", { required: true })}
                        err={formState.errors.desc}
                    />
                </div>
                <div>
                    <QuestionAdder
                        lessonId={lessonId}
                        onAdd={(questions) => {
                            const g = [...questions, ...questionData].reduce(
                                (acc, cu) => {
                                    const state = acc.some(
                                        (v) => v.id == cu.id
                                    );
                                    if (state) return acc;
                                    return [...acc, cu];
                                },
                                [] as QuestionType[]
                            );
                            setQuestionData(g);
                        }}
                        currentQuestions={questionData}
                    />
                </div>
                <div>
                    <QuestionInfoViewer
                        data={questionData.map((v) => v)}
                        onDeleteElem={(v) => {
                            setQuestionData(
                                questionData
                                    .filter((cv) => cv.id != v.id)
                                    .map((cv, i) => ({
                                        ...cv,
                                        order: i,
                                    }))
                            );
                        }}
                        onResort={(indexes) => {
                            setQuestionData(
                                indexes.map((ci, i) => ({
                                    ...questionData[ci],
                                }))
                            );
                        }}
                    />
                    <ErrorInputShower
                        className="tw-mb-3"
                        err={formState.errors.questionIds as any}
                    />
                </div>
                <div className="tw-flex tw-justify-end">
                    <PrimaryButton
                        type="submit"
                        disabled={formState.isSubmitting}
                    >
                        {buttonName}
                    </PrimaryButton>
                </div>
            </form>
        </MainCard>
    );
}
