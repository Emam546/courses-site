import PrimaryButton from "@/components/button";
import { MainCard } from "@/components/card";
import CheckedInput from "@/components/common/inputs/checked";
import MainInput from "@/components/common/inputs/main";
import TextArea from "@/components/common/inputs/textArea";
import { Grid2 } from "@/components/grid";
import { DataBase, WithIdType, WithOrder } from "@/data";
import { useForm } from "react-hook-form";
import QuestionViewer, { QuestionType } from "./addQuestions";
import { useEffect, useState } from "react";
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
}
export default function ExamInfoForm({
    defaultData,
    onData,
    buttonName,
}: Props) {
    const { register, handleSubmit, formState, watch, setValue } =
        useForm<DataType>({
            defaultValues: {
                ...defaultData,
            },
        });
    const [questionData, setQuestionData] = useState<QuestionType[]>([]);
    const randomVal = watch("random");
    useEffect(() => {
        setValue(
            "questionIds",
            questionData.map((v) => v.id)
        );
    }, [questionData]);
    return (
        <MainCard>
            <form
                action=""
                onSubmit={handleSubmit(async (data) => {
                    await onData(data);
                })}
            >
                <Grid2>
                    <MainInput
                        id={"name-input"}
                        title={"Exam Name"}
                        required
                        {...register("name", { required: true })}
                    />
                    <MainInput
                        title={"Question Number"}
                        {...register("num", { valueAsNumber: true })}
                        id={"num-input"}
                        type="number"
                        defaultValue={20}
                        disabled={!randomVal}
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
                        {...register("desc")}
                    />
                </div>
                <div>
                    <QuestionViewer
                        levelId={""}
                        onAdd={(questions) => setQuestionData(questions)}
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
