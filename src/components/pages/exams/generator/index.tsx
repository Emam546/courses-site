import PrimaryButton from "@/components/button";
import { CardTitle } from "@/components/card";
import CheckedInput, { RadioInput } from "@/components/common/inputs/checked";
import MainInput from "@/components/common/inputs/main";
import SelectInput from "@/components/common/inputs/select";
import { Grid2, Grid3 } from "@/components/grid";
import { ObjectEntries } from "@/utils";
import { DefaultValues, useForm } from "react-hook-form";
export type DirType = "rtl" | "ltr";

const States: Record<State, string> = {
    Blank: "Blank",
    Course: "All Course Students",
    Level: "All Levels Students",
};
export interface PaperData {
    header: {
        "0": string;
        "1": string;
        "2": string;
        "3": string;
        "4": string;
        "5": string;
    };
    footer: {
        left: string;
        center: string;
        right: string;
    };
    topper: {
        left: string;
        center: string;
        right: string;
    };
    dir: DirType;
    applyChoices: boolean;
}
export interface ExamPaperProps {
    defaultData?: DefaultValues<PaperData>;
    onData: (data: PaperData) => Promise<any> | any;
    buttonName: string;
}
export function ExamPaperForm({
    defaultData,
    buttonName,
    onData,
}: ExamPaperProps) {
    const { register, handleSubmit, formState, watch, setValue, getValues } =
        useForm<PaperData>({
            defaultValues: {
                header: defaultData?.header,
                dir: defaultData?.dir,
                footer: defaultData?.footer,
                applyChoices: defaultData?.applyChoices,
                topper: defaultData?.topper,
            },
        });
    return (
        <form
            onSubmit={handleSubmit(async (data) => {
                await onData(data);
            })}
            autoComplete="off"
        >
            <Grid2>
                <MainInput
                    id={"name-input"}
                    title={"First Area"}
                    {...register("header.0")}
                />
                <MainInput
                    id={"name-input"}
                    title={"Second Area"}
                    {...register("header.1")}
                />
                <MainInput
                    id={"name-input"}
                    title={"Third Area"}
                    {...register("header.2")}
                />
                <MainInput
                    id={"name-input"}
                    title={"Fourth Area"}
                    {...register("header.3")}
                />
                <MainInput
                    id={"name-input"}
                    title={"Fifth Area"}
                    {...register("header.4")}
                />
                <MainInput
                    id={"name-input"}
                    title={"Sixth Area"}
                    {...register("header.5")}
                />
            </Grid2>
            <CardTitle className="tw-mt-3 tw-mb-1 tw-font-semibold">
                Header
            </CardTitle>
            <Grid3>
                <MainInput
                    id={"name-input"}
                    title={"Left Area"}
                    {...register("topper.left")}
                />
                <MainInput
                    id={"name-input"}
                    title={"Center Area"}
                    {...register("topper.center")}
                />
                <MainInput
                    id={"name-input"}
                    title={"Right Area"}
                    {...register("topper.right")}
                />
            </Grid3>
            <CardTitle className="tw-mt-3 tw-mb-1 tw-font-semibold">
                Footer
            </CardTitle>
            <Grid3>
                <MainInput
                    id={"name-input"}
                    title={"Left Area"}
                    {...register("footer.left")}
                />
                <MainInput
                    id={"name-input"}
                    title={"Center Area"}
                    {...register("footer.center")}
                />
                <MainInput
                    id={"name-input"}
                    title={"Right Area"}
                    {...register("footer.right")}
                />
            </Grid3>
            <CardTitle className="tw-mt-3 tw-mb-2 tw-font-semibold">
                Paper Direction
            </CardTitle>
            <div className="tw-flex tw-gap-4">
                <RadioInput
                    title="Left to Right"
                    value={"ltr"}
                    {...register("dir")}
                />
                <RadioInput
                    title="Right to Left"
                    value={"rtl"}
                    {...register("dir")}
                />
            </div>
            <CheckedInput
                title="Apply Choices"
                id="apply-choices"
                {...register("applyChoices")}
            />
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

export type State = "Blank" | "Course" | "Level";
export type DataType = (
    | {
          random: true;
          num: number;
      }
    | {
          random: false;
          shuffle: boolean;
      }
) &
    (
        | { forStudents: "Level" | "Course" }
        | { examsNum: number; forStudents: "Blank" }
    );
export interface Props {
    defaultData?: DataType;
    onData: (data: DataType) => Promise<any> | any;
    buttonName: string;
    maxQuestionNumber: number;
}
export default function ExamGeneratorInfoForm({
    defaultData,
    onData,
    buttonName,
    maxQuestionNumber,
}: Props) {
    const { register, handleSubmit, formState, watch, setValue, getValues } =
        useForm<DataType>({
            defaultValues: defaultData,
        });
    const randomVal = watch("random");
    const forStudents = watch("forStudents");
    return (
        <form
            onSubmit={handleSubmit(async (data) => {
                await onData(data);
            })}
            autoComplete="off"
            className="tw-space-y-3"
        >
            <SelectInput
                title="Select Type"
                id="Select"
                {...register("forStudents")}
            >
                {ObjectEntries(States).map(([key, text]) => {
                    return (
                        <option
                            key={key}
                            value={key}
                        >
                            {text}
                        </option>
                    );
                })}
            </SelectInput>
            <MainInput
                title={"Exams Number"}
                {...register("examsNum", {
                    valueAsNumber: true,
                    required: "You must provide a number",
                    min: {
                        message: "The Number must be larger than 0",
                        value: 0,
                    },
                    max: {
                        message: "The Number is a little too much to generate",
                        value: 100,
                    },
                    disabled: forStudents != "Blank",
                })}
                id="exam-input"
                type="text"
                err={(formState.errors as any)?.examsNum}
            />
            <div>
                <MainInput
                    title={"Questions Number"}
                    {...register("num", {
                        valueAsNumber: true,
                        required: "You must provide a number",
                        min: 1,
                        max: {
                            message: `the question number must be lower than or equal ${maxQuestionNumber}`,
                            value: maxQuestionNumber,
                        },
                        disabled: !randomVal,
                    })}
                    id={"num-input"}
                    defaultValue={20}
                    err={(formState.errors as any)?.num}
                />
                <CheckedInput
                    title={"Random Choosing"}
                    {...register("random")}
                    id={"random-input"}
                />
            </div>

            <div>
                <p
                    className="tw-mb-0 aria-disabled:tw-text-gray-300"
                    aria-disabled={randomVal}
                >
                    There are {maxQuestionNumber} questions in this exam
                </p>
                <CheckedInput
                    title={"Shuffle Question"}
                    {...register("shuffle")}
                    id={"shuffle-input"}
                    disabled={randomVal}
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
