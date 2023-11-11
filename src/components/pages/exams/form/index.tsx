import PrimaryButton from "@/components/button";
import { MainCard } from "@/components/card";
import CheckedInput from "@/components/common/inputs/checked";
import MainInput, { ErrorInputShower } from "@/components/common/inputs/main";
import TextArea from "@/components/common/inputs/textArea";
import { Grid2 } from "@/components/grid";
import { useForm } from "react-hook-form";
import QuestionAdder, { QuestionType } from "./addQuestions";
import { useEffect, useState } from "react";
import QuestionInfoViewer from "../../questions/info/questionInfoViewer";
import { getDoc } from "firebase/firestore";
import { getDocRef } from "@/firebase";
import { SearchForm } from "../../questions/info";
export type DataType = {
    name: string;
    desc: string;
    hide: boolean;
    repeatable: boolean;
    questionIds: Array<string>;
    time: number;
} & (
    | {
          random: true;
          num: number;
      }
    | {
          random: false;
          shuffle: boolean;
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
    const [search, setSearch] = useState<string>();
    const searchState = search != "" && search != undefined;
    const searchResults = questionData.filter(
        (val) => val.createdAt.toDate().getTime() == parseInt(search as string)
    );
    useEffect(() => {
        setValue(
            "questionIds",
            questionData.map((v) => v.id)
        );
    }, [questionData]);
    register("questionIds", {
        required: "You Must provide some questions",
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
        <form
            onSubmit={handleSubmit(async (data) => {
                data.time = data.time * 1000 * 60;
                if (!(data as any).num) (data as any).num = 20;
                await onData(data);
            })}
            autoComplete="off"
        >
            <Grid2>
                <MainInput
                    id={"name-input"}
                    title={"Exam Name"}
                    {...register("name", {
                        required: "Please fill the input",
                        minLength: 8,
                    })}
                    err={formState.errors.name}
                />
                <MainInput
                    title={"Question Number"}
                    {...register("num", {
                        valueAsNumber: true,
                        required: "You must provide a number",
                        min: 1,
                        validate(value, data) {
                            if (value > data.questionIds.length)
                                return `the question number must be lower than or equal ${data.questionIds.length}`;
                        },
                        disabled: !randomVal,
                    })}
                    id={"num-input"}
                    defaultValue={20}
                    type="number"
                    err={(formState.errors as any)?.num}
                />
                <MainInput
                    title={"Exam Time"}
                    {...register("time", {
                        valueAsNumber: true,
                        required: "the field is required",

                        min: 1,
                    })}
                    id={"num-input"}
                    type="number"
                    placeholder="Time in minute"
                    err={formState.errors.time}
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
                                const state = acc.some((v) => v.id == cu.id);
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
                {questionData.length > 0 && (
                    <div className="tw-mb-2">
                        <SearchForm onSearch={setSearch} />
                    </div>
                )}

                <QuestionInfoViewer
                    data={
                        !searchState
                            ? questionData
                            : (searchResults as QuestionType[])
                    }
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
                    onResort={
                        !searchState
                            ? (indexes) => {
                                  setQuestionData(
                                      indexes.map((ci, i) => ({
                                          ...questionData[ci],
                                      }))
                                  );
                              }
                            : undefined
                    }
                />
                {searchState && searchResults.length == 0 && <p>no Results</p>}
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
    );
}
